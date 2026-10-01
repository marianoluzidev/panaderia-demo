import {
  branchSucursal1Id,
  branchSucursal2Id,
  centralBranchId,
} from './branches.ts'
import type { Shipment } from '../types/shipment.ts'

export const shipments: Shipment[] = [
  {
    id: 'env-borrador-0928',
    originBranchId: centralBranchId,
    destinationBranchId: branchSucursal2Id,
    status: 'draft',
    createdAt: '2026-09-28T16:00:00',
    note: 'Falta revisar antes de enviar',
    items: [
      { articleId: 'art-azucar', quantity: 2 },
      { articleId: 'art-aceite', quantity: 1 },
      { articleId: 'art-guantes', quantity: 10 },
    ],
  },
  {
    id: 'env-s2-0924',
    originBranchId: centralBranchId,
    destinationBranchId: branchSucursal2Id,
    status: 'confirmed',
    createdAt: '2026-09-24T15:00:00',
    confirmedAt: '2026-09-24T15:30:00',
    note: 'Reposición de la semana',
    items: [
      { articleId: 'art-levadura', quantity: 1 },
      { articleId: 'art-servilletas', quantity: 2 },
      { articleId: 'art-cajas', quantity: 10 },
    ],
  },
  {
    id: 'env-s1-0917',
    originBranchId: centralBranchId,
    destinationBranchId: branchSucursal1Id,
    status: 'confirmed',
    createdAt: '2026-09-17T10:30:00',
    confirmedAt: '2026-09-17T11:00:00',
    note: 'Pedido semanal',
    items: [
      { articleId: 'art-harina', quantity: 4 },
      { articleId: 'art-bolsas', quantity: 30 },
      { articleId: 'art-vasos', quantity: 2 },
    ],
  },
  {
    id: 'env-s1-0825',
    originBranchId: centralBranchId,
    destinationBranchId: branchSucursal1Id,
    status: 'confirmed',
    createdAt: '2026-08-25T09:40:00',
    confirmedAt: '2026-08-25T10:00:00',
    items: [
      { articleId: 'art-margarina', quantity: 4 },
      { articleId: 'art-guantes', quantity: 20 },
    ],
  },
]
