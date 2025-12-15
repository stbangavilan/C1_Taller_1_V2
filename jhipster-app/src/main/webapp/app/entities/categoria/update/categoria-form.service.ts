import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICategoria, NewCategoria } from '../categoria.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICategoria for edit and NewCategoriaFormGroupInput for create.
 */
type CategoriaFormGroupInput = ICategoria | PartialWithRequiredKeyOf<NewCategoria>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICategoria | NewCategoria> = Omit<T, 'fechaCreacion' | 'fechaModificacion'> & {
  fechaCreacion?: string | null;
  fechaModificacion?: string | null;
};

type CategoriaFormRawValue = FormValueOf<ICategoria>;

type NewCategoriaFormRawValue = FormValueOf<NewCategoria>;

type CategoriaFormDefaults = Pick<NewCategoria, 'id' | 'fechaCreacion' | 'fechaModificacion'>;

type CategoriaFormGroupContent = {
  id: FormControl<CategoriaFormRawValue['id'] | NewCategoria['id']>;
  nombre: FormControl<CategoriaFormRawValue['nombre']>;
  descripcion: FormControl<CategoriaFormRawValue['descripcion']>;
  fechaCreacion: FormControl<CategoriaFormRawValue['fechaCreacion']>;
  fechaModificacion: FormControl<CategoriaFormRawValue['fechaModificacion']>;
  usuarioCreacion: FormControl<CategoriaFormRawValue['usuarioCreacion']>;
  usuarioModificacion: FormControl<CategoriaFormRawValue['usuarioModificacion']>;
};

export type CategoriaFormGroup = FormGroup<CategoriaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CategoriaFormService {
  createCategoriaFormGroup(categoria: CategoriaFormGroupInput = { id: null }): CategoriaFormGroup {
    const categoriaRawValue = this.convertCategoriaToCategoriaRawValue({
      ...this.getFormDefaults(),
      ...categoria,
    });
    return new FormGroup<CategoriaFormGroupContent>({
      id: new FormControl(
        { value: categoriaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nombre: new FormControl(categoriaRawValue.nombre, {
        validators: [Validators.required, Validators.maxLength(120)],
      }),
      descripcion: new FormControl(categoriaRawValue.descripcion, {
        validators: [Validators.maxLength(255)],
      }),
      fechaCreacion: new FormControl(categoriaRawValue.fechaCreacion),
      fechaModificacion: new FormControl(categoriaRawValue.fechaModificacion),
      usuarioCreacion: new FormControl(categoriaRawValue.usuarioCreacion, {
        validators: [Validators.maxLength(100)],
      }),
      usuarioModificacion: new FormControl(categoriaRawValue.usuarioModificacion, {
        validators: [Validators.maxLength(100)],
      }),
    });
  }

  getCategoria(form: CategoriaFormGroup): ICategoria | NewCategoria {
    return this.convertCategoriaRawValueToCategoria(form.getRawValue() as CategoriaFormRawValue | NewCategoriaFormRawValue);
  }

  resetForm(form: CategoriaFormGroup, categoria: CategoriaFormGroupInput): void {
    const categoriaRawValue = this.convertCategoriaToCategoriaRawValue({ ...this.getFormDefaults(), ...categoria });
    form.reset(
      {
        ...categoriaRawValue,
        id: { value: categoriaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CategoriaFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      fechaCreacion: currentTime,
      fechaModificacion: currentTime,
    };
  }

  private convertCategoriaRawValueToCategoria(rawCategoria: CategoriaFormRawValue | NewCategoriaFormRawValue): ICategoria | NewCategoria {
    return {
      ...rawCategoria,
      fechaCreacion: dayjs(rawCategoria.fechaCreacion, DATE_TIME_FORMAT),
      fechaModificacion: dayjs(rawCategoria.fechaModificacion, DATE_TIME_FORMAT),
    };
  }

  private convertCategoriaToCategoriaRawValue(
    categoria: ICategoria | (Partial<NewCategoria> & CategoriaFormDefaults),
  ): CategoriaFormRawValue | PartialWithRequiredKeyOf<NewCategoriaFormRawValue> {
    return {
      ...categoria,
      fechaCreacion: categoria.fechaCreacion ? categoria.fechaCreacion.format(DATE_TIME_FORMAT) : undefined,
      fechaModificacion: categoria.fechaModificacion ? categoria.fechaModificacion.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
