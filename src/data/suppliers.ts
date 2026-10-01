import type { Supplier } from '../types/supplier.ts'

export const supplierMolinoId = 'sup-molino'
export const supplierCentroId = 'sup-centro'
export const supplierDescartablesId = 'sup-descartables'

export const suppliers: Supplier[] = [
  {
    id: supplierMolinoId,
    name: 'Molino Santa Fe',
    contactName: 'Carlos',
    phone: '0000-1001',
    notes: 'Harinas y secas de uso habitual.',
    createdAt: '2026-01-10T09:00:00',
  },
  {
    id: supplierCentroId,
    name: 'Distribuidora Centro',
    contactName: 'Laura',
    phone: '0000-1002',
    notes: 'Materias primas refrigeradas y de almacén.',
    createdAt: '2026-01-12T09:00:00',
  },
  {
    id: supplierDescartablesId,
    name: 'Descartables del Litoral',
    contactName: 'Martín',
    phone: '0000-1003',
    notes: 'Vasos, bolsas y otros descartables.',
    createdAt: '2026-01-15T09:00:00',
  },
]
