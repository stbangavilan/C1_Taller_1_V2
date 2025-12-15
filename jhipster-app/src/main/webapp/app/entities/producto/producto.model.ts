import dayjs from 'dayjs/esm';
import { IUnidadMedida } from 'app/entities/unidad-medida/unidad-medida.model';
import { ICategoria } from 'app/entities/categoria/categoria.model';

export interface IProducto {
  id: number;
  sku?: string | null;
  nombre?: string | null;
  pesoPorUnidadKg?: number | null;
  volumenPorUnidadL?: number | null;
  fechaCreacion?: dayjs.Dayjs | null;
  fechaModificacion?: dayjs.Dayjs | null;
  usuarioCreacion?: string | null;
  usuarioModificacion?: string | null;
  unidadMedida?: Pick<IUnidadMedida, 'id' | 'codigo'> | null;
  categoria?: Pick<ICategoria, 'id' | 'nombre'> | null;
}

export type NewProducto = Omit<IProducto, 'id'> & { id: null };
