import { EntityCollectionDataService, QueryParams, DataServiceError, RequestData } from '@ngrx/data';
import { Observable, from, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KuzzleService } from './kuzzle.service';
import { ScrollOptions } from 'kuzzle-sdk';
import { UpdateStr } from '@ngrx/entity/src/models';

export interface IdModel {
  id: string;
  _kuzzle_info?: any;
}

export class KuzzleDataService<T extends IdModel> implements EntityCollectionDataService<T> {
  protected _name: string;
  protected entityName: string;

  get name() {
    return this._name;
  }

  constructor(entityName: string, private kuzzleService: KuzzleService) {
    this._name = `${entityName} KuzzleDataService`;
    this.entityName = entityName;
  }


  add(entity: T): Observable<T> {
    if (!entity) {
      const error = new Error(`No "${this.entityName}" entity to add`);
      return this.handleError(null)(error);
    }
    const id = entity.id;
    const { ['id']: dummy, ['_kuzzle_info']: dummy2, ...entity2 } = entity as any;
    return this.kuzzleService.createEntity<T>(this.entityName, entity2, id);
  }

  delete(id: string): Observable<string> {
    if (id == null) {
      const error = new Error(`No "${this.entityName}" key to delete`);
      return this.handleError(null)(error);
    }
    return from(this.kuzzleService.deleteEntity(this.entityName.toLowerCase(), id)).pipe(
      catchError(this.handleError(null))
    );
  }

  getById(id: string): Observable<T> {
    if (id == null) {
      const error = new Error(`No "${this.entityName}" key to get`);
      return this.handleError(null)(error);
    }
    return this.kuzzleService.getEntityById<T>(this.entityName, id).pipe(catchError(this.handleError(null)));
  }

  getWithQuery(params: string | QueryParams): Observable<T[]> {
    // params has to be an elasticsearch DSL json format
    // TODO: review how to use params and pagination
    let scrollOptions: ScrollOptions;
    let params3 = params;
    if (params.hasOwnProperty('pageSize') && params.hasOwnProperty('pageNumber')) {
      scrollOptions = {
        size: params['pageSize'],
        from: params['pageNumber'] * params['pageSize']
      };
      //remove values
      const { ['pageSize']: dummy, ['pageNumber']: dummy2, ...params2 } = params as any;
      params3 = params2;
    }
    const searchParams = {
      query: {
        match: params3
      }
    };
    return this.kuzzleService.search<T>(this.entityName, scrollOptions).pipe(
      catchError(this.handleError(null))
    );
  }

  update(update: UpdateStr<T>): Observable<T> {
    const id = update && update.id;
    if (!id) {
      const error = new Error(`No "${this.entityName}" update data or id`);
      return this.handleError(null)(error);
    }
    const { ['id']: dummy, ['_kuzzle_info']: dummy2, ...changes } = update.changes;
    return this.kuzzleService
      .updateEntity(this.entityName, id, changes as Partial<T>)
      .pipe(catchError(this.handleError(null)));
  }

  upsert(entity: T): Observable<T> {
    let id: string;
    let entity2: T;
    if (entity) {
      id = entity.id;
      entity2 = { _id: entity.id, ...entity };
      delete entity2.id;
    } else {
      const error = new Error(`No "${this.entityName}" entity to upsert`);
      return this.handleError(null)(error);
    }
    return this.kuzzleService.upsertEntity(this.entityName, id, entity2)
    .pipe(
      catchError(this.handleError(null))
    );
  }

  getAll(): Observable<T[]> {
    return this.getWithQuery({
      pageSize: '10000',
      pageNumber: '0'
    });
  }

  private handleError(reqData: RequestData) {
    return (err: any) => {
      console.log(err);
      const error = new DataServiceError(err, reqData);
      return throwError(error);
    };
  }
}
