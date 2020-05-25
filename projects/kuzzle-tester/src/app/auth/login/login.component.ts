import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/app.reducer';
import * as AuthActions from '../store/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading$: Observable<Boolean>;

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
  }

  onLogin(f: NgForm) {
    if (f.invalid) {
      return;
    }
    this.store.dispatch(
      new AuthActions.TrySignin({
        username: f.value.username,
        password: f.value.password,
      })
    );
  }
}
