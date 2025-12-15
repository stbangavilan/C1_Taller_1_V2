import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IStock } from '../stock.model';

@Component({
  selector: 'jhi-stock-detail',
  templateUrl: './stock-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class StockDetailComponent {
  stock = input<IStock | null>(null);

  previousState(): void {
    window.history.back();
  }
}
