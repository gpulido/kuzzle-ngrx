import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { KuzzleNgrxModule } from 'kuzzle-ngrx';

import { MaterialModule } from './material.module';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { HeaderComponent } from './navigation/header/header.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './app.reducer';
import { AuthService } from './auth/auth.service';
import { UIService } from './shared/ui.service';
import { ListComponentComponent } from './list-component/list-component.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';

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
    WelcomeComponent,
    ListComponentComponent,
    SidenavListComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    AppRoutingModule,
    KuzzleNgrxModule.forRoot(kuzzleConfig),
    AuthModule,
    StoreModule.forRoot(reducers)
  ],
  providers: [AuthService, UIService],
  bootstrap: [AppComponent]
})
export class AppModule { }
