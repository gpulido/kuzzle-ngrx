import { Injectable, InjectionToken, Injector, Inject } from '@angular/core';

import {
  Kuzzle,
  KuzzleAbstractProtocol,
  WebSocket,
  ObjectWithAnyKeys,
  WebsocketEventDocument,
  KuzzleDocument,
  KuzzleSearchResult,
  ScrollOptions,
  KuzzleEvent,
} from 'kuzzle-sdk';
import {
  Subject,
  Observable,
  of,
  from,
  Subscription,
  Observer,
  merge,
  throwError,
} from 'rxjs';
import {
  map,
  finalize,
  share,
  switchMap,
  catchError,
  filter,
  tap,
  mergeMap,
} from 'rxjs/operators';

export interface KuzzleModuleConfig {
  endpoint: string;
  index: string;
  options: { port: number; sslConnection: boolean };
}

export const KUZZLE_PROTOCOL = new InjectionToken<KuzzleAbstractProtocol>(
  'KUZZLE_PROTOCOL'
);
export const KUZZLE_CONFIG = new InjectionToken<KuzzleModuleConfig>(
  'KUZZLE_CONFIG'
);

export const KuzzleProtocolFactory = (injector: Injector) => {
  const kuzzleConfig = injector.get(KUZZLE_CONFIG);
  return new WebSocket(kuzzleConfig.endpoint, kuzzleConfig.options);
};
export const KuzzleFactory = (injector: Injector) => {
  const KuzzleProtocol = injector.get(KUZZLE_PROTOCOL);
  return new Kuzzle(KuzzleProtocol, {});
};

export interface KuzzleModuleEvent {
  event: KuzzleEvent;
  data?: any;
}
@Injectable({
  providedIn: 'root',
})
export class KuzzleService {
  eventSubscription: Subscription;
  constructor(
    public kuzzle: Kuzzle,
    @Inject(KUZZLE_CONFIG) private kuzzleConfig: KuzzleModuleConfig
  ) {
    console.log('Kuzzle service created');
    this.kuzzle.autoReplay = true;
    this.kuzzle.autoQueue = true;
    this.index = this.kuzzleConfig.index;
    this.eventSubscription = this.kuzzleEvent().subscribe((e) =>
      console.log('events', e)
    );
  }

  index: string;

  public kuzzleEvent(): Observable<KuzzleModuleEvent> {
    const sendResult = new Subject<KuzzleModuleEvent>();
    this.kuzzle.on('connected', () => sendResult.next({ event: 'connected' }));
    this.kuzzle.on('disconnected', () =>
      sendResult.next({ event: 'disconnected' })
    );
    this.kuzzle.on('reconnected', () =>
      sendResult.next({ event: 'reconnected' })
    );
    this.kuzzle.on('loginAttempt', (data) =>
      sendResult.next({ event: 'loginAttempt', data })
    );
    this.kuzzle.on('networkError', (data) =>
      sendResult.next({ event: 'networkError', data })
    );
    this.kuzzle.on('tokenExpired', () =>
      sendResult.next({ event: 'tokenExpired' })
    );
    const alreadyConnected = of({
      event: this.kuzzle.connected ? 'connected' : 'disconnected',
    } as KuzzleModuleEvent);
    return merge(alreadyConnected, sendResult.asObservable());
  }

  public connect(): Observable<void> {
    return from(this.kuzzle.connect());
  }

  public disconnect() {
    return this.kuzzle.disconnect();
  }

  public onDisconnected(): Observable<boolean> {
    const sendResult = new Subject<boolean>();
    this.kuzzle.on('disconnected', () => {
      sendResult.next(true);
    });
    return sendResult.asObservable();
  }

  public realtime(
    entityName: string,
    filters: ObjectWithAnyKeys
  ): Observable<WebsocketEventDocument> {
    const sendResult = new Subject<WebsocketEventDocument>();
    let roomId: string | void;
    return from(
      this.kuzzle.realtime
        .subscribe(
          this.kuzzleConfig.index,
          entityName.toLowerCase(),
          filters,
          (eventObject: WebsocketEventDocument) => sendResult.next(eventObject)
        )
        .catch((error) => {
          console.log('error on realtime', error);
          sendResult.error(error);
        })
    ).pipe(
      switchMap((id: string | void) => {
        console.log('subscribe with id', id);
        roomId = id;
        return sendResult.asObservable();
      }),
      finalize(() => {
        console.log('finalized');
        if (roomId) {
          this.kuzzle.realtime.unsubscribe(roomId as string);
        }
      }),
      share(),
      catchError((error) => {
        console.log('error on subscription', error);
        return of(null);
      })
    );
  }

  public async updateOrCreateMapping(
    collection: string,
    mapping: ObjectWithAnyKeys
  ): Promise<void> {
    // Subsequent calls to collection:create updates existent mappings
    await this.kuzzle.collection.create(
      this.index,
      collection.toLowerCase(),
      mapping
    );
  }
  public createEntity<T>(
    entityCollection: string,
    entity: T,
    id: string
  ): Observable<T> {
    return from(
      this.kuzzle.document.create(
        this.index,
        entityCollection.toLowerCase(),
        entity,
        id
      )
    ).pipe(
      map((r) => ({
        id: (r as KuzzleDocument<T>)._id,
        ...(r as KuzzleDocument<T>)._source,
      }))
    );
  }
  public deleteEntity(
    entityCollection: string,
    id: string
  ): Observable<string> {
    return from(
      this.kuzzle.document.delete(
        this.index,
        entityCollection.toLowerCase(),
        id
      )
    ).pipe(map((i) => i as string));
  }
  public getEntityById<T>(entityCollection: string, id: string): Observable<T> {
    return from(
      this.kuzzle.document.get<T>(
        this.index,
        entityCollection.toLowerCase(),
        id
      )
    ).pipe(
      map((r) => ({
        id: (r as KuzzleDocument<T>)._id,
        ...(r as KuzzleDocument<T>)._source,
      }))
    );
  }
  public updateEntity<T>(
    entityCollection: string,
    id: string,
    changes: Partial<T>
  ): Observable<T> {
    return from(
      this.kuzzle.document.update(
        this.index,
        entityCollection.toLowerCase(),
        id as string,
        changes,
        { retryOnConflict: 10 }
      )
    ).pipe(
      map((r) => r as KuzzleDocument<T>),
      map((r) => ({ id: r._id, ...r._source }))
    );
  }

  public upsertEntity<T>(
    entityCollection: string,
    id: string,
    entity: T
  ): Observable<T> {
    return from(
      this.kuzzle.document.createOrReplace(
        this.index,
        entityCollection.toLowerCase(),
        id,
        entity
      )
    ).pipe(
      map((r) => r as KuzzleDocument<T>),
      map((r) => ({ id: r._id, ...r._source }))
    );
  }
  public search<T>(
    entityCollection: string,
    scrollOptions: ScrollOptions
  ): Observable<T[]> {
    return from(
      this.kuzzle.document.search<T>(
        this.index,
        entityCollection.toLowerCase(),
        {},
        scrollOptions
      )
    ).pipe(
      map((d) =>
        (d as KuzzleSearchResult<T>).hits.map<T>((h) => ({
          id: h._id,
          ...h._source,
        }))
      )
    );
  }

  public checkToken(): Observable<{
    valid: boolean;
    state: string;
    expiresAt: number;
  }> {
    return this.kuzzleEvent().pipe(
      filter((ke) => ke.event === 'connected'),
      tap(e => console.log('KuzzleService - checktoken', e)),
      tap(e => console.log('kuzzle-service aut', this.kuzzle.jwt)),
      switchMap((e) => {
        if (this.kuzzle.jwt)
        {
          console.log('kuzzleservice- auth');
          return from(this.kuzzle.auth.checkToken());
        }
        return of(null);
      }
      ),
      catchError(e => {
        console.log("error ", e);
        return throwError(e);
      })
      ,
    );
  }
}
