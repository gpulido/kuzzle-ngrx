
import { Update } from '@ngrx/entity';
import { createSpyObj } from 'jest-createspyobj';
import { ObjectWithAnyKeys } from 'kuzzle-sdk';
import { KuzzleDataService, IdModel } from './kuzzle-data.service';

class Hero implements IdModel {
  id: string;
  name: string;
  version?: number;
}

describe('KuzzleDataService', () => {
  let kuzzleDataService: KuzzleDataService<Hero>;
  let kuzzleService: any;
  let kuzzleServiceConfig: any;
  const kuzzleHeroes = {
    hits: [
      {
        _id: '1',
        _source: {
          name: 'A',
        },
      },
      {
        _id: '2',
        _source: {
          name: 'B',
        },
      },
    ],
  };
  const emptyHeroes = {
    hits: [],
  };

  beforeEach(() => {
    kuzzleServiceConfig = createSpyObj('kuzzleConfig', ['index']);
    kuzzleServiceConfig.index.mockResolvedValue('heroes');

    kuzzleService.kuzzle = {
      document: createSpyObj('document', [
        'search',
        'get',
        'create',
        'delete',
        'update',
        'createOrReplace',
      ]),
      collection: createSpyObj('collection', [
        'exists',
        'create',
        'updateMapping',
      ]),
    };
    kuzzleDataService = new KuzzleDataService<Hero>(
      'Hero',
      kuzzleService
    );
  });

  describe('#getAll', () => {
    let expectedHeroes: Hero[];

    beforeEach(() => {
      expectedHeroes = [
        { id: '1', name: 'A' },
        { id: '2', name: 'B' },
      ] as Hero[];
    });

    it('should return expected heroes (called once)', (done: DoneFn) => {
      kuzzleService.kuzzle.document.search.mockResolvedValue(
        Promise.resolve(kuzzleHeroes)
      );
      kuzzleDataService.getAll().subscribe((heroes) => {
        expect(kuzzleService.kuzzle.document.search).toHaveBeenCalledTimes(1);
        expect(heroes).toEqual(expectedHeroes, 'should return expected heroes');
        done();
      }, fail);
    });

    it('should be OK returning no heroes', (done: DoneFn) => {
      kuzzleService.kuzzle.document.search.mockResolvedValue(
        Promise.resolve(emptyHeroes)
      );
      kuzzleDataService.getAll().subscribe((heroes) => {
        expect(heroes.length).toEqual(0, 'should have empty heroes array');
        done();
      }, fail);
    });
  });

  describe('#getById', () => {
    let expectedHero: Hero;

    it('should return expected hero when id is found', (done: DoneFn) => {
      kuzzleService.kuzzle.document.get.mockResolvedValue(
        Promise.resolve(kuzzleHeroes.hits[0])
      );
      expectedHero = { id: '1', name: 'A' };

      kuzzleDataService.getById('1').subscribe((hero) => {
        expect(hero).toEqual(expectedHero, 'should return expected hero');
        done();
      }, fail);
    });

    it('should turn 404 when id not found', (done: DoneFn) => {
      // TODO: review
      const error = {
        status: 404,
        error: {
          code: 16842763,
          id: 'services.storage.not_found',
          message: 'Document "10" not found.',
          status: 404,
        },
      };
      kuzzleService.kuzzle.document.get.mockResolvedValue(
        Promise.reject(error)
      );
      kuzzleDataService.getById('10').subscribe(
        (heroes) => fail('getById succeeded when expected it to fail'),
        (err) => {
          // expect(err.error instanceof KuzzleError).toBe(true);
          expect(err.error.message).toMatch('Document "10" not found');
          done();
        }
      );
    });

    // it('should throw when no id given', () => {
    //   kuzzle.document.get.and.returnValue(Promise.resolve(kuzzleHeroes.hits[0]));
    //   kuzzleDataService
    //     .getById(undefined as any)
    //     .subscribe(
    //     heroes => fail('getById succeeded when expected it to fail'),
    //     err => {
    //       expect(err.error).toMatch("Document /No "Hero" key/);
    //     }
    //   );
    // });
  });

  describe('#add', () => {
    let expectedHero: any;

    it('should return expected hero with id', (done: DoneFn) => {
      const expectedHeroData = {
        _id: '42',
        _source: {
          name: 'A',
        },
      };
      expectedHero = { id: '42', name: 'A' };
      const heroData: Hero = { id: undefined, name: 'A' } as any;

      kuzzleService.kuzzle.document.create.mockResolvedValue(
        Promise.resolve(expectedHeroData)
      );
      kuzzleDataService.add(heroData).subscribe((hero) => {
        expect(hero).toEqual(expectedHero, 'should return expected hero');
        done();
      }, fail);
    });

    it('should throw when no entity given', (done: DoneFn) => {
      const error = {
        status: 400,
        error: {
          message: 'The request must specify a body.',
          status: 400,
          id: 'api.assert.body_required',
          code: 33619976,
        },
      };
      kuzzleService.kuzzle.document.create.mockResolvedValue(
        Promise.reject(error)
      );
      kuzzleDataService.add(undefined as any).subscribe(
        (heroes) => fail('add succeeded when expected it to fail'),
        (err) => {
          expect(err.error.message).toMatch('The request must specify a body.');
          done();
        },
        fail
      );
    });

    it('should throw when the document already exist', (done: DoneFn) => {
      const error = {
        status: 400,
        error: {
          code: 16842769,
          id: 'services.storage.document_already_exists',
          message: 'Document already exists.',
          status: 400,
        },
      };
      const heroData: Hero = { id: '42', name: 'A' } as any;
      kuzzleService.kuzzle.document.create.mockResolvedValue(
        Promise.reject(error)
      );
      kuzzleDataService.add(heroData).subscribe(
        (hero) => fail('add succeeded adding an already existing element'),
        (err) => {
          expect(err.error.message).toMatch('Document already exists.');
          done();
        },
        fail
      );
    });
  });

  describe('#delete', () => {
    it('should delete by hero id', (done: DoneFn) => {
      kuzzleService.kuzzle.document.delete.mockResolvedValue(
        Promise.resolve('1')
      );
      kuzzleDataService.delete('1').subscribe((result) => {
        expect(result).toEqual('1', 'should return the deleted entity id');
        done();
      }, fail);
    });

    it('should return 404 when id not found ', (done: DoneFn) => {
      const error = {
        status: 404,
        error: {
          message: 'Document "68" not found.',
          status: 404,
          id: 'services.storage.not_found',
          code: 16842763,
        },
      };
      kuzzleService.kuzzle.document.delete.mockResolvedValue(
        Promise.reject(error)
      );
      kuzzleDataService.delete('68').subscribe(
        (heroes) =>
          fail('delete succeeded when expected it to fail with a 404'),
        (err) => {
          expect(err.error.message).toMatch('Document "68" not found.');
          done();
        },
        fail
      );
    });
    // it('should throw when no id given', () => {
    //   service.delete(undefined as any).subscribe(
    //     heroes => fail('delete succeeded when expected it to fail'),
    //     err => {
    //       expect(err.error).toMatch(/No "Hero" key/);
    //     }
    //   );
    // });
    // });
  });

  xdescribe('#update', () => {
    it('should return expected hero with id', (done: DoneFn) => {
      // Call service.update with an Update<T> arg
      const updateArg: Update<Hero> = {
        id: '1',
        changes: { id: '1', name: 'B' },
      };
      const expectedUpdatedHeroData = {
        _id: '1',
        _source: {
          name: 'B',
        },
        _version: 2,
      };

      // The server makes the update AND updates the version concurrency property.
      const expectedHero: Hero = { id: '1', name: 'B', version: 2 };
      kuzzleService.kuzzle.document.update.mockResolvedValue(
        Promise.resolve(expectedUpdatedHeroData)
      );
      kuzzleDataService.update(updateArg).subscribe((updated) => {
        expect(updated).toEqual(
          expectedHero,
          'should return the expected hero'
        );
        done();
      }, fail);
    });

    // it('should return 404 when id not found', () => {
    //   service.update({ id: 1, changes: { id: 1, name: 'B' } }).subscribe(
    //     update => fail('update succeeded when expected it to fail with a 404'),
    //     err => {
    //       expect(err instanceof DataServiceError).toBe(true);
    //     }
    //   );

    //   const req = httpTestingController.expectOne(heroUrlId1);
    //   const errorEvent = { message: 'boom!' } as ErrorEvent;
    //   req.error(errorEvent, { status: 404, statusText: 'Not Found' });
    // });

    // it('should throw when no update given', () => {
    //   service.update(undefined as any).subscribe(
    //     heroes => fail('update succeeded when expected it to fail'),
    //     err => {
    //       expect(err.error).toMatch(/No "Hero" update data/);
    //     }
    //   );
    // });
  });

  describe('#upsert', () => {
    let expectedHero: Hero;

    it('should return expected hero with id', (done: DoneFn) => {
      const expectedHeroData = {
        _id: '42',
        _source: {
          name: 'A',
        },
      };
      expectedHero = { id: '42', name: 'A' };
      const heroData: Hero = { id: undefined, name: 'A' } as any;

      kuzzleService.kuzzle.document.createOrReplace.mockResolvedValue(
        Promise.resolve(expectedHeroData)
      );

      kuzzleDataService.upsert(heroData).subscribe((hero) => {
        expect(hero).toEqual(expectedHero, 'should return expected hero');
        done();
      }, fail);
    });

    it('should return updated hero when it exists', (done: DoneFn) => {
      const expectedHeroData = {
        _id: '42',
        _source: {
          name: 'A',
        },
      };
      expectedHero = { id: '42', name: 'A' };
      const heroData: Hero = { id: '42', name: 'A' } as any;

      kuzzleService.kuzzle.document.createOrReplace.mockResolvedValue(
        Promise.resolve(expectedHeroData)
      );

      kuzzleDataService.upsert(heroData).subscribe((hero) => {
        expect(hero).toEqual(expectedHero, 'should return expected hero');
        done();
      }, fail);
    });

    it('should throw when no entity given', (done: DoneFn) => {
      const error = {
        status: 400,
        error: {
          message: 'The request must specify a body.',
          status: 400,
          id: 'api.assert.body_required',
          code: 33619976,
        },
      };
      kuzzleService.kuzzle.document.createOrReplace.mockResolvedValue(
        Promise.reject(error)
      );
      kuzzleDataService.upsert(undefined as any).subscribe(
        (heroes) => fail('add succeeded when expected it to fail'),
        (err) => {
          expect(err.error.message).toMatch('The request must specify a body.');
          done();
        },
        fail
      );
    });
  });

});
