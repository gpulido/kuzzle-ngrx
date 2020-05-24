import { Injectable } from '@angular/core';
import { KuzzleService } from './kuzzle.service';
import { Observable, from, of, merge, timer } from 'rxjs';
import { KuzzleUser, ObjectWithAnyKeys } from 'kuzzle-sdk';
import { filter, map, switchMap, first } from 'rxjs/operators';

export interface User {
  name: string;
}

@Injectable({
  providedIn: 'any',
})
export class KuzzleAuthService {
  /**
   * Observable of the currently signed-in user's JWT token used to identify the user to a Firebase service (or null).
   */
  public readonly idToken: Observable<string | null>;

  /**
   * Observable of the currently signed-in user (or null).
   */
  public readonly user: Observable<User | null>;

  constructor(private kuzzleService: KuzzleService) {
    const currentUser$ = of(kuzzleService.kuzzle.authenticated);
    const login$ = kuzzleService.kuzzleEvent().pipe(
      filter(
        (ke) => ke.event === 'loginAttempt' || ke.event === 'tokenExpired'
      ),
      map((ke) => {
        if (ke.data) {
          return ke.data.success;
        }
        return false;
      })
    );

    this.user = merge(currentUser$, login$).pipe(
      switchMap((b) =>
        b ? from(kuzzleService.kuzzle.auth.getCurrentUser<User>()) : of(null)
      ),
      map((ku) => (ku ? ku.content : null))
    );

    this.idToken = this.user.pipe(
      switchMap((u) => of(kuzzleService.kuzzle.jwt))
    );
  }

  public loginWithUsernameAndPassword(
    username: string,
    password: string
  ): Observable<string> {
    return this.login('local', { username, password });
  }

  public login(
    strategic: string,
    credentials: ObjectWithAnyKeys
  ): Observable<string> {
    return from(this.kuzzleService.kuzzle.auth.login(strategic, credentials));
  }

  public logout(): Observable<void> {
    return from(this.kuzzleService.kuzzle.auth.logout());
  }
}
