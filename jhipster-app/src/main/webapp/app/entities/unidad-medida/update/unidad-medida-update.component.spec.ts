import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { UnidadMedidaService } from '../service/unidad-medida.service';
import { IUnidadMedida } from '../unidad-medida.model';
import { UnidadMedidaFormService } from './unidad-medida-form.service';

import { UnidadMedidaUpdateComponent } from './unidad-medida-update.component';

describe('UnidadMedida Management Update Component', () => {
  let comp: UnidadMedidaUpdateComponent;
  let fixture: ComponentFixture<UnidadMedidaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let unidadMedidaFormService: UnidadMedidaFormService;
  let unidadMedidaService: UnidadMedidaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UnidadMedidaUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(UnidadMedidaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UnidadMedidaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    unidadMedidaFormService = TestBed.inject(UnidadMedidaFormService);
    unidadMedidaService = TestBed.inject(UnidadMedidaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const unidadMedida: IUnidadMedida = { id: 8903 };

      activatedRoute.data = of({ unidadMedida });
      comp.ngOnInit();

      expect(comp.unidadMedida).toEqual(unidadMedida);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUnidadMedida>>();
      const unidadMedida = { id: 803 };
      jest.spyOn(unidadMedidaFormService, 'getUnidadMedida').mockReturnValue(unidadMedida);
      jest.spyOn(unidadMedidaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ unidadMedida });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: unidadMedida }));
      saveSubject.complete();

      // THEN
      expect(unidadMedidaFormService.getUnidadMedida).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(unidadMedidaService.update).toHaveBeenCalledWith(expect.objectContaining(unidadMedida));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUnidadMedida>>();
      const unidadMedida = { id: 803 };
      jest.spyOn(unidadMedidaFormService, 'getUnidadMedida').mockReturnValue({ id: null });
      jest.spyOn(unidadMedidaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ unidadMedida: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: unidadMedida }));
      saveSubject.complete();

      // THEN
      expect(unidadMedidaFormService.getUnidadMedida).toHaveBeenCalled();
      expect(unidadMedidaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUnidadMedida>>();
      const unidadMedida = { id: 803 };
      jest.spyOn(unidadMedidaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ unidadMedida });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(unidadMedidaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
