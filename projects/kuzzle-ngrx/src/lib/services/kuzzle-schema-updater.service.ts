import { Injectable } from '@angular/core';
import { KuzzleService } from './kuzzle.service';

@Injectable({
  providedIn: 'root'
})
export class KuzzleSchemaUpdaterService {
  constructor(private kuzzleService: KuzzleService) { }

  async updateSchemas(moduleMappings: any[]): Promise<void> {
    for (const moduleMapping of moduleMappings) {
      await this.updateMappingsForModule(moduleMapping)
    }
  }

  private updateMappingsForModule(moduleMapping: any): Promise<void>[] {
    const promises = [];

    for (const key in moduleMapping) {
      if (Object.prototype.hasOwnProperty.call(moduleMapping, key)) {
        const value = moduleMapping[key];
        promises.push(this.kuzzleService.updateOrCreateMapping(key, value));
      }
    }

    return promises;
  }
}

// describe('#updateMapping', () => {
//   let expectedHeroes: Hero[];
//   const heroesMapping: ObjectWithAnyKeys = {
//     name: 'text',
//   };
//   beforeEach(() => {
//     expectedHeroes = [
//       { id: '1', name: 'A' },
//       { id: '2', name: 'B' },
//     ] as Hero[];
//   });

//   it('should create collection if not exist', async () => {
//     kuzzleService.kuzzle.collection.exists.mockResolvedValue(
//       Promise.resolve(false)
//     );
//     await kuzzleDataService.updateOrCreateMapping(heroesMapping);
//     expect(kuzzleService.kuzzle.collection.create.mock.calls.length).toBe(1);
//     expect(
//       kuzzleService.kuzzle.collection.updateMapping.mock.calls.length
//     ).toBe(0);
//   });

//   it('should update collection mapping if exists', async () => {
//     kuzzleService.kuzzle.collection.exists.mockResolvedValue(
//       Promise.resolve(true)
//     );
//     await kuzzleDataService.updateOrCreateMapping(heroesMapping);
//     expect(kuzzleService.kuzzle.collection.create.mock.calls.length).toBe(0);
//     expect(
//       kuzzleService.kuzzle.collection.updateMapping.mock.calls.length
//     ).toBe(1);
//   });
// });
