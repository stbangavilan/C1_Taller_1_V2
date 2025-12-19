export type TipoMovimiento = 'ENTRADA' | 'SALIDA' | 'TRANSFERENCIA' | 'AJUSTE';

export interface ProcesoPrincipalRequest {
  tipo: TipoMovimiento;
  productoId: number;
  cantidad: number;
  localDestinoId?: number | null;
  localOrigenId?: number | null;
  referencia?: string | null;
}

export interface ProductoLite {
  id: number;
  sku?: string | null;
  nombre?: string | null;
}

export interface LocalLite {
  id: number;
  nombre?: string | null;
  ubicacion?: string | null;
}

export interface ProcesoPrincipalResponse {
  id: number;
  tipo: TipoMovimiento;
  cantidad: number;
  referencia?: string | null;
  fechaMovimiento?: string | null;
  producto?: ProductoLite | null;
  localOrigen?: LocalLite | null;
  localDestino?: LocalLite | null;
}
