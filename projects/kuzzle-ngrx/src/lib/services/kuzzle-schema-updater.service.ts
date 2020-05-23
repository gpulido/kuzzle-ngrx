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
