import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { KuzzleNgrxModule } from 'kuzzle-ngrx';

const kuzzleConfig = {
  endpoint: 'kuzzle.test.com',
  index: 'my-index',
  options: {
    port: 443,
    sslConnection: true,
  },
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    KuzzleNgrxModule.forRoot(kuzzleConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
