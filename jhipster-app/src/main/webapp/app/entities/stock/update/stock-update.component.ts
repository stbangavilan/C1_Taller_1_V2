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
import { StockService } from '../service/stock.service';
import { IStock } from '../stock.model';
import { StockFormGroup, StockFormService } from './stock-form.service';

@Component({
  selector: 'jhi-stock-update',
  templateUrl: './stock-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class StockUpdateComponent implements OnInit {
  isSaving = false;
  stock: IStock | null = null;

  productosSharedCollection: IProducto[] = [];
  localsSharedCollection: ILocal[] = [];

  protected stockService = inject(StockService);
  protected stockFormService = inject(StockFormService);
  protected productoService = inject(ProductoService);
  protected localService = inject(LocalService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: StockFormGroup = this.stockFormService.createStockFormGroup();

  compareProducto = (o1: IProducto | null, o2: IProducto | null): boolean => this.productoService.compareProducto(o1, o2);

  compareLocal = (o1: ILocal | null, o2: ILocal | null): boolean => this.localService.compareLocal(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ stock }) => {
      this.stock = stock;
      if (stock) {
        this.updateForm(stock);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const stock = this.stockFormService.getStock(this.editForm);
    if (stock.id !== null) {
      this.subscribeToSaveResponse(this.stockService.update(stock));
    } else {
      this.subscribeToSaveResponse(this.stockService.create(stock));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStock>>): void {
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

  protected updateForm(stock: IStock): void {
    this.stock = stock;
    this.stockFormService.resetForm(this.editForm, stock);

    this.productosSharedCollection = this.productoService.addProductoToCollectionIfMissing<IProducto>(
      this.productosSharedCollection,
      stock.producto,
    );
    this.localsSharedCollection = this.localService.addLocalToCollectionIfMissing<ILocal>(this.localsSharedCollection, stock.local);
  }

  protected loadRelationshipsOptions(): void {
    this.productoService
      .query()
      .pipe(map((res: HttpResponse<IProducto[]>) => res.body ?? []))
      .pipe(
        map((productos: IProducto[]) => this.productoService.addProductoToCollectionIfMissing<IProducto>(productos, this.stock?.producto)),
      )
      .subscribe((productos: IProducto[]) => (this.productosSharedCollection = productos));

    this.localService
      .query()
      .pipe(map((res: HttpResponse<ILocal[]>) => res.body ?? []))
      .pipe(map((locals: ILocal[]) => this.localService.addLocalToCollectionIfMissing<ILocal>(locals, this.stock?.local)))
      .subscribe((locals: ILocal[]) => (this.localsSharedCollection = locals));
  }
}
