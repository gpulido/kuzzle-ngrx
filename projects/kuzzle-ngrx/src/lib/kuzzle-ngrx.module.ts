import {
  NgModule,
  Injector,
  ModuleWithProviders,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Kuzzle } from 'kuzzle-sdk';
import {
  KUZZLE_PROTOCOL,
  KuzzleProtocolFactory,
  KuzzleFactory,
  KUZZLE_CONFIG,
  KuzzleModuleConfig,
  KuzzleService,
} from './services/kuzzle.service';
import { KuzzleFilesService } from './services/kuzzle-files.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    KuzzleService,
    {
      provide: KUZZLE_PROTOCOL,
      useFactory: KuzzleProtocolFactory,
      deps: [Injector, KUZZLE_CONFIG],
    },
    {
      provide: Kuzzle,
      useFactory: KuzzleFactory,
      deps: [Injector, KUZZLE_PROTOCOL],
    },
  ],
})
export class KuzzleNgrxModule {
  static forRoot(
    config: KuzzleModuleConfig
  ): ModuleWithProviders<KuzzleNgrxModule> {
    return {
      ngModule: KuzzleNgrxModule,
      providers: [{ provide: KUZZLE_CONFIG, useValue: config }],
    };
  }
  constructor(kuzzleService: KuzzleService) {
    kuzzleService.connect();
  }
}

