import { IStock, NewStock } from './stock.model';

export const sampleWithRequiredData: IStock = {
  id: 15929,
  cantidad: 19174.52,
};

export const sampleWithPartialData: IStock = {
  id: 622,
  cantidad: 6051.7,
};

export const sampleWithFullData: IStock = {
  id: 30242,
  cantidad: 20466.23,
};

export const sampleWithNewData: NewStock = {
  cantidad: 11009.88,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
