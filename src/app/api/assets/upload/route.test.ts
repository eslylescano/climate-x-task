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

import { POST } from './route';
import { assetStorage } from '@/utils/storage';
import { Asset } from '@/types/asset';

// Mock NextResponse.json to return a Response-like object
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

// Simple mock FormData
function createMockFormData(entries: Record<string, unknown>) {
  return {
    get: (key: string) => entries[key],
  } as any;
}

// Reset storage before each test
beforeEach(() => {
  assetStorage.clear();
});

describe('POST /api/assets/upload', () => {
  it('returns 400 if companyId or file is missing', async () => {
    const mockRequest = { formData: async () => createMockFormData({}) } as any;
    const response = await POST(mockRequest);
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json.error).toBe('companyId and assetFile are required');
  });

  it('returns 400 for unsupported file type', async () => {
    const fakeFile = { name: 'test.txt', type: 'text/plain', text: async () => 'dummy' };
    const mockRequest = { formData: async () => createMockFormData({ companyId: '123', assetFile: fakeFile }) } as any;
    const response = await POST(mockRequest);
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json.error).toBe('Unsupported file type. Please upload JSON or CSV');
  });

  it('returns 400 for invalid JSON', async () => {
    const fakeFile = { name: 'data.json', type: 'application/json', text: async () => '{ invalid json }' };
    const mockRequest = { formData: async () => createMockFormData({ companyId: '123', assetFile: fakeFile }) } as any;
    const response = await POST(mockRequest);
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json.error).toBe('Invalid JSON format');
  });

  it('returns 400 for invalid asset structure in JSON', async () => {
    const invalidAssets = [{ address: '123 St', latitude: 'wrong', longitude: 0 }];
    const fakeFile = { name: 'data.json', type: 'application/json', text: async () => JSON.stringify(invalidAssets) };
    const mockRequest = { formData: async () => createMockFormData({ companyId: '123', assetFile: fakeFile }) } as any;
    const response = await POST(mockRequest);
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json.error).toBe('Invalid asset data structure');
  });

  it('returns 200 and stores assets for valid JSON', async () => {
    const validAssets: Asset[] = [
      { address: '123 St', latitude: 51.5, longitude: -0.1 },
      { address: '456 Ave', latitude: 40.7, longitude: -74.0 },
    ];
    const fakeFile = { name: 'assets.json', type: 'application/json', text: async () => JSON.stringify(validAssets) };
    const mockRequest = { formData: async () => createMockFormData({ companyId: 'companyA', assetFile: fakeFile }) } as any;
    const response = await POST(mockRequest);
    const json = await response.json();
    expect(response.status).toBe(200);
    expect(json.message).toBe('Assets uploaded successfully');
    expect(json.count).toBe(2);
    expect(assetStorage.getAssets('companyA')).toEqual(validAssets);
  });
});
