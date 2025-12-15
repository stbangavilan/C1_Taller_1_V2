import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import StockResolve from './route/stock-routing-resolve.service';

const stockRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/stock.component').then(m => m.StockComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/stock-detail.component').then(m => m.StockDetailComponent),
    resolve: {
      stock: StockResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/stock-update.component').then(m => m.StockUpdateComponent),
    resolve: {
      stock: StockResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/stock-update.component').then(m => m.StockUpdateComponent),
    resolve: {
      stock: StockResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default stockRoute;
