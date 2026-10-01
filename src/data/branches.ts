import type { Branch } from '../types/branch.ts'

export const centralBranchId = 'branch-central'
export const branchSucursal1Id = 'branch-sucursal-1'
export const branchSucursal2Id = 'branch-sucursal-2'

export const branches: Branch[] = [
  { id: centralBranchId, name: 'Central', isCentral: true },
  { id: branchSucursal1Id, name: 'Sucursal 1', isCentral: false },
  { id: branchSucursal2Id, name: 'Sucursal 2', isCentral: false },
]
