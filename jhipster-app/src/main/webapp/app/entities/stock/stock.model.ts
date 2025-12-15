import { IProducto } from 'app/entities/producto/producto.model';
import { ILocal } from 'app/entities/local/local.model';

export interface IStock {
  id: number;
  cantidad?: number | null;
  producto?: Pick<IProducto, 'id' | 'nombre'> | null;
  local?: Pick<ILocal, 'id' | 'nombre'> | null;
}

export type NewStock = Omit<IStock, 'id'> & { id: null };
