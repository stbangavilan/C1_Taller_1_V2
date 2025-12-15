import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICategoria, NewCategoria } from '../categoria.model';

export type PartialUpdateCategoria = Partial<ICategoria> & Pick<ICategoria, 'id'>;

type RestOf<T extends ICategoria | NewCategoria> = Omit<T, 'fechaCreacion' | 'fechaModificacion'> & {
  fechaCreacion?: string | null;
  fechaModificacion?: string | null;
};

export type RestCategoria = RestOf<ICategoria>;

export type NewRestCategoria = RestOf<NewCategoria>;

export type PartialUpdateRestCategoria = RestOf<PartialUpdateCategoria>;

export type EntityResponseType = HttpResponse<ICategoria>;
export type EntityArrayResponseType = HttpResponse<ICategoria[]>;

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/categorias');

  create(categoria: NewCategoria): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(categoria);
    return this.http
      .post<RestCategoria>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(categoria: ICategoria): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(categoria);
    return this.http
      .put<RestCategoria>(`${this.resourceUrl}/${this.getCategoriaIdentifier(categoria)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(categoria: PartialUpdateCategoria): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(categoria);
    return this.http
      .patch<RestCategoria>(`${this.resourceUrl}/${this.getCategoriaIdentifier(categoria)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCategoria>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCategoria[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCategoriaIdentifier(categoria: Pick<ICategoria, 'id'>): number {
    return categoria.id;
  }

  compareCategoria(o1: Pick<ICategoria, 'id'> | null, o2: Pick<ICategoria, 'id'> | null): boolean {
    return o1 && o2 ? this.getCategoriaIdentifier(o1) === this.getCategoriaIdentifier(o2) : o1 === o2;
  }

  addCategoriaToCollectionIfMissing<Type extends Pick<ICategoria, 'id'>>(
    categoriaCollection: Type[],
    ...categoriasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const categorias: Type[] = categoriasToCheck.filter(isPresent);
    if (categorias.length > 0) {
      const categoriaCollectionIdentifiers = categoriaCollection.map(categoriaItem => this.getCategoriaIdentifier(categoriaItem));
      const categoriasToAdd = categorias.filter(categoriaItem => {
        const categoriaIdentifier = this.getCategoriaIdentifier(categoriaItem);
        if (categoriaCollectionIdentifiers.includes(categoriaIdentifier)) {
          return false;
        }
        categoriaCollectionIdentifiers.push(categoriaIdentifier);
        return true;
      });
      return [...categoriasToAdd, ...categoriaCollection];
    }
    return categoriaCollection;
  }

  protected convertDateFromClient<T extends ICategoria | NewCategoria | PartialUpdateCategoria>(categoria: T): RestOf<T> {
    return {
      ...categoria,
      fechaCreacion: categoria.fechaCreacion?.toJSON() ?? null,
      fechaModificacion: categoria.fechaModificacion?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCategoria: RestCategoria): ICategoria {
    return {
      ...restCategoria,
      fechaCreacion: restCategoria.fechaCreacion ? dayjs(restCategoria.fechaCreacion) : undefined,
      fechaModificacion: restCategoria.fechaModificacion ? dayjs(restCategoria.fechaModificacion) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCategoria>): HttpResponse<ICategoria> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCategoria[]>): HttpResponse<ICategoria[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
