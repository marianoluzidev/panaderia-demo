import type { Article } from '../../types/article.ts'

export function screenTitle(
  pathname: string,
  articles: readonly Article[],
): string {
  if (pathname === '/') {
    return 'Resumen de operación'
  }

  if (pathname === '/stock') {
    return 'Stock'
  }

  if (pathname === '/stock/actualizar') {
    return 'Actualizar stock'
  }

  if (pathname.startsWith('/stock/')) {
    const id = pathname.slice('/stock/'.length)
    return articles.find((article) => article.id === id)?.name ?? 'Artículo'
  }

  if (pathname === '/movimientos') {
    return 'Movimientos'
  }

  if (pathname === '/movimientos/nuevo') {
    return 'Nuevo movimiento'
  }

  if (pathname === '/envios') {
    return 'Envíos'
  }

  if (pathname === '/envios/nuevo') {
    return 'Nuevo envío'
  }

  if (pathname.startsWith('/envios/')) {
    return 'Envío'
  }

  if (pathname === '/articulos') {
    return 'Artículos'
  }

  if (pathname === '/articulos/nuevo') {
    return 'Nuevo artículo'
  }

  if (pathname.startsWith('/articulos/') && pathname.endsWith('/editar')) {
    return 'Editar artículo'
  }

  if (pathname === '/proveedores') {
    return 'Proveedores'
  }

  if (pathname === '/proveedores/nuevo') {
    return 'Nuevo proveedor'
  }

  if (pathname.startsWith('/proveedores/') && pathname.endsWith('/editar')) {
    return 'Editar proveedor'
  }

  if (pathname.startsWith('/proveedores/')) {
    return 'Proveedor'
  }

  return 'Página no encontrada'
}
