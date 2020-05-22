# KuzzleNgrx

This readme is a WIP.

This is a [Kuzzle](https://kuzzle.io/) Angular client library that allows to use kuzzle as  database backend authorization /realtime / file sharing.
It is developed to be a direct drop-in of the http entitycollection for[https://ngrx.io/guide/data](@Ngrx/data) using the same api.

Technically is just a wrapper around the great [https://docs.kuzzle.io/sdk/js/7/getting-started/node-js/](Kuzzle-sdk) library transforming it to use ngrx data and ngrx entity.

It uses the same data design conventions than the ngrx data library.

Each entity should be mapped to a collection on Kuzzle, and relations has to be managed externally.

Realtime capabilities are right out of the box, so entity cache updates are being doing in background automatically.

# Configuration

This ngrx data extension is configured and used almost the same way as in ngrx.

In order to make it work the ngrx data should be installed and configured as in the official guides.
Also an instance of Kuzzle must be accesible.
After doing it:

1) Create the model that supports the entity. It has to extend the IdModel class.

```ts
  export interface Tournament extends IdModel {
      description: string;
      longDescription: string;
   }
```

2) Create a collection in Kuzzle with an schema similar as this:
   The schema has to be strict. And the meta is not necesary at this moment but it will be
   used in the future.

```ts
  export const tournamentMapping = {
    dynamic: 'strict',
    _meta: {
      modelVersion: '1'
    },
    properties: {
      description: { type: 'text' },
      longDescription: { type: 'text' },
    }
  }
```

You can also create this mapping as a const inside angular and create or update the schema in kuzzle using the schema updater service of this library. Be aware that this is in early stages of development.

3) Create the tournaments-data and tournament-entity services as stated by ngrx, but in this case they has to extends the classes of kuzzle-ngrx:

tournament-entity-service.ts

```ts   
  import { KuzzleRealtimeEntityService } from 'kuzzle-ngrx';
  import { KuzzleService } from 'kuzzle-ngrx';

  @Injectable()
  export class TournamentEntityService extends KuzzleRealtimeEntityService<Tournament> {
    constructor(kuzzle: KuzzleService, serviceElementsFactory: EntityCollectionServiceElementsFactory) {
      super('Tournament', kuzzle, serviceElementsFactory);
    }
  }

```

tournaments-data.service.ts

```ts
import { KuzzleDataService } from 'kuzzle-ngrx';
import { KuzzleService } from 'kuzzle-ngrx';

@Injectable()
export class TournamentsDataService extends KuzzleDataService<Tournament> {
  constructor(kuzzle: KuzzleService) {
    super('Tournament', kuzzle);
  }
}

```

4) Register those entities on ngrx for the module. This is the same as regular ngrx data and entity way:

```ts
const entityMetadada: EntityMetadataMap = {
    Tournament: {}
  };
  @NgModule({
  declarations: [
   ...
  ],
  imports: [
    ...
  ],
  providers: [
    TournamentEntityService,
    TournamentsDataService,
  ],

   export class TournamentsModule {
  constructor(
    eds: EntityDefinitionService,
    entityDataService: EntityDataService,
    tournamentsDataService: TournamentsDataService,
  ) {
    eds.registerMetadataMap(entityMetadada);
    entityDataService.registerService('Tournament', tournamentsDataService);

  }
}

```
5) Import the KuzzleNgrxModule into your app module at root level providing the kuzzle configuration
   
  ```ts
  export const kuzzleConfig = {
    endpoint: 'kuzzle.test.com',
    index: 'annotation',
    options: {
      port: 443,
      sslConnection: true
    }
  };

  KuzzleNgrxModule.forRoot(kuzzleConfig),

```

6) Anytime you need to manage the data use the EntityService as usual.

# Realtime

The first time a EntityService is injected it starts a realtime subscription to kuzzle so the entityService cache is being continuously updated with the changes from the kuzzle collection. This mechanism can't be disconnected at this moment but a configuration option maybe added in the future.

# Example application

TODO

# Build from source code.

TODO
