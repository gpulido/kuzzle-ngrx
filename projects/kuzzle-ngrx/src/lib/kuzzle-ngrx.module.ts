import {
  NgModule,
  Injector,
  ModuleWithProviders,
  InjectionToken,
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

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
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
export class KuzzleModule {
  static forRoot(
    config: KuzzleModuleConfig
  ): ModuleWithProviders<KuzzleModule> {
    return {
      ngModule: KuzzleModule,
      providers: [{ provide: KUZZLE_CONFIG, useValue: config }],
    };
  }
  constructor(kuzzleService: KuzzleService) {
    kuzzleService.connect();
  }
}

