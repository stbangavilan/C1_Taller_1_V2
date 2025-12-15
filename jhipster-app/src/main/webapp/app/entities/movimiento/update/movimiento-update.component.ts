import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IProducto } from 'app/entities/producto/producto.model';
import { ProductoService } from 'app/entities/producto/service/producto.service';
import { ILocal } from 'app/entities/local/local.model';
import { LocalService } from 'app/entities/local/service/local.service';
import { TipoMovimiento } from 'app/entities/enumerations/tipo-movimiento.model';
import { MovimientoService } from '../service/movimiento.service';
import { IMovimiento } from '../movimiento.model';
import { MovimientoFormGroup, MovimientoFormService } from './movimiento-form.service';

@Component({
  selector: 'jhi-movimiento-update',
  templateUrl: './movimiento-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MovimientoUpdateComponent implements OnInit {
  isSaving = false;
  movimiento: IMovimiento | null = null;
  tipoMovimientoValues = Object.keys(TipoMovimiento);

  productosSharedCollection: IProducto[] = [];
  localsSharedCollection: ILocal[] = [];

  protected movimientoService = inject(MovimientoService);
  protected movimientoFormService = inject(MovimientoFormService);
  protected productoService = inject(ProductoService);
  protected localService = inject(LocalService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: MovimientoFormGroup = this.movimientoFormService.createMovimientoFormGroup();

  compareProducto = (o1: IProducto | null, o2: IProducto | null): boolean => this.productoService.compareProducto(o1, o2);

  compareLocal = (o1: ILocal | null, o2: ILocal | null): boolean => this.localService.compareLocal(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ movimiento }) => {
      this.movimiento = movimiento;
      if (movimiento) {
        this.updateForm(movimiento);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const movimiento = this.movimientoFormService.getMovimiento(this.editForm);
    if (movimiento.id !== null) {
      this.subscribeToSaveResponse(this.movimientoService.update(movimiento));
    } else {
      this.subscribeToSaveResponse(this.movimientoService.create(movimiento));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMovimiento>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(movimiento: IMovimiento): void {
    this.movimiento = movimiento;
    this.movimientoFormService.resetForm(this.editForm, movimiento);

    this.productosSharedCollection = this.productoService.addProductoToCollectionIfMissing<IProducto>(
      this.productosSharedCollection,
      movimiento.producto,
    );
    this.localsSharedCollection = this.localService.addLocalToCollectionIfMissing<ILocal>(
      this.localsSharedCollection,
      movimiento.localOrigen,
      movimiento.localDestino,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.productoService
      .query()
      .pipe(map((res: HttpResponse<IProducto[]>) => res.body ?? []))
      .pipe(
        map((productos: IProducto[]) =>
          this.productoService.addProductoToCollectionIfMissing<IProducto>(productos, this.movimiento?.producto),
        ),
      )
      .subscribe((productos: IProducto[]) => (this.productosSharedCollection = productos));

    this.localService
      .query()
      .pipe(map((res: HttpResponse<ILocal[]>) => res.body ?? []))
      .pipe(
        map((locals: ILocal[]) =>
          this.localService.addLocalToCollectionIfMissing<ILocal>(locals, this.movimiento?.localOrigen, this.movimiento?.localDestino),
        ),
      )
      .subscribe((locals: ILocal[]) => (this.localsSharedCollection = locals));
  }
}
