import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { articles as initialArticles } from '../data/articles.ts'
import { branches as initialBranches } from '../data/branches.ts'
import { movements as initialMovements } from '../data/movements.ts'
import { shipments as initialShipments } from '../data/shipments.ts'
import { suppliers as initialSuppliers } from '../data/suppliers.ts'
import { resolveArticleIllustration } from '../lib/articleIllustration.ts'
import { isDuplicateArticleName } from '../lib/articleForm.ts'
import { isDuplicateSupplierName, supplierPhoneError } from '../lib/suppliers.ts'
import { formatLocalIso } from '../lib/dates.ts'
import { nextStockAfterMovement } from '../lib/movementForm.ts'
import { maxRealQuantity, roundQuantity } from '../lib/quantityInput.ts'
import {
  centralBranch,
  normalizeShipmentItems,
  shipmentConfirmError,
  shipmentDraftError,
} from '../lib/shipments.ts'
import type { Article } from '../types/article.ts'
import type { Branch } from '../types/branch.ts'
import type { StockMovement } from '../types/movement.ts'
import type { Shipment, ShipmentInput } from '../types/shipment.ts'
import type { Supplier, SupplierInput } from '../types/supplier.ts'
import {
  StockDemoContext,
  type ArticleDraft,
  type ArticleUpdate,
  type MovementDraft,
  type RealStockUpdate,
  type ShipmentSaveResult,
} from './stockDemoContext.ts'

type StockDemoProviderProps = {
  children: ReactNode
}

export function StockDemoProvider({ children }: StockDemoProviderProps) {
  const [articles, setArticles] = useState<Article[]>(() =>
    initialArticles.map((article) => ({ ...article })),
  )
  const [movements, setMovements] = useState<StockMovement[]>(() =>
    initialMovements.map((movement) => ({ ...movement })),
  )
  const [branches] = useState<Branch[]>(() =>
    initialBranches.map((branch) => ({ ...branch })),
  )
  const [suppliers, setSuppliers] = useState<Supplier[]>(() =>
    initialSuppliers.map((supplier) => ({ ...supplier })),
  )
  const [shipments, setShipments] = useState<Shipment[]>(() =>
    initialShipments.map((shipment) => ({
      ...shipment,
      items: shipment.items.map((item) => ({ ...item })),
    })),
  )
  const articlesRef = useRef(articles)
  const shipmentsRef = useRef(shipments)
  const confirmLocks = useRef(new Set<string>())

  useEffect(() => {
    articlesRef.current = articles
    shipmentsRef.current = shipments
  }, [articles, shipments])

  const updateRealStock = useCallback(
    (update: RealStockUpdate) => {
      const article = articles.find((item) => item.id === update.articleId)

      if (!article) {
        return
      }

      const quantity = roundQuantity(update.quantity)
      const note = update.note?.trim()
      const checkedAt = formatLocalIso()

      setArticles((current) =>
        current.map((item) =>
          item.id === article.id
            ? { ...item, currentStock: quantity, lastStockCheckAt: checkedAt }
            : item,
        ),
      )
      setMovements((current) => [
        {
          id: `mov-conteo-${article.id}-${Date.now()}`,
          articleId: article.id,
          type: 'conteo',
          quantity: roundQuantity(quantity - article.currentStock),
          resultingStock: quantity,
          date: checkedAt,
          ...(note ? { note } : {}),
        },
        ...current,
      ])
    },
    [articles],
  )

  const registerMovement = useCallback(
    (draft: MovementDraft) => {
      const article = articles.find((item) => item.id === draft.articleId)

      if (!article) {
        return
      }

      const quantity = roundQuantity(draft.quantity)

      if (!(quantity > 0) || quantity > maxRealQuantity) {
        return
      }

      if (draft.type === 'salida' && quantity > article.currentStock) {
        return
      }

      const signed = draft.type === 'entrada' ? quantity : -quantity
      const resultingStock = roundQuantity(article.currentStock + signed)

      if (resultingStock < 0) {
        return
      }

      const note = draft.note?.trim()
      const date = formatLocalIso()

      setArticles((current) =>
        current.map((item) =>
          item.id === article.id
            ? { ...item, currentStock: resultingStock }
            : item,
        ),
      )
      setMovements((current) => [
        {
          id: `mov-${draft.type}-${article.id}-${Date.now()}`,
          articleId: article.id,
          type: draft.type,
          quantity: signed,
          resultingStock,
          date,
          ...(note ? { note } : {}),
        },
        ...current,
      ])
    },
    [articles],
  )

  const createArticle = useCallback(
    (draft: ArticleDraft) => {
      const name = draft.name.trim()
      const minimumStock = roundQuantity(draft.minimumStock)
      const initialStock = roundQuantity(draft.initialStock)

      if (
        name === '' ||
        isDuplicateArticleName(name, articles) ||
        minimumStock < 0 ||
        minimumStock > maxRealQuantity ||
        initialStock < 0 ||
        initialStock > maxRealQuantity ||
        !suppliers.some((supplier) => supplier.id === draft.preferredSupplierId)
      ) {
        return null
      }

      const note = draft.note?.trim()
      const id = `art-${Date.now()}`
      const createdAt = formatLocalIso()
      const article: Article = {
        id,
        name,
        category: draft.category,
        unit: draft.unit,
        minimumStock,
        currentStock: initialStock,
        illustration: resolveArticleIllustration(name, draft.category),
        lastStockCheckAt: null,
        preferredSupplierId: draft.preferredSupplierId,
        ...(note ? { note } : {}),
      }

      setArticles((current) => [...current, article])

      if (initialStock > 0) {
        setMovements((current) => [
          {
            id: `mov-ajuste-${id}`,
            articleId: id,
            type: 'ajuste',
            quantity: initialStock,
            resultingStock: initialStock,
            date: createdAt,
            note: 'Stock inicial',
          },
          ...current,
        ])
      }

      return id
    },
    [articles, suppliers],
  )

  const updateArticle = useCallback(
    (update: ArticleUpdate) => {
      const name = update.name.trim()
      const minimumStock = roundQuantity(update.minimumStock)
      const existing = articles.find((article) => article.id === update.id)

      if (
        !existing ||
        name === '' ||
        isDuplicateArticleName(name, articles, update.id) ||
        minimumStock < 0 ||
        minimumStock > maxRealQuantity ||
        !suppliers.some((supplier) => supplier.id === update.preferredSupplierId)
      ) {
        return false
      }

      const note = update.note?.trim()

      setArticles((current) =>
        current.map((item) => {
          if (item.id !== update.id) {
            return item
          }

          return {
            id: item.id,
            name,
            category: update.category,
            unit: update.unit,
            minimumStock,
            currentStock: item.currentStock,
            illustration: resolveArticleIllustration(name, update.category),
            lastStockCheckAt: item.lastStockCheckAt,
            preferredSupplierId: update.preferredSupplierId,
            ...(note ? { note } : {}),
          }
        }),
      )

      return true
    },
    [articles, suppliers],
  )

  const createSupplier = useCallback(
    (input: SupplierInput) => {
      const name = input.name.trim()
      const phone = input.phone.trim()

      if (
        name === '' ||
        isDuplicateSupplierName(name, suppliers) ||
        supplierPhoneError(phone)
      ) {
        return null
      }

      const contactName = input.contactName?.trim()
      const notes = input.notes?.trim()
      const supplier: Supplier = {
        id: `sup-${Date.now()}`,
        name,
        phone,
        createdAt: formatLocalIso(),
        ...(contactName ? { contactName } : {}),
        ...(notes ? { notes } : {}),
      }

      setSuppliers((current) => [...current, supplier])
      return supplier.id
    },
    [suppliers],
  )

  const updateSupplier = useCallback(
    (id: string, input: SupplierInput) => {
      const name = input.name.trim()
      const phone = input.phone.trim()
      const existing = suppliers.find((supplier) => supplier.id === id)

      if (
        !existing ||
        name === '' ||
        isDuplicateSupplierName(name, suppliers, id) ||
        supplierPhoneError(phone)
      ) {
        return false
      }

      const contactName = input.contactName?.trim()
      const notes = input.notes?.trim()

      setSuppliers((current) =>
        current.map((supplier) => {
          if (supplier.id !== id) {
            return supplier
          }

          return {
            id: supplier.id,
            name,
            phone,
            createdAt: supplier.createdAt,
            ...(contactName ? { contactName } : {}),
            ...(notes ? { notes } : {}),
          }
        }),
      )

      return true
    },
    [suppliers],
  )

  const assignSupplierToArticle = useCallback(
    (articleId: string, supplierId: string) => {
      const article = articles.find((item) => item.id === articleId)
      const supplier = suppliers.find((item) => item.id === supplierId)

      if (!article || !supplier) {
        return false
      }

      if (article.preferredSupplierId === supplierId) {
        return true
      }

      setArticles((current) =>
        current.map((item) =>
          item.id === articleId ? { ...item, preferredSupplierId: supplierId } : item,
        ),
      )

      return true
    },
    [articles, suppliers],
  )

  const createShipment = useCallback(
    (input: ShipmentInput) => {
      const origin = centralBranch(branches)
      const items = normalizeShipmentItems(input.items)
      const error = shipmentDraftError(input.destinationBranchId, items, branches)

      if (!origin || error) {
        return null
      }

      const note = input.note?.trim()
      const shipment: Shipment = {
        id: `env-${Date.now()}`,
        originBranchId: origin.id,
        destinationBranchId: input.destinationBranchId,
        status: 'draft',
        createdAt: formatLocalIso(),
        items,
        ...(note ? { note } : {}),
      }

      shipmentsRef.current = [shipment, ...shipmentsRef.current]
      setShipments(shipmentsRef.current)
      return shipment.id
    },
    [branches],
  )

  const updateShipment = useCallback(
    (id: string, input: ShipmentInput) => {
      const existing = shipmentsRef.current.find((shipment) => shipment.id === id)

      if (!existing || existing.status !== 'draft') {
        return false
      }

      const items = normalizeShipmentItems(input.items)
      const error = shipmentDraftError(input.destinationBranchId, items, branches)

      if (error) {
        return false
      }

      const note = input.note?.trim()
      shipmentsRef.current = shipmentsRef.current.map((shipment) => {
        if (shipment.id !== id) {
          return shipment
        }

        return {
          id: shipment.id,
          originBranchId: shipment.originBranchId,
          destinationBranchId: input.destinationBranchId,
          status: 'draft' as const,
          createdAt: shipment.createdAt,
          items,
          ...(note ? { note } : {}),
        }
      })
      setShipments(shipmentsRef.current)
      return true
    },
    [branches],
  )

  const confirmShipment = useCallback(
    (id: string): ShipmentSaveResult => {
      const shipment = shipmentsRef.current.find((item) => item.id === id)

      if (!shipment) {
        return { ok: false, message: 'Envío no encontrado.' }
      }

      if (shipment.status === 'confirmed' || confirmLocks.current.has(id)) {
        return { ok: false, message: 'Este envío ya fue confirmado.' }
      }

      const error = shipmentConfirmError(shipment, articlesRef.current, branches)

      if (error) {
        return { ok: false, message: error }
      }

      const destination = branches.find(
        (branch) => branch.id === shipment.destinationBranchId,
      )

      if (!destination) {
        return { ok: false, message: 'Elegí una sucursal de destino.' }
      }

      confirmLocks.current.add(id)
      const confirmedAt = formatLocalIso()
      const note = `Envío a ${destination.name}`
      const stock = new Map(
        articlesRef.current.map((article) => [article.id, article.currentStock]),
      )
      const created: StockMovement[] = shipment.items.map((item) => {
        const current = stock.get(item.articleId) ?? 0
        const resultingStock = nextStockAfterMovement(current, 'salida', item.quantity)
        stock.set(item.articleId, resultingStock)

        return {
          id: `mov-envio-${id}-${item.articleId}`,
          articleId: item.articleId,
          type: 'salida' as const,
          quantity: roundQuantity(-item.quantity),
          resultingStock,
          date: confirmedAt,
          note,
          referenceType: 'shipment' as const,
          referenceId: id,
        }
      })

      articlesRef.current = articlesRef.current.map((article) => {
        const next = stock.get(article.id)

        if (next === undefined || next === article.currentStock) {
          return article
        }

        return { ...article, currentStock: next }
      })
      shipmentsRef.current = shipmentsRef.current.map((item) =>
        item.id === id ? { ...item, status: 'confirmed' as const, confirmedAt } : item,
      )
      setArticles(articlesRef.current)
      setMovements((current) => [...created, ...current])
      setShipments(shipmentsRef.current)
      return { ok: true, id }
    },
    [branches],
  )

  const value = useMemo(
    () => ({
      articles,
      movements,
      branches,
      shipments,
      suppliers,
      updateRealStock,
      registerMovement,
      createArticle,
      updateArticle,
      createSupplier,
      updateSupplier,
      assignSupplierToArticle,
      createShipment,
      updateShipment,
      confirmShipment,
    }),
    [
      articles,
      movements,
      branches,
      shipments,
      suppliers,
      updateRealStock,
      registerMovement,
      createArticle,
      updateArticle,
      createSupplier,
      updateSupplier,
      assignSupplierToArticle,
      createShipment,
      updateShipment,
      confirmShipment,
    ],
  )

  return (
    <StockDemoContext.Provider value={value}>
      {children}
    </StockDemoContext.Provider>
  )
}
