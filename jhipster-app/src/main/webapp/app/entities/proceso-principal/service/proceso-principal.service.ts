import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProcesoPrincipalRequestDTO {
  tipo: string; // 'ENTRADA' | 'SALIDA' | 'AJUSTE' | 'TRANSFERENCIA'
  productoId: number;
  cantidad: number; // o string si estás usando BigDecimal como string en backend
  localDestinoId?: number | null;
  localOrigenId?: number | null;
  referencia?: string | null;
}

export interface ProcesoPrincipalResponseDTO {
  id?: number;
  tipo?: string;
  cantidad?: number;
  referencia?: string;
  fechaMovimiento?: string;
  localOrigenId?: number;
  localDestinoId?: number;
  productoId?: number;
}

@Injectable({ providedIn: 'root' })
export class ProcesoPrincipalService {
  private resourceUrl = '/api/proceso-principal';

  constructor(private http: HttpClient) {}

  ejecutar(payload: ProcesoPrincipalRequestDTO): Observable<ProcesoPrincipalResponseDTO> {
    return this.http.post<ProcesoPrincipalResponseDTO>(this.resourceUrl, payload);
  }
}
