import { Asset } from '@/types/asset';
import fs from 'fs';
import path from 'path';

const STORAGE_PATH = path.resolve(process.cwd(), 'assets.json');

export class AssetStorage {
  private static instance: AssetStorage;
  private store: Map<string, Asset[]> = new Map();

  private constructor() {
    this.load();
  }

  static getInstance(): AssetStorage {
    if (!AssetStorage.instance) {
      AssetStorage.instance = new AssetStorage();
    }
    return AssetStorage.instance;
  }

  private load() {
    if (fs.existsSync(STORAGE_PATH)) {
      const data = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));
      // Ensure all values are arrays
      this.store = new Map(
        Object.entries(data).map(([k, v]) => [k, Array.isArray(v) ? v : []])
      );
    }
  }

  private save() {
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(Object.fromEntries(this.store)), 'utf-8');
  }

  setAssets(companyId: string, assets: Asset[], fileId?: string): void {
    const existing = this.store.get(companyId) || [];
    // Attach fileId to each new asset if provided
    const assetsWithFileId = assets.map(asset =>
      fileId ? { ...asset, fileId } : asset
    );
    // Avoid duplicates: merge by address+lat+lng
    const merged = [
      ...existing,
      ...assetsWithFileId.filter(
        (a) =>
          !existing.some(
            (e) =>
              e.address === a.address &&
              e.latitude === a.latitude &&
              e.longitude === a.longitude
          )
      ),
    ];
    this.store.set(companyId, merged);
    this.save();
  }

  getAssets(companyId?: string): Asset[] {
    if (companyId) {
      return this.store.get(companyId) || [];
    }
    const allAssets: Asset[] = [];
    this.store.forEach((assets) => {
      allAssets.push(...assets);
    });
    return allAssets;
  }

  clear(): void {
    this.store.clear();
    this.save();
  }
}

export const assetStorage = AssetStorage.getInstance();