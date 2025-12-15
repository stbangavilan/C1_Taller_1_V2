import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUnidadMedida } from 'app/entities/unidad-medida/unidad-medida.model';
import { UnidadMedidaService } from 'app/entities/unidad-medida/service/unidad-medida.service';
import { ICategoria } from 'app/entities/categoria/categoria.model';
import { CategoriaService } from 'app/entities/categoria/service/categoria.service';
import { ProductoService } from '../service/producto.service';
import { IProducto } from '../producto.model';
import { ProductoFormGroup, ProductoFormService } from './producto-form.service';

@Component({
  selector: 'jhi-producto-update',
  templateUrl: './producto-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProductoUpdateComponent implements OnInit {
  isSaving = false;
  producto: IProducto | null = null;

  unidadMedidasSharedCollection: IUnidadMedida[] = [];
  categoriasSharedCollection: ICategoria[] = [];

  protected productoService = inject(ProductoService);
  protected productoFormService = inject(ProductoFormService);
  protected unidadMedidaService = inject(UnidadMedidaService);
  protected categoriaService = inject(CategoriaService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ProductoFormGroup = this.productoFormService.createProductoFormGroup();

  compareUnidadMedida = (o1: IUnidadMedida | null, o2: IUnidadMedida | null): boolean =>
    this.unidadMedidaService.compareUnidadMedida(o1, o2);

  compareCategoria = (o1: ICategoria | null, o2: ICategoria | null): boolean => this.categoriaService.compareCategoria(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ producto }) => {
      this.producto = producto;
      if (producto) {
        this.updateForm(producto);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const producto = this.productoFormService.getProducto(this.editForm);
    if (producto.id !== null) {
      this.subscribeToSaveResponse(this.productoService.update(producto));
    } else {
      this.subscribeToSaveResponse(this.productoService.create(producto));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProducto>>): void {
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

  protected updateForm(producto: IProducto): void {
    this.producto = producto;
    this.productoFormService.resetForm(this.editForm, producto);

    this.unidadMedidasSharedCollection = this.unidadMedidaService.addUnidadMedidaToCollectionIfMissing<IUnidadMedida>(
      this.unidadMedidasSharedCollection,
      producto.unidadMedida,
    );
    this.categoriasSharedCollection = this.categoriaService.addCategoriaToCollectionIfMissing<ICategoria>(
      this.categoriasSharedCollection,
      producto.categoria,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.unidadMedidaService
      .query()
      .pipe(map((res: HttpResponse<IUnidadMedida[]>) => res.body ?? []))
      .pipe(
        map((unidadMedidas: IUnidadMedida[]) =>
          this.unidadMedidaService.addUnidadMedidaToCollectionIfMissing<IUnidadMedida>(unidadMedidas, this.producto?.unidadMedida),
        ),
      )
      .subscribe((unidadMedidas: IUnidadMedida[]) => (this.unidadMedidasSharedCollection = unidadMedidas));

    this.categoriaService
      .query()
      .pipe(map((res: HttpResponse<ICategoria[]>) => res.body ?? []))
      .pipe(
        map((categorias: ICategoria[]) =>
          this.categoriaService.addCategoriaToCollectionIfMissing<ICategoria>(categorias, this.producto?.categoria),
        ),
      )
      .subscribe((categorias: ICategoria[]) => (this.categoriasSharedCollection = categorias));
  }
}
