import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DimensionUnidad } from 'app/entities/enumerations/dimension-unidad.model';
import { IUnidadMedida } from '../unidad-medida.model';
import { UnidadMedidaService } from '../service/unidad-medida.service';
import { UnidadMedidaFormGroup, UnidadMedidaFormService } from './unidad-medida-form.service';

@Component({
  selector: 'jhi-unidad-medida-update',
  templateUrl: './unidad-medida-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class UnidadMedidaUpdateComponent implements OnInit {
  isSaving = false;
  unidadMedida: IUnidadMedida | null = null;
  dimensionUnidadValues = Object.keys(DimensionUnidad);

  protected unidadMedidaService = inject(UnidadMedidaService);
  protected unidadMedidaFormService = inject(UnidadMedidaFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: UnidadMedidaFormGroup = this.unidadMedidaFormService.createUnidadMedidaFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ unidadMedida }) => {
      this.unidadMedida = unidadMedida;
      if (unidadMedida) {
        this.updateForm(unidadMedida);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const unidadMedida = this.unidadMedidaFormService.getUnidadMedida(this.editForm);
    if (unidadMedida.id !== null) {
      this.subscribeToSaveResponse(this.unidadMedidaService.update(unidadMedida));
    } else {
      this.subscribeToSaveResponse(this.unidadMedidaService.create(unidadMedida));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUnidadMedida>>): void {
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

  protected updateForm(unidadMedida: IUnidadMedida): void {
    this.unidadMedida = unidadMedida;
    this.unidadMedidaFormService.resetForm(this.editForm, unidadMedida);
  }
}
