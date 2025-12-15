import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IUnidadMedida } from '../unidad-medida.model';

@Component({
  selector: 'jhi-unidad-medida-detail',
  templateUrl: './unidad-medida-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class UnidadMedidaDetailComponent {
  unidadMedida = input<IUnidadMedida | null>(null);

  previousState(): void {
    window.history.back();
  }
}
