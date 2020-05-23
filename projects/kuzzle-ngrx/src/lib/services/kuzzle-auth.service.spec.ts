import { TestBed } from '@angular/core/testing';

import { KuzzleAuthService } from './kuzzle-auth.service';

describe('KuzzleAuthService', () => {
  let service: KuzzleAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KuzzleAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
