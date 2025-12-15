import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IProducto, NewProducto } from '../producto.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProducto for edit and NewProductoFormGroupInput for create.
 */
type ProductoFormGroupInput = IProducto | PartialWithRequiredKeyOf<NewProducto>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IProducto | NewProducto> = Omit<T, 'fechaCreacion' | 'fechaModificacion'> & {
  fechaCreacion?: string | null;
  fechaModificacion?: string | null;
};

type ProductoFormRawValue = FormValueOf<IProducto>;

type NewProductoFormRawValue = FormValueOf<NewProducto>;

type ProductoFormDefaults = Pick<NewProducto, 'id' | 'fechaCreacion' | 'fechaModificacion'>;

type ProductoFormGroupContent = {
  id: FormControl<ProductoFormRawValue['id'] | NewProducto['id']>;
  sku: FormControl<ProductoFormRawValue['sku']>;
  nombre: FormControl<ProductoFormRawValue['nombre']>;
  pesoPorUnidadKg: FormControl<ProductoFormRawValue['pesoPorUnidadKg']>;
  volumenPorUnidadL: FormControl<ProductoFormRawValue['volumenPorUnidadL']>;
  fechaCreacion: FormControl<ProductoFormRawValue['fechaCreacion']>;
  fechaModificacion: FormControl<ProductoFormRawValue['fechaModificacion']>;
  usuarioCreacion: FormControl<ProductoFormRawValue['usuarioCreacion']>;
  usuarioModificacion: FormControl<ProductoFormRawValue['usuarioModificacion']>;
  unidadMedida: FormControl<ProductoFormRawValue['unidadMedida']>;
  categoria: FormControl<ProductoFormRawValue['categoria']>;
};

export type ProductoFormGroup = FormGroup<ProductoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProductoFormService {
  createProductoFormGroup(producto: ProductoFormGroupInput = { id: null }): ProductoFormGroup {
    const productoRawValue = this.convertProductoToProductoRawValue({
      ...this.getFormDefaults(),
      ...producto,
    });
    return new FormGroup<ProductoFormGroupContent>({
      id: new FormControl(
        { value: productoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      sku: new FormControl(productoRawValue.sku, {
        validators: [Validators.required, Validators.maxLength(64)],
      }),
      nombre: new FormControl(productoRawValue.nombre, {
        validators: [Validators.required, Validators.maxLength(150)],
      }),
      pesoPorUnidadKg: new FormControl(productoRawValue.pesoPorUnidadKg),
      volumenPorUnidadL: new FormControl(productoRawValue.volumenPorUnidadL),
      fechaCreacion: new FormControl(productoRawValue.fechaCreacion),
      fechaModificacion: new FormControl(productoRawValue.fechaModificacion),
      usuarioCreacion: new FormControl(productoRawValue.usuarioCreacion, {
        validators: [Validators.maxLength(100)],
      }),
      usuarioModificacion: new FormControl(productoRawValue.usuarioModificacion, {
        validators: [Validators.maxLength(100)],
      }),
      unidadMedida: new FormControl(productoRawValue.unidadMedida),
      categoria: new FormControl(productoRawValue.categoria),
    });
  }

  getProducto(form: ProductoFormGroup): IProducto | NewProducto {
    return this.convertProductoRawValueToProducto(form.getRawValue() as ProductoFormRawValue | NewProductoFormRawValue);
  }

  resetForm(form: ProductoFormGroup, producto: ProductoFormGroupInput): void {
    const productoRawValue = this.convertProductoToProductoRawValue({ ...this.getFormDefaults(), ...producto });
    form.reset(
      {
        ...productoRawValue,
        id: { value: productoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProductoFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      fechaCreacion: currentTime,
      fechaModificacion: currentTime,
    };
  }

  private convertProductoRawValueToProducto(rawProducto: ProductoFormRawValue | NewProductoFormRawValue): IProducto | NewProducto {
    return {
      ...rawProducto,
      fechaCreacion: dayjs(rawProducto.fechaCreacion, DATE_TIME_FORMAT),
      fechaModificacion: dayjs(rawProducto.fechaModificacion, DATE_TIME_FORMAT),
    };
  }

  private convertProductoToProductoRawValue(
    producto: IProducto | (Partial<NewProducto> & ProductoFormDefaults),
  ): ProductoFormRawValue | PartialWithRequiredKeyOf<NewProductoFormRawValue> {
    return {
      ...producto,
      fechaCreacion: producto.fechaCreacion ? producto.fechaCreacion.format(DATE_TIME_FORMAT) : undefined,
      fechaModificacion: producto.fechaModificacion ? producto.fechaModificacion.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
