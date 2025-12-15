import dayjs from 'dayjs/esm';

export interface ILocal {
  id: number;
  nombre?: string | null;
  ubicacion?: string | null;
  fechaCreacion?: dayjs.Dayjs | null;
  fechaModificacion?: dayjs.Dayjs | null;
  usuarioCreacion?: string | null;
  usuarioModificacion?: string | null;
}

export type NewLocal = Omit<ILocal, 'id'> & { id: null };
