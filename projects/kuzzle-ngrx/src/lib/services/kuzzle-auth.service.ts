import { Injectable } from '@angular/core';
import { KuzzleService } from './kuzzle.service';
import { Observable, from } from 'rxjs';
import { KuzzleUser, ObjectWithAnyKeys } from 'kuzzle-sdk';
import { filter, map } from 'rxjs/operators';

export interface User {
  name: string;
}

@Injectable({
  providedIn: 'any',
})
export class KuzzleAuthService {
  /**
   * Observable of authentication state; Only trigger if a login /
   */
  public readonly authState: Observable<any | null>; //user to be defined

  /**
   * Observable of the currently signed-in user's JWT token used to identify the user to a Firebase service (or null).
   */
  public readonly idToken: Observable<string | null>;

  /**
   * Observable of the currently signed-in user (or null).
   */
  public readonly user: Observable<User | null>;

  // /**
  //  * Observable of the currently signed-in user's IdTokenResult object which contains the ID token JWT string and other
  //  * helper properties for getting different data associated with the token as well as all the decoded payload claims
  //  * (or null).
  //  */
  // public readonly idTokenResult: Observable<auth.IdTokenResult | null>;

  constructor(private kuzzleService: KuzzleService) {


    this.authState = kuzzleService.kuzzleEvent().pipe(filter(ke => ke.event === 'loginAttempt'));

    this.user = from(kuzzleService.kuzzle.auth.getCurrentUser<User>()).pipe(map(ku => ku.content));

  }
  public loginWithUsernameAndPassword(username: string, password: string): Observable<string>
  {
    return this.login('local', {username, password});
  }

  public login(strategic: string, credentials: ObjectWithAnyKeys): Observable<string>
  {
    return from(this.kuzzleService.kuzzle.auth.login(strategic, credentials));
  }
}
