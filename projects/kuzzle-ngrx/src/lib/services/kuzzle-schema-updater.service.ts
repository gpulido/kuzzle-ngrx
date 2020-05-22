import { Injectable } from '@angular/core';
import { KuzzleService } from './kuzzle.service';

@Injectable({
  providedIn: 'root'
})
export class KuzzleSchemaUpdaterService {
  constructor(private kuzzleService: KuzzleService) {}

  updateSchemas(moduleMappings: any[]): void {
    moduleMappings.forEach(m => this.updateMappingsForModule(m));
  }

  private updateMappingsForModule(moduleMapping: any): void {
    for (const key in moduleMapping) {
      if (Object.prototype.hasOwnProperty.call(moduleMapping, key)) {
        const value = moduleMapping[key];
        this.kuzzleService.updateOrCreateMapping(key, value);
      }
    }
  }
}
