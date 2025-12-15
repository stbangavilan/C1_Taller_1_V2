import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILocal, NewLocal } from '../local.model';

export type PartialUpdateLocal = Partial<ILocal> & Pick<ILocal, 'id'>;

type RestOf<T extends ILocal | NewLocal> = Omit<T, 'fechaCreacion' | 'fechaModificacion'> & {
  fechaCreacion?: string | null;
  fechaModificacion?: string | null;
};

export type RestLocal = RestOf<ILocal>;

export type NewRestLocal = RestOf<NewLocal>;

export type PartialUpdateRestLocal = RestOf<PartialUpdateLocal>;

export type EntityResponseType = HttpResponse<ILocal>;
export type EntityArrayResponseType = HttpResponse<ILocal[]>;

@Injectable({ providedIn: 'root' })
export class LocalService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/locals');

  create(local: NewLocal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(local);
    return this.http.post<RestLocal>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(local: ILocal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(local);
    return this.http
      .put<RestLocal>(`${this.resourceUrl}/${this.getLocalIdentifier(local)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(local: PartialUpdateLocal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(local);
    return this.http
      .patch<RestLocal>(`${this.resourceUrl}/${this.getLocalIdentifier(local)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestLocal>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestLocal[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLocalIdentifier(local: Pick<ILocal, 'id'>): number {
    return local.id;
  }

  compareLocal(o1: Pick<ILocal, 'id'> | null, o2: Pick<ILocal, 'id'> | null): boolean {
    return o1 && o2 ? this.getLocalIdentifier(o1) === this.getLocalIdentifier(o2) : o1 === o2;
  }

  addLocalToCollectionIfMissing<Type extends Pick<ILocal, 'id'>>(
    localCollection: Type[],
    ...localsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const locals: Type[] = localsToCheck.filter(isPresent);
    if (locals.length > 0) {
      const localCollectionIdentifiers = localCollection.map(localItem => this.getLocalIdentifier(localItem));
      const localsToAdd = locals.filter(localItem => {
        const localIdentifier = this.getLocalIdentifier(localItem);
        if (localCollectionIdentifiers.includes(localIdentifier)) {
          return false;
        }
        localCollectionIdentifiers.push(localIdentifier);
        return true;
      });
      return [...localsToAdd, ...localCollection];
    }
    return localCollection;
  }

  protected convertDateFromClient<T extends ILocal | NewLocal | PartialUpdateLocal>(local: T): RestOf<T> {
    return {
      ...local,
      fechaCreacion: local.fechaCreacion?.toJSON() ?? null,
      fechaModificacion: local.fechaModificacion?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restLocal: RestLocal): ILocal {
    return {
      ...restLocal,
      fechaCreacion: restLocal.fechaCreacion ? dayjs(restLocal.fechaCreacion) : undefined,
      fechaModificacion: restLocal.fechaModificacion ? dayjs(restLocal.fechaModificacion) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestLocal>): HttpResponse<ILocal> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestLocal[]>): HttpResponse<ILocal[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
