This readme is a WIP.

# KuzzleNgrx

This is a [Kuzzle](https://kuzzle.io/) Angular client library that allows to use kuzzle as  database backend authorization /realtime / file sharing.
It is developed to be a direct drop-in of the http entitycollection for[https://ngrx.io/guide/data](@Ngrx/data) using the same api.

Technically is just a wrapper around the great [https://docs.kuzzle.io/sdk/js/7/getting-started/node-js/](Kuzzle-sdk) library transforming it to use ngrx data and ngrx entity.

It uses the same data design conventions than the ngrx data library.

Each entity should be mapped to a collection on Kuzzle, and relations has to be managed externally.

Realtime capabilities are right out of the box, so entity cache updates are being doing in background automatically.

# Configuration
TODO

# Example application
WIP
