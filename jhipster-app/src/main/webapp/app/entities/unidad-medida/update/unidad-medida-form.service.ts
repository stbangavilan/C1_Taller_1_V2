import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IUnidadMedida, NewUnidadMedida } from '../unidad-medida.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUnidadMedida for edit and NewUnidadMedidaFormGroupInput for create.
 */
type UnidadMedidaFormGroupInput = IUnidadMedida | PartialWithRequiredKeyOf<NewUnidadMedida>;

type UnidadMedidaFormDefaults = Pick<NewUnidadMedida, 'id'>;

type UnidadMedidaFormGroupContent = {
  id: FormControl<IUnidadMedida['id'] | NewUnidadMedida['id']>;
  codigo: FormControl<IUnidadMedida['codigo']>;
  nombre: FormControl<IUnidadMedida['nombre']>;
  dimension: FormControl<IUnidadMedida['dimension']>;
};

export type UnidadMedidaFormGroup = FormGroup<UnidadMedidaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UnidadMedidaFormService {
  createUnidadMedidaFormGroup(unidadMedida: UnidadMedidaFormGroupInput = { id: null }): UnidadMedidaFormGroup {
    const unidadMedidaRawValue = {
      ...this.getFormDefaults(),
      ...unidadMedida,
    };
    return new FormGroup<UnidadMedidaFormGroupContent>({
      id: new FormControl(
        { value: unidadMedidaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      codigo: new FormControl(unidadMedidaRawValue.codigo, {
        validators: [Validators.required, Validators.maxLength(10)],
      }),
      nombre: new FormControl(unidadMedidaRawValue.nombre, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      dimension: new FormControl(unidadMedidaRawValue.dimension, {
        validators: [Validators.required],
      }),
    });
  }

  getUnidadMedida(form: UnidadMedidaFormGroup): IUnidadMedida | NewUnidadMedida {
    return form.getRawValue() as IUnidadMedida | NewUnidadMedida;
  }

  resetForm(form: UnidadMedidaFormGroup, unidadMedida: UnidadMedidaFormGroupInput): void {
    const unidadMedidaRawValue = { ...this.getFormDefaults(), ...unidadMedida };
    form.reset(
      {
        ...unidadMedidaRawValue,
        id: { value: unidadMedidaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): UnidadMedidaFormDefaults {
    return {
      id: null,
    };
  }
}
