import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { KuzzleNgrxModule } from 'kuzzle-ngrx';

import { MaterialModule } from './material.module';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { HeaderComponent } from './navigation/header/header.component';
import { StoreModule } from '@ngrx/store';


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
    AppComponent,
    HeaderComponent,

    SidenavListComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,

    KuzzleNgrxModule.forRoot(kuzzleConfig),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
