import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { KuzzleAuthService } from 'projects/kuzzle-ngrx/src/public-api';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [
    ReactiveFormsModule,
    KuzzleAuthService,
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
