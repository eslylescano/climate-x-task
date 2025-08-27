import { POST } from './route';
import { NextRequest } from 'next/server';
import { assetStorage } from '@/utils/storage';
import { Asset } from '@/types/asset';

// Helper to create mock FormData
function createMockFormData(entries: Record<string, unknown>) {
  return {
    get: (key: string) => entries[key],
  } as unknown as FormData;
}

// Reset storage before each test
beforeEach(() => {
  assetStorage.clear();
});

describe('POST /api/assets/upload', () => {

  it('returns 400 if companyId or file is missing', async () => {
    const mockRequest = { formData: async () => createMockFormData({}) } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe('companyId and assetFile are required');
  });

  it('returns 400 for unsupported file type', async () => {
    const fakeFile = new File(['dummy'], 'test.txt', { type: 'text/plain' });

    const mockRequest = {
      formData: async () => createMockFormData({ companyId: '123', assetFile: fakeFile })
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe('Unsupported file type. Please upload JSON or CSV');
  });

  it('returns 400 for invalid JSON', async () => {
    const fakeFile = new File(['{ invalid json }'], 'data.json', { type: 'application/json' });

    const mockRequest = {
      formData: async () => createMockFormData({ companyId: '123', assetFile: fakeFile })
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe('Invalid JSON format');
  });

  it('returns 400 for invalid asset structure', async () => {
    const invalidAssets = [{ address: '123 St', latitude: 'wrong', longitude: 0 }];
    const fakeFile = new File([JSON.stringify(invalidAssets)], 'data.json', { type: 'application/json' });

    const mockRequest = {
      formData: async () => createMockFormData({ companyId: '123', assetFile: fakeFile })
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe('Invalid asset data structure');
  });

  it('returns 200 and stores assets for valid JSON', async () => {
    const validAssets: Asset[] = [
      { address: '123 St', latitude: 51.5, longitude: -0.1 },
      { address: '456 Ave', latitude: 40.7, longitude: -74.0 }
    ];
    const fakeFile = new File([JSON.stringify(validAssets)], 'assets.json', { type: 'application/json' });

    const mockRequest = {
      formData: async () => createMockFormData({ companyId: 'companyA', assetFile: fakeFile })
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.message).toBe('Assets uploaded successfully');
    expect(json.count).toBe(2);

    // Confirm assets are stored
    const storedAssets = assetStorage.getAssets('companyA');
    expect(storedAssets).toEqual(validAssets);
  });

  it('returns 500 if an exception occurs', async () => {
    const mockRequest = { formData: async () => { throw new Error('boom'); } } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error).toBe('Internal server error');
  });
});
