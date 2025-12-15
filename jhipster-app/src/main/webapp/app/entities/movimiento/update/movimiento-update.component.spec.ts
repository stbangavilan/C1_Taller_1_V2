import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IProducto } from 'app/entities/producto/producto.model';
import { ProductoService } from 'app/entities/producto/service/producto.service';
import { ILocal } from 'app/entities/local/local.model';
import { LocalService } from 'app/entities/local/service/local.service';
import { IMovimiento } from '../movimiento.model';
import { MovimientoService } from '../service/movimiento.service';
import { MovimientoFormService } from './movimiento-form.service';

import { MovimientoUpdateComponent } from './movimiento-update.component';

describe('Movimiento Management Update Component', () => {
  let comp: MovimientoUpdateComponent;
  let fixture: ComponentFixture<MovimientoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let movimientoFormService: MovimientoFormService;
  let movimientoService: MovimientoService;
  let productoService: ProductoService;
  let localService: LocalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MovimientoUpdateComponent],
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
      .overrideTemplate(MovimientoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MovimientoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    movimientoFormService = TestBed.inject(MovimientoFormService);
    movimientoService = TestBed.inject(MovimientoService);
    productoService = TestBed.inject(ProductoService);
    localService = TestBed.inject(LocalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Producto query and add missing value', () => {
      const movimiento: IMovimiento = { id: 13928 };
      const producto: IProducto = { id: 1896 };
      movimiento.producto = producto;

      const productoCollection: IProducto[] = [{ id: 1896 }];
      jest.spyOn(productoService, 'query').mockReturnValue(of(new HttpResponse({ body: productoCollection })));
      const additionalProductos = [producto];
      const expectedCollection: IProducto[] = [...additionalProductos, ...productoCollection];
      jest.spyOn(productoService, 'addProductoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ movimiento });
      comp.ngOnInit();

      expect(productoService.query).toHaveBeenCalled();
      expect(productoService.addProductoToCollectionIfMissing).toHaveBeenCalledWith(
        productoCollection,
        ...additionalProductos.map(expect.objectContaining),
      );
      expect(comp.productosSharedCollection).toEqual(expectedCollection);
    });

    it('should call Local query and add missing value', () => {
      const movimiento: IMovimiento = { id: 13928 };
      const localOrigen: ILocal = { id: 3747 };
      movimiento.localOrigen = localOrigen;
      const localDestino: ILocal = { id: 3747 };
      movimiento.localDestino = localDestino;

      const localCollection: ILocal[] = [{ id: 3747 }];
      jest.spyOn(localService, 'query').mockReturnValue(of(new HttpResponse({ body: localCollection })));
      const additionalLocals = [localOrigen, localDestino];
      const expectedCollection: ILocal[] = [...additionalLocals, ...localCollection];
      jest.spyOn(localService, 'addLocalToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ movimiento });
      comp.ngOnInit();

      expect(localService.query).toHaveBeenCalled();
      expect(localService.addLocalToCollectionIfMissing).toHaveBeenCalledWith(
        localCollection,
        ...additionalLocals.map(expect.objectContaining),
      );
      expect(comp.localsSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const movimiento: IMovimiento = { id: 13928 };
      const producto: IProducto = { id: 1896 };
      movimiento.producto = producto;
      const localOrigen: ILocal = { id: 3747 };
      movimiento.localOrigen = localOrigen;
      const localDestino: ILocal = { id: 3747 };
      movimiento.localDestino = localDestino;

      activatedRoute.data = of({ movimiento });
      comp.ngOnInit();

      expect(comp.productosSharedCollection).toContainEqual(producto);
      expect(comp.localsSharedCollection).toContainEqual(localOrigen);
      expect(comp.localsSharedCollection).toContainEqual(localDestino);
      expect(comp.movimiento).toEqual(movimiento);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMovimiento>>();
      const movimiento = { id: 30126 };
      jest.spyOn(movimientoFormService, 'getMovimiento').mockReturnValue(movimiento);
      jest.spyOn(movimientoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ movimiento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: movimiento }));
      saveSubject.complete();

      // THEN
      expect(movimientoFormService.getMovimiento).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(movimientoService.update).toHaveBeenCalledWith(expect.objectContaining(movimiento));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMovimiento>>();
      const movimiento = { id: 30126 };
      jest.spyOn(movimientoFormService, 'getMovimiento').mockReturnValue({ id: null });
      jest.spyOn(movimientoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ movimiento: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: movimiento }));
      saveSubject.complete();

      // THEN
      expect(movimientoFormService.getMovimiento).toHaveBeenCalled();
      expect(movimientoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMovimiento>>();
      const movimiento = { id: 30126 };
      jest.spyOn(movimientoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ movimiento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(movimientoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProducto', () => {
      it('should forward to productoService', () => {
        const entity = { id: 1896 };
        const entity2 = { id: 15581 };
        jest.spyOn(productoService, 'compareProducto');
        comp.compareProducto(entity, entity2);
        expect(productoService.compareProducto).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareLocal', () => {
      it('should forward to localService', () => {
        const entity = { id: 3747 };
        const entity2 = { id: 29517 };
        jest.spyOn(localService, 'compareLocal');
        comp.compareLocal(entity, entity2);
        expect(localService.compareLocal).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
