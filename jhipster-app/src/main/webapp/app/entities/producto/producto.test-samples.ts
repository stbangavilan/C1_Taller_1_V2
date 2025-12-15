import dayjs from 'dayjs/esm';

import { IProducto, NewProducto } from './producto.model';

export const sampleWithRequiredData: IProducto = {
  id: 26142,
  sku: 'till',
  nombre: 'finding ferociously',
};

export const sampleWithPartialData: IProducto = {
  id: 15633,
  sku: 'strictly',
  nombre: 'tepid glum boo',
  volumenPorUnidadL: 16596.03,
  fechaCreacion: dayjs('2025-12-06T04:28'),
  usuarioModificacion: 'saturate entrench quietly',
};

export const sampleWithFullData: IProducto = {
  id: 31795,
  sku: 'er behold needily',
  nombre: 'huzzah roasted',
  pesoPorUnidadKg: 30084.89,
  volumenPorUnidadL: 27403.84,
  fechaCreacion: dayjs('2025-12-06T12:19'),
  fechaModificacion: dayjs('2025-12-05T23:30'),
  usuarioCreacion: 'cope',
  usuarioModificacion: 'very oof',
};

export const sampleWithNewData: NewProducto = {
  sku: 'perfection highly quickly',
  nombre: 'that whose empty',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
