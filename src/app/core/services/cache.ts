import { Injectable } from '@angular/core';
import Dexie from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class Cache extends Dexie {
  private apiCache: Dexie.Table<{ url: string, data: any, timestamp: number }, string>;

  constructor() {
    super('ApiCacheDatabase');
    this.version(1).stores({
      apiCache: 'url' 
    });
    this.apiCache = this.table('apiCache');
  }

  async put(url: string, data: any): Promise<void> {
    await this.apiCache.put({ url, data, timestamp: Date.now() });
  }

  async get(url: string): Promise<any | undefined> {
    const entry = await this.apiCache.get(url);
    if (entry && this.isCacheValid(entry.timestamp)) {
      return entry.data;
    }
    return undefined;
  }

  private isCacheValid(timestamp: number): boolean {
    //const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
    const oneHourInMs = 3_600_000;
    return (Date.now() - timestamp) < oneHourInMs;
  }
}
