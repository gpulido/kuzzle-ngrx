import { TestBed } from '@angular/core/testing';

import { KuzzleFilesService } from './kuzzle-files.service';

describe('KuzzleFilesService', () => {
  let service: KuzzleFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KuzzleFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
