import dayjs from 'dayjs/esm';

export interface ICategoria {
  id: number;
  nombre?: string | null;
  descripcion?: string | null;
  fechaCreacion?: dayjs.Dayjs | null;
  fechaModificacion?: dayjs.Dayjs | null;
  usuarioCreacion?: string | null;
  usuarioModificacion?: string | null;
}

export type NewCategoria = Omit<ICategoria, 'id'> & { id: null };
