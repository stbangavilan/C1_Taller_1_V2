import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { UnidadMedidaDetailComponent } from './unidad-medida-detail.component';

describe('UnidadMedida Management Detail Component', () => {
  let comp: UnidadMedidaDetailComponent;
  let fixture: ComponentFixture<UnidadMedidaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadMedidaDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./unidad-medida-detail.component').then(m => m.UnidadMedidaDetailComponent),
              resolve: { unidadMedida: () => of({ id: 803 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(UnidadMedidaDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidadMedidaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load unidadMedida on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', UnidadMedidaDetailComponent);

      // THEN
      expect(instance.unidadMedida()).toEqual(expect.objectContaining({ id: 803 }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
