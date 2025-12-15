import dayjs from 'dayjs/esm';
import { IProducto } from 'app/entities/producto/producto.model';
import { ILocal } from 'app/entities/local/local.model';
import { TipoMovimiento } from 'app/entities/enumerations/tipo-movimiento.model';

export interface IMovimiento {
  id: number;
  tipo?: keyof typeof TipoMovimiento | null;
  cantidad?: number | null;
  referencia?: string | null;
  fechaMovimiento?: dayjs.Dayjs | null;
  fechaCreacion?: dayjs.Dayjs | null;
  fechaModificacion?: dayjs.Dayjs | null;
  usuarioCreacion?: string | null;
  usuarioModificacion?: string | null;
  producto?: Pick<IProducto, 'id' | 'nombre'> | null;
  localOrigen?: Pick<ILocal, 'id' | 'nombre'> | null;
  localDestino?: Pick<ILocal, 'id' | 'nombre'> | null;
}

export type NewMovimiento = Omit<IMovimiento, 'id'> & { id: null };
