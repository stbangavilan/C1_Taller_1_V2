import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'inventarioApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'unidad-medida',
    data: { pageTitle: 'inventarioApp.unidadMedida.home.title' },
    loadChildren: () => import('./unidad-medida/unidad-medida.routes'),
  },
  {
    path: 'categoria',
    data: { pageTitle: 'inventarioApp.categoria.home.title' },
    loadChildren: () => import('./categoria/categoria.routes'),
  },
  {
    path: 'producto',
    data: { pageTitle: 'inventarioApp.producto.home.title' },
    loadChildren: () => import('./producto/producto.routes'),
  },
  {
    path: 'local',
    data: { pageTitle: 'inventarioApp.local.home.title' },
    loadChildren: () => import('./local/local.routes'),
  },
  {
    path: 'stock',
    data: { pageTitle: 'inventarioApp.stock.home.title' },
    loadChildren: () => import('./stock/stock.routes'),
  },
  {
    path: 'movimiento',
    data: { pageTitle: 'inventarioApp.movimiento.home.title' },
    loadChildren: () => import('./movimiento/movimiento.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
