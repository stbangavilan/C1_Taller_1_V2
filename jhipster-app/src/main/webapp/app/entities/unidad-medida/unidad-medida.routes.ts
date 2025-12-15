import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import UnidadMedidaResolve from './route/unidad-medida-routing-resolve.service';

const unidadMedidaRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/unidad-medida.component').then(m => m.UnidadMedidaComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/unidad-medida-detail.component').then(m => m.UnidadMedidaDetailComponent),
    resolve: {
      unidadMedida: UnidadMedidaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/unidad-medida-update.component').then(m => m.UnidadMedidaUpdateComponent),
    resolve: {
      unidadMedida: UnidadMedidaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/unidad-medida-update.component').then(m => m.UnidadMedidaUpdateComponent),
    resolve: {
      unidadMedida: UnidadMedidaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default unidadMedidaRoute;
