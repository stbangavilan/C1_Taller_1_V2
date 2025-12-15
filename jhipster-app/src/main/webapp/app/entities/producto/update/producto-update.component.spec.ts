import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IUnidadMedida } from 'app/entities/unidad-medida/unidad-medida.model';
import { UnidadMedidaService } from 'app/entities/unidad-medida/service/unidad-medida.service';
import { ICategoria } from 'app/entities/categoria/categoria.model';
import { CategoriaService } from 'app/entities/categoria/service/categoria.service';
import { IProducto } from '../producto.model';
import { ProductoService } from '../service/producto.service';
import { ProductoFormService } from './producto-form.service';

import { ProductoUpdateComponent } from './producto-update.component';

describe('Producto Management Update Component', () => {
  let comp: ProductoUpdateComponent;
  let fixture: ComponentFixture<ProductoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productoFormService: ProductoFormService;
  let productoService: ProductoService;
  let unidadMedidaService: UnidadMedidaService;
  let categoriaService: CategoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductoUpdateComponent],
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
      .overrideTemplate(ProductoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productoFormService = TestBed.inject(ProductoFormService);
    productoService = TestBed.inject(ProductoService);
    unidadMedidaService = TestBed.inject(UnidadMedidaService);
    categoriaService = TestBed.inject(CategoriaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call UnidadMedida query and add missing value', () => {
      const producto: IProducto = { id: 15581 };
      const unidadMedida: IUnidadMedida = { id: 803 };
      producto.unidadMedida = unidadMedida;

      const unidadMedidaCollection: IUnidadMedida[] = [{ id: 803 }];
      jest.spyOn(unidadMedidaService, 'query').mockReturnValue(of(new HttpResponse({ body: unidadMedidaCollection })));
      const additionalUnidadMedidas = [unidadMedida];
      const expectedCollection: IUnidadMedida[] = [...additionalUnidadMedidas, ...unidadMedidaCollection];
      jest.spyOn(unidadMedidaService, 'addUnidadMedidaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ producto });
      comp.ngOnInit();

      expect(unidadMedidaService.query).toHaveBeenCalled();
      expect(unidadMedidaService.addUnidadMedidaToCollectionIfMissing).toHaveBeenCalledWith(
        unidadMedidaCollection,
        ...additionalUnidadMedidas.map(expect.objectContaining),
      );
      expect(comp.unidadMedidasSharedCollection).toEqual(expectedCollection);
    });

    it('should call Categoria query and add missing value', () => {
      const producto: IProducto = { id: 15581 };
      const categoria: ICategoria = { id: 24962 };
      producto.categoria = categoria;

      const categoriaCollection: ICategoria[] = [{ id: 24962 }];
      jest.spyOn(categoriaService, 'query').mockReturnValue(of(new HttpResponse({ body: categoriaCollection })));
      const additionalCategorias = [categoria];
      const expectedCollection: ICategoria[] = [...additionalCategorias, ...categoriaCollection];
      jest.spyOn(categoriaService, 'addCategoriaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ producto });
      comp.ngOnInit();

      expect(categoriaService.query).toHaveBeenCalled();
      expect(categoriaService.addCategoriaToCollectionIfMissing).toHaveBeenCalledWith(
        categoriaCollection,
        ...additionalCategorias.map(expect.objectContaining),
      );
      expect(comp.categoriasSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const producto: IProducto = { id: 15581 };
      const unidadMedida: IUnidadMedida = { id: 803 };
      producto.unidadMedida = unidadMedida;
      const categoria: ICategoria = { id: 24962 };
      producto.categoria = categoria;

      activatedRoute.data = of({ producto });
      comp.ngOnInit();

      expect(comp.unidadMedidasSharedCollection).toContainEqual(unidadMedida);
      expect(comp.categoriasSharedCollection).toContainEqual(categoria);
      expect(comp.producto).toEqual(producto);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProducto>>();
      const producto = { id: 1896 };
      jest.spyOn(productoFormService, 'getProducto').mockReturnValue(producto);
      jest.spyOn(productoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ producto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: producto }));
      saveSubject.complete();

      // THEN
      expect(productoFormService.getProducto).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(productoService.update).toHaveBeenCalledWith(expect.objectContaining(producto));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProducto>>();
      const producto = { id: 1896 };
      jest.spyOn(productoFormService, 'getProducto').mockReturnValue({ id: null });
      jest.spyOn(productoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ producto: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: producto }));
      saveSubject.complete();

      // THEN
      expect(productoFormService.getProducto).toHaveBeenCalled();
      expect(productoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProducto>>();
      const producto = { id: 1896 };
      jest.spyOn(productoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ producto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUnidadMedida', () => {
      it('should forward to unidadMedidaService', () => {
        const entity = { id: 803 };
        const entity2 = { id: 8903 };
        jest.spyOn(unidadMedidaService, 'compareUnidadMedida');
        comp.compareUnidadMedida(entity, entity2);
        expect(unidadMedidaService.compareUnidadMedida).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCategoria', () => {
      it('should forward to categoriaService', () => {
        const entity = { id: 24962 };
        const entity2 = { id: 11537 };
        jest.spyOn(categoriaService, 'compareCategoria');
        comp.compareCategoria(entity, entity2);
        expect(categoriaService.compareCategoria).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
