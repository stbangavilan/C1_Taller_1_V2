import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProcesoPrincipalRequest, ProcesoPrincipalResponse } from './proceso-principal.model';

@Injectable({ providedIn: 'root' })
export class ProcesoPrincipalService {
  private resourceUrl = '/api/proceso-principal';

  constructor(private http: HttpClient) {}

  ejecutar(payload: ProcesoPrincipalRequest): Observable<ProcesoPrincipalResponse> {
    return this.http.post<ProcesoPrincipalResponse>(this.resourceUrl, payload);
  }
}
