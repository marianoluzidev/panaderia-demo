import { Route, Routes } from 'react-router'
import { AppLayout } from '../components/layout/AppLayout.tsx'
import { ScrollToTop } from '../components/layout/ScrollToTop.tsx'
import { ArticleDetailPage } from '../pages/ArticleDetailPage.tsx'
import { ArticlesPage } from '../pages/ArticlesPage.tsx'
import { EditArticlePage } from '../pages/EditArticlePage.tsx'
import { NewArticlePage } from '../pages/NewArticlePage.tsx'
import { HomePage } from '../pages/HomePage.tsx'
import { MovementsPage } from '../pages/MovementsPage.tsx'
import { NewMovementPage } from '../pages/NewMovementPage.tsx'
import { NewShipmentPage } from '../pages/NewShipmentPage.tsx'
import { ShipmentDetailPage } from '../pages/ShipmentDetailPage.tsx'
import { ShipmentsPage } from '../pages/ShipmentsPage.tsx'
import { EditSupplierPage } from '../pages/EditSupplierPage.tsx'
import { NewSupplierPage } from '../pages/NewSupplierPage.tsx'
import { SupplierDetailPage } from '../pages/SupplierDetailPage.tsx'
import { SuppliersPage } from '../pages/SuppliersPage.tsx'
import { NotFoundPage } from '../pages/NotFoundPage.tsx'
import { StockPage } from '../pages/StockPage.tsx'
import { UpdateStockPage } from '../pages/UpdateStockPage.tsx'

export function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="stock" element={<StockPage />} />
          <Route path="stock/actualizar" element={<UpdateStockPage />} />
          <Route path="stock/:articleId" element={<ArticleDetailPage />} />
          <Route path="movimientos" element={<MovementsPage />} />
          <Route path="movimientos/nuevo" element={<NewMovementPage />} />
          <Route path="envios" element={<ShipmentsPage />} />
          <Route path="envios/nuevo" element={<NewShipmentPage />} />
          <Route path="envios/:id" element={<ShipmentDetailPage />} />
          <Route path="articulos" element={<ArticlesPage />} />
          <Route path="articulos/nuevo" element={<NewArticlePage />} />
          <Route path="articulos/:id/editar" element={<EditArticlePage />} />
          <Route path="proveedores" element={<SuppliersPage />} />
          <Route path="proveedores/nuevo" element={<NewSupplierPage />} />
          <Route path="proveedores/:id/editar" element={<EditSupplierPage />} />
          <Route path="proveedores/:id" element={<SupplierDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}
