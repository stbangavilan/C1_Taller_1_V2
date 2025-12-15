import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IMovimiento, NewMovimiento } from '../movimiento.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMovimiento for edit and NewMovimientoFormGroupInput for create.
 */
type MovimientoFormGroupInput = IMovimiento | PartialWithRequiredKeyOf<NewMovimiento>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IMovimiento | NewMovimiento> = Omit<T, 'fechaMovimiento' | 'fechaCreacion' | 'fechaModificacion'> & {
  fechaMovimiento?: string | null;
  fechaCreacion?: string | null;
  fechaModificacion?: string | null;
};

type MovimientoFormRawValue = FormValueOf<IMovimiento>;

type NewMovimientoFormRawValue = FormValueOf<NewMovimiento>;

type MovimientoFormDefaults = Pick<NewMovimiento, 'id' | 'fechaMovimiento' | 'fechaCreacion' | 'fechaModificacion'>;

type MovimientoFormGroupContent = {
  id: FormControl<MovimientoFormRawValue['id'] | NewMovimiento['id']>;
  tipo: FormControl<MovimientoFormRawValue['tipo']>;
  cantidad: FormControl<MovimientoFormRawValue['cantidad']>;
  referencia: FormControl<MovimientoFormRawValue['referencia']>;
  fechaMovimiento: FormControl<MovimientoFormRawValue['fechaMovimiento']>;
  fechaCreacion: FormControl<MovimientoFormRawValue['fechaCreacion']>;
  fechaModificacion: FormControl<MovimientoFormRawValue['fechaModificacion']>;
  usuarioCreacion: FormControl<MovimientoFormRawValue['usuarioCreacion']>;
  usuarioModificacion: FormControl<MovimientoFormRawValue['usuarioModificacion']>;
  producto: FormControl<MovimientoFormRawValue['producto']>;
  localOrigen: FormControl<MovimientoFormRawValue['localOrigen']>;
  localDestino: FormControl<MovimientoFormRawValue['localDestino']>;
};

export type MovimientoFormGroup = FormGroup<MovimientoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MovimientoFormService {
  createMovimientoFormGroup(movimiento: MovimientoFormGroupInput = { id: null }): MovimientoFormGroup {
    const movimientoRawValue = this.convertMovimientoToMovimientoRawValue({
      ...this.getFormDefaults(),
      ...movimiento,
    });
    return new FormGroup<MovimientoFormGroupContent>({
      id: new FormControl(
        { value: movimientoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      tipo: new FormControl(movimientoRawValue.tipo, {
        validators: [Validators.required],
      }),
      cantidad: new FormControl(movimientoRawValue.cantidad, {
        validators: [Validators.required],
      }),
      referencia: new FormControl(movimientoRawValue.referencia, {
        validators: [Validators.maxLength(120)],
      }),
      fechaMovimiento: new FormControl(movimientoRawValue.fechaMovimiento, {
        validators: [Validators.required],
      }),
      fechaCreacion: new FormControl(movimientoRawValue.fechaCreacion),
      fechaModificacion: new FormControl(movimientoRawValue.fechaModificacion),
      usuarioCreacion: new FormControl(movimientoRawValue.usuarioCreacion, {
        validators: [Validators.maxLength(100)],
      }),
      usuarioModificacion: new FormControl(movimientoRawValue.usuarioModificacion, {
        validators: [Validators.maxLength(100)],
      }),
      producto: new FormControl(movimientoRawValue.producto),
      localOrigen: new FormControl(movimientoRawValue.localOrigen),
      localDestino: new FormControl(movimientoRawValue.localDestino),
    });
  }

  getMovimiento(form: MovimientoFormGroup): IMovimiento | NewMovimiento {
    return this.convertMovimientoRawValueToMovimiento(form.getRawValue() as MovimientoFormRawValue | NewMovimientoFormRawValue);
  }

  resetForm(form: MovimientoFormGroup, movimiento: MovimientoFormGroupInput): void {
    const movimientoRawValue = this.convertMovimientoToMovimientoRawValue({ ...this.getFormDefaults(), ...movimiento });
    form.reset(
      {
        ...movimientoRawValue,
        id: { value: movimientoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MovimientoFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      fechaMovimiento: currentTime,
      fechaCreacion: currentTime,
      fechaModificacion: currentTime,
    };
  }

  private convertMovimientoRawValueToMovimiento(
    rawMovimiento: MovimientoFormRawValue | NewMovimientoFormRawValue,
  ): IMovimiento | NewMovimiento {
    return {
      ...rawMovimiento,
      fechaMovimiento: dayjs(rawMovimiento.fechaMovimiento, DATE_TIME_FORMAT),
      fechaCreacion: dayjs(rawMovimiento.fechaCreacion, DATE_TIME_FORMAT),
      fechaModificacion: dayjs(rawMovimiento.fechaModificacion, DATE_TIME_FORMAT),
    };
  }

  private convertMovimientoToMovimientoRawValue(
    movimiento: IMovimiento | (Partial<NewMovimiento> & MovimientoFormDefaults),
  ): MovimientoFormRawValue | PartialWithRequiredKeyOf<NewMovimientoFormRawValue> {
    return {
      ...movimiento,
      fechaMovimiento: movimiento.fechaMovimiento ? movimiento.fechaMovimiento.format(DATE_TIME_FORMAT) : undefined,
      fechaCreacion: movimiento.fechaCreacion ? movimiento.fechaCreacion.format(DATE_TIME_FORMAT) : undefined,
      fechaModificacion: movimiento.fechaModificacion ? movimiento.fechaModificacion.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
