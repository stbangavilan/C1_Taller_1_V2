import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IProducto } from '../producto.model';

@Component({
  selector: 'jhi-producto-detail',
  templateUrl: './producto-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class ProductoDetailComponent {
  producto = input<IProducto | null>(null);

  previousState(): void {
    window.history.back();
  }
}
