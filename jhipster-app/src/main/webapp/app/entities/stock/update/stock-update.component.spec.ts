import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IProducto } from 'app/entities/producto/producto.model';
import { ProductoService } from 'app/entities/producto/service/producto.service';
import { ILocal } from 'app/entities/local/local.model';
import { LocalService } from 'app/entities/local/service/local.service';
import { IStock } from '../stock.model';
import { StockService } from '../service/stock.service';
import { StockFormService } from './stock-form.service';

import { StockUpdateComponent } from './stock-update.component';

describe('Stock Management Update Component', () => {
  let comp: StockUpdateComponent;
  let fixture: ComponentFixture<StockUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let stockFormService: StockFormService;
  let stockService: StockService;
  let productoService: ProductoService;
  let localService: LocalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StockUpdateComponent],
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
      .overrideTemplate(StockUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StockUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    stockFormService = TestBed.inject(StockFormService);
    stockService = TestBed.inject(StockService);
    productoService = TestBed.inject(ProductoService);
    localService = TestBed.inject(LocalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Producto query and add missing value', () => {
      const stock: IStock = { id: 7098 };
      const producto: IProducto = { id: 1896 };
      stock.producto = producto;

      const productoCollection: IProducto[] = [{ id: 1896 }];
      jest.spyOn(productoService, 'query').mockReturnValue(of(new HttpResponse({ body: productoCollection })));
      const additionalProductos = [producto];
      const expectedCollection: IProducto[] = [...additionalProductos, ...productoCollection];
      jest.spyOn(productoService, 'addProductoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ stock });
      comp.ngOnInit();

      expect(productoService.query).toHaveBeenCalled();
      expect(productoService.addProductoToCollectionIfMissing).toHaveBeenCalledWith(
        productoCollection,
        ...additionalProductos.map(expect.objectContaining),
      );
      expect(comp.productosSharedCollection).toEqual(expectedCollection);
    });

    it('should call Local query and add missing value', () => {
      const stock: IStock = { id: 7098 };
      const local: ILocal = { id: 3747 };
      stock.local = local;

      const localCollection: ILocal[] = [{ id: 3747 }];
      jest.spyOn(localService, 'query').mockReturnValue(of(new HttpResponse({ body: localCollection })));
      const additionalLocals = [local];
      const expectedCollection: ILocal[] = [...additionalLocals, ...localCollection];
      jest.spyOn(localService, 'addLocalToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ stock });
      comp.ngOnInit();

      expect(localService.query).toHaveBeenCalled();
      expect(localService.addLocalToCollectionIfMissing).toHaveBeenCalledWith(
        localCollection,
        ...additionalLocals.map(expect.objectContaining),
      );
      expect(comp.localsSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const stock: IStock = { id: 7098 };
      const producto: IProducto = { id: 1896 };
      stock.producto = producto;
      const local: ILocal = { id: 3747 };
      stock.local = local;

      activatedRoute.data = of({ stock });
      comp.ngOnInit();

      expect(comp.productosSharedCollection).toContainEqual(producto);
      expect(comp.localsSharedCollection).toContainEqual(local);
      expect(comp.stock).toEqual(stock);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStock>>();
      const stock = { id: 3954 };
      jest.spyOn(stockFormService, 'getStock').mockReturnValue(stock);
      jest.spyOn(stockService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stock });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stock }));
      saveSubject.complete();

      // THEN
      expect(stockFormService.getStock).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(stockService.update).toHaveBeenCalledWith(expect.objectContaining(stock));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStock>>();
      const stock = { id: 3954 };
      jest.spyOn(stockFormService, 'getStock').mockReturnValue({ id: null });
      jest.spyOn(stockService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stock: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stock }));
      saveSubject.complete();

      // THEN
      expect(stockFormService.getStock).toHaveBeenCalled();
      expect(stockService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStock>>();
      const stock = { id: 3954 };
      jest.spyOn(stockService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stock });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(stockService.update).toHaveBeenCalled();
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
