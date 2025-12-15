import { DimensionUnidad } from 'app/entities/enumerations/dimension-unidad.model';

export interface IUnidadMedida {
  id: number;
  codigo?: string | null;
  nombre?: string | null;
  dimension?: keyof typeof DimensionUnidad | null;
}

export type NewUnidadMedida = Omit<IUnidadMedida, 'id'> & { id: null };
