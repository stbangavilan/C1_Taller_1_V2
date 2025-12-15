import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUnidadMedida } from '../unidad-medida.model';
import { UnidadMedidaService } from '../service/unidad-medida.service';

const unidadMedidaResolve = (route: ActivatedRouteSnapshot): Observable<null | IUnidadMedida> => {
  const id = route.params.id;
  if (id) {
    return inject(UnidadMedidaService)
      .find(id)
      .pipe(
        mergeMap((unidadMedida: HttpResponse<IUnidadMedida>) => {
          if (unidadMedida.body) {
            return of(unidadMedida.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default unidadMedidaResolve;
