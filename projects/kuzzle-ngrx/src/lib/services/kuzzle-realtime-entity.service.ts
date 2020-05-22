import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { IdModel } from './kuzzle-data.service';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { WebsocketEventDocument } from 'kuzzle-sdk';
import { Subscription, of, merge } from 'rxjs';
import { KuzzleService } from './kuzzle.service';

export class KuzzleRealtimeEntityService<
  T extends IdModel
> extends EntityCollectionServiceBase<T> {
  filters = {};

  realtimeSubs: Subscription;
  eventSubscription: Subscription;

  constructor(
    entityName: string,
    public kuzzleService: KuzzleService,
    serviceElementsFactory: EntityCollectionServiceElementsFactory
  ) {
    super(entityName, serviceElementsFactory);
    console.log(` ${this.entityName} realtime`);

    this.kuzzleService.kuzzleEvent().pipe(
      switchMap((e) => {
        if (e.event === 'connected' || e.event === 'reconnected') {
          return this.getAll();
        } else {
          return of(null);
        }
      }),
      filter((e) => e !== null),
      switchMap((_) => this.getAll())
    );
    // this.realtimeSubs = this.kuzzleService
    //   .kuzzleEvent()
    //   .pipe(
    //     // switchMap(e => {
    //     //   if (e.event === 'connected' || e.event === 'reconnected') {
    //     //     return this.getAll();
    //     //   } else {
    //     //     return of(null);
    //     //   }
    //     // }),
    //     // filter(e => e !== null),
    //     switchMap(_ => {
    //       this.getAll();
    //       return this.kuzzleService.realtime(this.entityName.toLowerCase(), this.filters).pipe(
    //         catchError(err => {
    //           console.log(err);
    //           return null;
    //         }),
    //         filter(n => n !== null)
    //       );
    //     })
    //   )
    //   .subscribe(
    //     (notification: WebsocketEventDocument) => {
    //       console.log(notification);
    //       const entity = { id: notification.result._id, ...notification.result._source } as T;
    //       switch (notification.action) {
    //         case 'update':
    //         case 'replace':
    //           this.updateOneInCache(entity);
    //           break;
    //         case 'create':
    //           this.addOneToCache(entity);
    //           break;
    //         case 'delete':
    //           this.removeOneFromCache(entity);
    //           break;
    //         default:
    //           break;
    //       }
    //     },
    //     err => console.log('error subsc', err)
    //   );
    this.realtimeSubs = this.kuzzleService
      .realtime(this.entityName.toLowerCase(), this.filters)
      .pipe(
        catchError((err) => {
          console.log('error realtimeSubs', err);
          return null;
        }),
        filter((n) => n !== null)
      )
      .subscribe(
        (notification: WebsocketEventDocument) => {
          console.log(notification);
          const entity = {
            id: notification.result._id,
            ...notification.result._source,
          } as T;
          switch (notification.action) {
            case 'update':
            case 'replace':
              this.updateOneInCache(entity);
              break;
            case 'create':
              this.addOneToCache(entity);
              break;
            case 'delete':
              this.removeOneFromCache(entity);
              break;
            default:
              break;
          }
        },
        (err) => console.log('error subsc', err)
      );
  }
}
