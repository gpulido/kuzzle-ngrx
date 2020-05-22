import { TestBed } from '@angular/core/testing';

import { KuzzleService } from './kuzzle.service';

describe('KuzzleService', () => {
  let service: KuzzleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KuzzleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
