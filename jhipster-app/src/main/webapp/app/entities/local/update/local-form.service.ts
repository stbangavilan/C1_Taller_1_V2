import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ILocal, NewLocal } from '../local.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILocal for edit and NewLocalFormGroupInput for create.
 */
type LocalFormGroupInput = ILocal | PartialWithRequiredKeyOf<NewLocal>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ILocal | NewLocal> = Omit<T, 'fechaCreacion' | 'fechaModificacion'> & {
  fechaCreacion?: string | null;
  fechaModificacion?: string | null;
};

type LocalFormRawValue = FormValueOf<ILocal>;

type NewLocalFormRawValue = FormValueOf<NewLocal>;

type LocalFormDefaults = Pick<NewLocal, 'id' | 'fechaCreacion' | 'fechaModificacion'>;

type LocalFormGroupContent = {
  id: FormControl<LocalFormRawValue['id'] | NewLocal['id']>;
  nombre: FormControl<LocalFormRawValue['nombre']>;
  ubicacion: FormControl<LocalFormRawValue['ubicacion']>;
  fechaCreacion: FormControl<LocalFormRawValue['fechaCreacion']>;
  fechaModificacion: FormControl<LocalFormRawValue['fechaModificacion']>;
  usuarioCreacion: FormControl<LocalFormRawValue['usuarioCreacion']>;
  usuarioModificacion: FormControl<LocalFormRawValue['usuarioModificacion']>;
};

export type LocalFormGroup = FormGroup<LocalFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LocalFormService {
  createLocalFormGroup(local: LocalFormGroupInput = { id: null }): LocalFormGroup {
    const localRawValue = this.convertLocalToLocalRawValue({
      ...this.getFormDefaults(),
      ...local,
    });
    return new FormGroup<LocalFormGroupContent>({
      id: new FormControl(
        { value: localRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nombre: new FormControl(localRawValue.nombre, {
        validators: [Validators.required, Validators.maxLength(120)],
      }),
      ubicacion: new FormControl(localRawValue.ubicacion, {
        validators: [Validators.maxLength(200)],
      }),
      fechaCreacion: new FormControl(localRawValue.fechaCreacion),
      fechaModificacion: new FormControl(localRawValue.fechaModificacion),
      usuarioCreacion: new FormControl(localRawValue.usuarioCreacion, {
        validators: [Validators.maxLength(100)],
      }),
      usuarioModificacion: new FormControl(localRawValue.usuarioModificacion, {
        validators: [Validators.maxLength(100)],
      }),
    });
  }

  getLocal(form: LocalFormGroup): ILocal | NewLocal {
    return this.convertLocalRawValueToLocal(form.getRawValue() as LocalFormRawValue | NewLocalFormRawValue);
  }

  resetForm(form: LocalFormGroup, local: LocalFormGroupInput): void {
    const localRawValue = this.convertLocalToLocalRawValue({ ...this.getFormDefaults(), ...local });
    form.reset(
      {
        ...localRawValue,
        id: { value: localRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): LocalFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      fechaCreacion: currentTime,
      fechaModificacion: currentTime,
    };
  }

  private convertLocalRawValueToLocal(rawLocal: LocalFormRawValue | NewLocalFormRawValue): ILocal | NewLocal {
    return {
      ...rawLocal,
      fechaCreacion: dayjs(rawLocal.fechaCreacion, DATE_TIME_FORMAT),
      fechaModificacion: dayjs(rawLocal.fechaModificacion, DATE_TIME_FORMAT),
    };
  }

  private convertLocalToLocalRawValue(
    local: ILocal | (Partial<NewLocal> & LocalFormDefaults),
  ): LocalFormRawValue | PartialWithRequiredKeyOf<NewLocalFormRawValue> {
    return {
      ...local,
      fechaCreacion: local.fechaCreacion ? local.fechaCreacion.format(DATE_TIME_FORMAT) : undefined,
      fechaModificacion: local.fechaModificacion ? local.fechaModificacion.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
