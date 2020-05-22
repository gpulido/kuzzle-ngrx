import { TestBed } from '@angular/core/testing';

import { KuzzleDataService } from './kuzzle-data.service';

describe('KuzzleDataService', () => {
  let service: KuzzleDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KuzzleDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
