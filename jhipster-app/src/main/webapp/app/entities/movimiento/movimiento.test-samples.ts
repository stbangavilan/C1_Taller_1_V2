import dayjs from 'dayjs/esm';

import { IMovimiento, NewMovimiento } from './movimiento.model';

export const sampleWithRequiredData: IMovimiento = {
  id: 29718,
  tipo: 'ENTRADA',
  cantidad: 3687.22,
  fechaMovimiento: dayjs('2025-12-06T07:39'),
};

export const sampleWithPartialData: IMovimiento = {
  id: 29645,
  tipo: 'AJUSTE',
  cantidad: 18617.26,
  referencia: 'unless never considering',
  fechaMovimiento: dayjs('2025-12-06T08:35'),
  usuarioCreacion: 'whether decryption',
  usuarioModificacion: 'er',
};

export const sampleWithFullData: IMovimiento = {
  id: 11194,
  tipo: 'TRANSFERENCIA',
  cantidad: 23582.37,
  referencia: 'approximate',
  fechaMovimiento: dayjs('2025-12-06T08:27'),
  fechaCreacion: dayjs('2025-12-06T01:26'),
  fechaModificacion: dayjs('2025-12-06T01:28'),
  usuarioCreacion: 'soap forenenst bitterly',
  usuarioModificacion: 'opposite',
};

export const sampleWithNewData: NewMovimiento = {
  tipo: 'ENTRADA',
  cantidad: 1202.17,
  fechaMovimiento: dayjs('2025-12-06T11:41'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
