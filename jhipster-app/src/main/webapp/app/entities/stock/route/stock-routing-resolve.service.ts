import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStock } from '../stock.model';
import { StockService } from '../service/stock.service';

const stockResolve = (route: ActivatedRouteSnapshot): Observable<null | IStock> => {
  const id = route.params.id;
  if (id) {
    return inject(StockService)
      .find(id)
      .pipe(
        mergeMap((stock: HttpResponse<IStock>) => {
          if (stock.body) {
            return of(stock.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default stockResolve;
