import { assetStorage, AssetStorage } from './storage';
import { Asset } from '@/types/asset';

describe('AssetStorage', () => {
  const companyA = 'companyA';
  const companyB = 'companyB';

  const assetsA: Asset[] = [
    { address: '10 Downing St, London', latitude: 51.5034, longitude: -0.1276 },
  ];
  const assetsB: Asset[] = [
    { address: '1600 Pennsylvania Ave, Washington DC', latitude: 38.8977, longitude: -77.0365 },
  ];

  beforeEach(() => {
    assetStorage.clear();
  });

  it('returns the same instance (singleton)', () => {
    const instance1 = AssetStorage.getInstance();
    const instance2 = AssetStorage.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('sets and retrieves assets for a company', () => {
    assetStorage.setAssets(companyA, assetsA);
    const result = assetStorage.getAssets(companyA);
    expect(result).toEqual(assetsA);
  });

  it('returns an empty array for unknown company', () => {
    const result = assetStorage.getAssets('nonexistent');
    expect(result).toEqual([]);
  });

  it('returns all assets when no companyId is given', () => {
    assetStorage.setAssets(companyA, assetsA);
    assetStorage.setAssets(companyB, assetsB);
    const allAssets = assetStorage.getAssets();
    expect(allAssets).toEqual([...assetsA, ...assetsB]);
  });

  it('clears all assets', () => {
    assetStorage.setAssets(companyA, assetsA);
    assetStorage.clear();
    expect(assetStorage.getAssets(companyA)).toEqual([]);
  });
});
