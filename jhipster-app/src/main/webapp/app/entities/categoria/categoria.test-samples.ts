import dayjs from 'dayjs/esm';

import { ICategoria, NewCategoria } from './categoria.model';

export const sampleWithRequiredData: ICategoria = {
  id: 16672,
  nombre: 'clavicle',
};

export const sampleWithPartialData: ICategoria = {
  id: 13308,
  nombre: 'doodle throughout',
  usuarioCreacion: 'optimal',
};

export const sampleWithFullData: ICategoria = {
  id: 12751,
  nombre: 'what unlucky yowza',
  descripcion: 'respray',
  fechaCreacion: dayjs('2025-12-05T22:06'),
  fechaModificacion: dayjs('2025-12-06T04:00'),
  usuarioCreacion: 'pupil',
  usuarioModificacion: 'however lowball',
};

export const sampleWithNewData: NewCategoria = {
  nombre: 'unbalance delightfully like',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
