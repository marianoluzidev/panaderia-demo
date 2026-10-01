# Panadería

Demo local para controlar el stock de una panadería: materias primas y materiales descartables. Permite ver faltantes, registrar entradas y salidas, actualizar el stock real, administrar artículos, registrar envíos desde la sucursal Central hacia otras sucursales y consultar los proveedores habituales.

No tiene backend, base de datos ni autenticación. Los datos iniciales viven en el código y los cambios de la sesión se guardan solo en memoria.

## Tecnologías

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

## Requisitos

- Node.js 22 o superior
- npm

## Instalación

```bash
npm install
```

## Ejecución local

```bash
npm run dev
```

Abrí la dirección que muestra la terminal. Por defecto es [http://localhost:5173](http://localhost:5173).

## Compilación

```bash
npm run build
```

Para ver el resultado compilado:

```bash
npm run preview
```

Para revisar el código:

```bash
npm run lint
```

## Persistencia

No hay servidor ni almacenamiento local. Al recargar la página, los artículos, los movimientos, los envíos y los proveedores vuelven a los datos iniciales.

Un envío en borrador no modifica el stock. Al confirmarlo, las cantidades se descuentan de Central y queda una salida por cada artículo.

Cada artículo tiene como máximo un proveedor habitual. Cambiarlo no modifica el stock ni genera movimientos. Todavía no hay pedidos de compra.

## Estructura

- `src/data`: artículos, sucursales, movimientos, envíos y proveedores iniciales.
- `src/types`: tipos de artículo, stock, movimiento, sucursal, envío y proveedor.
- `src/state`: estado de la demo, en memoria.
- `src/lib`: stock, fechas, cantidades, filtros y textos.
- `src/components`: piezas de interfaz reutilizables.
- `src/pages`: pantallas.
- `src/routes`: rutas de la aplicación.
- `src/assets/products`: ilustraciones de los productos.
