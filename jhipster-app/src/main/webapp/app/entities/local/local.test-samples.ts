import dayjs from 'dayjs/esm';

import { ILocal, NewLocal } from './local.model';

export const sampleWithRequiredData: ILocal = {
  id: 6123,
  nombre: 'guard teeming',
};

export const sampleWithPartialData: ILocal = {
  id: 21950,
  nombre: 'along snoopy crooked',
  usuarioCreacion: 'overburden guide',
};

export const sampleWithFullData: ILocal = {
  id: 27244,
  nombre: 'below wrongly and',
  ubicacion: 'brilliant furthermore',
  fechaCreacion: dayjs('2025-12-06T10:31'),
  fechaModificacion: dayjs('2025-12-05T22:28'),
  usuarioCreacion: 'hefty indeed excluding',
  usuarioModificacion: 'contradict zowie flustered',
};

export const sampleWithNewData: NewLocal = {
  nombre: 'huzzah roger yawningly',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
