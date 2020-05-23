# KuzzleNgrx

:warning: This readme is a WIP.

This is a [Kuzzle](https://kuzzle.io/) Angular client library that allows to use kuzzle as  database backend authorization /realtime / file sharing.
It is developed to be a direct drop-in of the http entitycollection for[https://ngrx.io/guide/data](@Ngrx/data) using the same api.

Technically is just a wrapper around the great [https://docs.kuzzle.io/sdk/js/7/](Kuzzle-sdk) library transforming it to use ngrx data and ngrx entity.

It uses the same data design conventions than the ngrx data library.

Each entity should be mapped to a collection on Kuzzle, and relations have to be managed externally.

[Realtime capabilities](https://docs.kuzzle.io/core/2/guides/essentials/real-time/) are right out of the box, so entity cache updates are being done in background automatically.

# Installation

This library use [Kuzzle Javascript SDK](https://github.com/kuzzleio/sdk-javascript) in version `7.x.x` as a peer dependency.  

You must add `kuzzle-sdk` to your project alongside `kuzzle-ngrx`.

```
$ npm install kuzzle-sdk kuzzle-ngrx
```

## Files service

The Files service use [Kuzzle S3 Plugin](https://github.com/kuzzleio/kuzzle-plugin-s3) so you have to install it on your Kuzzle server to use these functionnalities.

# Configuration

This ngrx data extension is configured and used almost the same way as in ngrx.

In order to make it work the ngrx data should be [installed and configured as in the official guides](https://ngrx.io/guide/store/install).  

Also an instance of Kuzzle must be accessible. (See [Running Kuzzle](https://docs.kuzzle.io/core/2/guides/getting-started/running-kuzzle/))

After doing it:

### 1) Create the model that supports the entity. 

It has to extend the IdModel class.

```ts
  export interface Tournament extends IdModel {
      description: string;
      longDescription: string;
   }
```

### 2) Create a collection in Kuzzle with a mapping similar to this one

You can either use the [Admin Console](http://console.kuzzle.io) or directly the [API](https://docs.kuzzle.io/core/2/api/controllers/collection/create/) to create a collection

The [mappings dynamic policy](https://docs.kuzzle.io/core/2/guides/essentials/database-mappings/#dynamic-mapping-policy) has to be strict.  
[Collection metadata](https://docs.kuzzle.io/core/2/guides/essentials/database-mappings/#collection-metadata) are not used at the moment but may be used in the future.

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

You can also create this mapping as a const inside angular and create or update the schema in kuzzle using the schema updater service of this library. 
:warning: Be aware that this is in early stages of development.

### 3) Create the tournaments-data and tournament-entity services as stated by ngrx

They has to extends the classes of kuzzle-ngrx.

```ts   
  // tournament-entity-service.ts

  import { KuzzleRealtimeEntityService } from 'kuzzle-ngrx';
  import { KuzzleService } from 'kuzzle-ngrx';

  @Injectable()
  export class TournamentEntityService extends KuzzleRealtimeEntityService<Tournament> {
    constructor(kuzzle: KuzzleService, serviceElementsFactory: EntityCollectionServiceElementsFactory) {
      super('Tournament', kuzzle, serviceElementsFactory);
    }
  }

```

```ts
// tournaments-data.service.ts

import { KuzzleDataService } from 'kuzzle-ngrx';
import { KuzzleService } from 'kuzzle-ngrx';

@Injectable()
export class TournamentsDataService extends KuzzleDataService<Tournament> {
  constructor(kuzzle: KuzzleService) {
    super('Tournament', kuzzle);
  }
}

```

### 4) Register those entities on ngrx for the module.

This is the same as regular ngrx data and entity way.

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
})

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
### 5) Import the KuzzleNgrxModule into your app module at root level providing the kuzzle configuration
   
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

### 6) Anytime you need to manage the data, use the EntityService as usual.

# Realtime

The first time a EntityService is injected it starts a realtime subscription to kuzzle so the entityService cache is being continuously updated with the changes from the kuzzle collection. This mechanism can't be disconnected at this moment but a configuration option maybe added in the future.

# Example application

TODO

# Build from source code.

TODO
