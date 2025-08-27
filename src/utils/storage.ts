import { Asset } from '@/types/asset';

export class AssetStorage {
  private static instance: AssetStorage;
  private store: Map<string, Asset[]> = new Map();

  private constructor() {}

  static getInstance(): AssetStorage {
    if (!AssetStorage.instance) {
      AssetStorage.instance = new AssetStorage();
    }
    return AssetStorage.instance;
  }

  setAssets(companyId: string, assets: Asset[]): void {
    this.store.set(companyId, assets);
  }

  getAssets(companyId?: string): Asset[] {
    if (companyId) {
      return this.store.get(companyId) || [];
    }
    
    const allAssets: Asset[] = [];
    this.store.forEach(assets => {
      allAssets.push(...assets);
    });
    return allAssets;
  }

  clear(): void {
    this.store.clear();
  }
}

export const assetStorage = AssetStorage.getInstance();