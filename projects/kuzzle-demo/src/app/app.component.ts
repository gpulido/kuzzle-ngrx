import { Component } from '@angular/core';
import { KuzzleAuthService, KuzzleService } from 'kuzzle-ngrx';
import { Observable, from, of } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'kuzzle-demo';

  constructor(
    private kuzzleAuthService: KuzzleAuthService,
    private kuzzleService: KuzzleService
  ) {}

  subscribeToService(): void {
    // this.kuzzleAuthService.idToken$.subscribe((a) => console.log('idtoken', a));
    // this.kuzzleAuthService.user$.subscribe((a) => console.log('user', a));
    this.kuzzleAuthService.jwtExpiration$.subscribe((b) =>
      console.log('exporation', b)
    );
  }
  login(): void {
    this.kuzzleAuthService
      .login('local', {
        username: 'admin',
        password: 'CEzCcQ^$gvc9Wz!',
      })
      .subscribe((u) => console.log(u));
  }

  logout() {
    this.kuzzleAuthService.logout().subscribe(() => console.log('logout'));
  }
  test() {
           const d = new Date(1590593518322);
           console.log(d);
           // this.kuzzleService.checkToken().subscribe(
           //   (u) => console.log('checktoken', u),
           //   (e) => console.log('checktoken', 'error', e),
           //   () => console.log('checktoken', 'completed')
           // );

           this.kuzzleService
             .checkToken()
             .pipe(
               tap((t) => {
                 console.log('date', t);
                 const d = new Date(+t.expiresAt);
                 console.log(d);
               }),
               switchMap((t) =>
                 of(t).pipe(delay(new Date(t.expiresAt as number)))
               )
             )
             .subscribe(
               (u) => console.log('checktokenDelay', u),
               (e) => console.log('checktokenDelay', 'error', e),
               () => console.log('checktokenDelay', 'completed')
             );
           // this.kuzzleService
           //   .kuzzleEvent()
           //   .subscribe((e) => console.log('eventooo', e));
           //   this.kuzzleAuthService.jwtExpiration$.subscribe(
           //     (u) => console.log('jwtExpiration', u),
           //     (e) => console.log('jwtExpiration', 'error', e),
           //     () => console.log('jwtExpiration', 'completed')
           //   );
         }
}
