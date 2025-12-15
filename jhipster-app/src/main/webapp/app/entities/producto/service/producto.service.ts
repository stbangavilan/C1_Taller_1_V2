import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProducto, NewProducto } from '../producto.model';

export type PartialUpdateProducto = Partial<IProducto> & Pick<IProducto, 'id'>;

type RestOf<T extends IProducto | NewProducto> = Omit<T, 'fechaCreacion' | 'fechaModificacion'> & {
  fechaCreacion?: string | null;
  fechaModificacion?: string | null;
};

export type RestProducto = RestOf<IProducto>;

export type NewRestProducto = RestOf<NewProducto>;

export type PartialUpdateRestProducto = RestOf<PartialUpdateProducto>;

export type EntityResponseType = HttpResponse<IProducto>;
export type EntityArrayResponseType = HttpResponse<IProducto[]>;

@Injectable({ providedIn: 'root' })
export class ProductoService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/productos');

  create(producto: NewProducto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(producto);
    return this.http
      .post<RestProducto>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(producto: IProducto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(producto);
    return this.http
      .put<RestProducto>(`${this.resourceUrl}/${this.getProductoIdentifier(producto)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(producto: PartialUpdateProducto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(producto);
    return this.http
      .patch<RestProducto>(`${this.resourceUrl}/${this.getProductoIdentifier(producto)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProducto>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProducto[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProductoIdentifier(producto: Pick<IProducto, 'id'>): number {
    return producto.id;
  }

  compareProducto(o1: Pick<IProducto, 'id'> | null, o2: Pick<IProducto, 'id'> | null): boolean {
    return o1 && o2 ? this.getProductoIdentifier(o1) === this.getProductoIdentifier(o2) : o1 === o2;
  }

  addProductoToCollectionIfMissing<Type extends Pick<IProducto, 'id'>>(
    productoCollection: Type[],
    ...productosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const productos: Type[] = productosToCheck.filter(isPresent);
    if (productos.length > 0) {
      const productoCollectionIdentifiers = productoCollection.map(productoItem => this.getProductoIdentifier(productoItem));
      const productosToAdd = productos.filter(productoItem => {
        const productoIdentifier = this.getProductoIdentifier(productoItem);
        if (productoCollectionIdentifiers.includes(productoIdentifier)) {
          return false;
        }
        productoCollectionIdentifiers.push(productoIdentifier);
        return true;
      });
      return [...productosToAdd, ...productoCollection];
    }
    return productoCollection;
  }

  protected convertDateFromClient<T extends IProducto | NewProducto | PartialUpdateProducto>(producto: T): RestOf<T> {
    return {
      ...producto,
      fechaCreacion: producto.fechaCreacion?.toJSON() ?? null,
      fechaModificacion: producto.fechaModificacion?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restProducto: RestProducto): IProducto {
    return {
      ...restProducto,
      fechaCreacion: restProducto.fechaCreacion ? dayjs(restProducto.fechaCreacion) : undefined,
      fechaModificacion: restProducto.fechaModificacion ? dayjs(restProducto.fechaModificacion) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestProducto>): HttpResponse<IProducto> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProducto[]>): HttpResponse<IProducto[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
