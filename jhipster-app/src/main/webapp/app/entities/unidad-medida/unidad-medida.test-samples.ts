import { IUnidadMedida, NewUnidadMedida } from './unidad-medida.model';

export const sampleWithRequiredData: IUnidadMedida = {
  id: 28824,
  codigo: 'tight care',
  nombre: 'curry',
  dimension: 'PESO',
};

export const sampleWithPartialData: IUnidadMedida = {
  id: 12187,
  codigo: 'earnest wh',
  nombre: 'equally',
  dimension: 'VOLUMEN',
};

export const sampleWithFullData: IUnidadMedida = {
  id: 1437,
  codigo: 'finally fo',
  nombre: 'poppy character',
  dimension: 'VOLUMEN',
};

export const sampleWithNewData: NewUnidadMedida = {
  codigo: 'briskly',
  nombre: 'ample meh during',
  dimension: 'VOLUMEN',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
