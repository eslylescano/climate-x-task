(global as any).Request = class {
  constructor(url: string, options?: any) {
    this.url = url;
    this.method = options?.method || "GET";
    this.headers = options?.headers || {};
    this.body = options?.body;
  }
  url: string;
  method: string;
  headers: any;
  body: any;
};

import { GET } from './route';
import { NextRequest } from 'next/server';
import { assetStorage } from '@/utils/storage';


// Helper to create a mock URL request
function createMockRequest(url: string) {
  return { url } as unknown as NextRequest;
}

// Reset storage before each test
beforeEach(() => {
  assetStorage.clear();
});

describe('GET /api/assets', () => {

  it('returns all assets if no companyId is provided', async () => {
    // Set up some assets
    assetStorage.setAssets('companyA', [
      { address: '123 St', latitude: 51.5, longitude: -0.1 }
    ]);
    assetStorage.setAssets('companyB', [
      { address: '456 Ave', latitude: 40.7, longitude: -74 }
    ]);

    const req = createMockRequest('http://localhost/api/assets');
    const response = await GET(req);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual([
      { address: '123 St', latitude: 51.5, longitude: -0.1 },
      { address: '456 Ave', latitude: 40.7, longitude: -74 }
    ]);
  });

  it('returns only assets for a specific companyId', async () => {
    assetStorage.setAssets('companyA', [
      { address: '123 St', latitude: 51.5, longitude: -0.1 }
    ]);
    assetStorage.setAssets('companyB', [
      { address: '456 Ave', latitude: 40.7, longitude: -74 }
    ]);

    const req = createMockRequest('http://localhost/api/assets?companyId=companyA');
    const response = await GET(req);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual([
      { address: '123 St', latitude: 51.5, longitude: -0.1 }
    ]);
  });

  it('returns empty array if no assets exist', async () => {
    const req = createMockRequest('http://localhost/api/assets');
    const response = await GET(req);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual([]);
  });

  it('returns 500 if an exception occurs', async () => {
    const badReq = { url: null } as unknown as NextRequest;
    const response = await GET(badReq);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error).toBe('Failed to fetch assets');
  });

});
