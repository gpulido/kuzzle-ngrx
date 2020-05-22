import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { KuzzleNgrxModule } from 'kuzzle-ngrx';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    KuzzleNgrxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
