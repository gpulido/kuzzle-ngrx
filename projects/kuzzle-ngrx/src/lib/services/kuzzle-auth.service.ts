import { Injectable } from '@angular/core';
import { KuzzleService } from './kuzzle.service';
import { Observable, from, of, merge, timer, Subject } from 'rxjs';
import { KuzzleUser, ObjectWithAnyKeys } from 'kuzzle-sdk';
import {
  filter,
  map,
  switchMap,
  first,
  delay,
  tap,
  distinctUntilChanged,
} from 'rxjs/operators';

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
  public readonly idToken$: Observable<string | null>;

  /**
   * Observable of the currently signed-in user (or null).
   */
  public readonly user$: Observable<User | null>;

  public readonly jwtExpiration$: Observable<boolean>;

  private readonly logOut$: Subject<null> = new Subject<null>();

  private readonly tokenRefreshed$: Subject<{
    valid: boolean;
    expiresAt: number;
  }> = new Subject<null>();

  constructor(private kuzzleService: KuzzleService) {

    const login$ = this.kuzzleService.kuzzleEvent().pipe(
      filter(
        (ke) => ke.event === 'loginAttempt' || ke.event === 'tokenExpired'
      ),
      tap(ke => console.log('login$', ke)),
      map((ke) => {
        if (ke.data) {
          return ke.data.success;
        }
        return false;
      })
    );

    this.jwtExpiration$ = merge(
      this.kuzzleService.checkToken(),
      this.tokenRefreshed$
    ).pipe(
      tap(tk => console.log('jwtexpiration', tk?.expiresAt)),
      switchMap((tk) => {
        if (tk.valid) {
          return of(true).pipe(delay(tk.expiresAt));
        }
        return of(false);
      })
    );

    this.user$ = merge(of(kuzzleService.kuzzle.authenticated), login$, this.jwtExpiration$, this.logOut$).pipe(
      distinctUntilChanged(),
      switchMap((b) =>
        b
          ? from(this.kuzzleService.kuzzle.auth.getCurrentUser<User>())
          : of(null)
      ),
      map((ku) => (ku ? ku.content : null))
    );

    this.idToken$ = this.user$.pipe(
      switchMap((_) => of(kuzzleService.kuzzle.jwt))
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
    return from(this.kuzzleService.kuzzle.auth.login(strategic, credentials, '20s'));
  }

  public logout(): Observable<void> {
    return from(this.kuzzleService.kuzzle.auth.logout()).pipe(
      tap(() => this.logOut$.next(null))
    );
  }

  public refreshToken(): Observable<{
    _id: string;
    expiresAt: number;
    jwt: string;
    ttl: number;
  }> {
    return from(this.kuzzleService.kuzzle.auth.refreshToken()).pipe(
      tap((tk) =>
        this.tokenRefreshed$.next({ valid: true, expiresAt:tk.expiresAt })
      )
    );
  }
}
