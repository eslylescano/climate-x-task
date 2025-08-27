import { POST } from './route';
import { NextRequest } from 'next/server';
import { assetStorage } from '@/utils/storage';
import { Asset } from '@/types/asset';

// Helper to create mock FormData
function createMockFormData(entries: Record<string, any>) {
  return {
    get: (key: string) => entries[key],
  } as unknown as FormData;
}

// Reset storage before each test
beforeEach(() => {
  assetStorage.clear();
});

describe('POST /api/assets/upload', () => {

  // --- JSON tests ---

  it('returns 400 if companyId or file is missing', async () => {
    const mockRequest = { formData: async () => createMockFormData({}) } as unknown as NextRequest;
    const response = await POST(mockRequest);
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json.error).toBe('companyId and assetFile are required');
  });

  it('returns 400 for unsupported file type', async () => {
    const fakeFile = new File(['dummy'], 'test.txt', { type: 'text/plain' });
    const mockRequest = { formData: async () => createMockFormData({ companyId: '123', assetFile: fakeFile }) } as unknown as NextRequest;
    const response = await POST(mockRequest);
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json.error).toBe('Unsupported file type. Please upload JSON or CSV');
  });

  it('returns 400 for invalid JSON', async () => {
    const fakeFile = new File(['{ invalid json }'], 'data.json', { type: 'application/json' });
    const mockRequest = { formData: async () => createMockFormData({ companyId: '123', assetFile: fakeFile }) } as unknown as NextRequest;
    const response = await POST(mockRequest);
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json.error).toBe('Invalid JSON format');
  });

  it('returns 400 for invalid asset structure in JSON', async () => {
    const invalidAssets = [{ address: '123 St', latitude: 'wrong', longitude: 0 }];
    const fakeFile = new File([JSON.stringify(invalidAssets)], 'data.json', { type: 'application/json' });
    const mockRequest = { formData: async () => createMockFormData({ companyId: '123', assetFile: fakeFile }) } as unknown as NextRequest;
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
    const mockRequest = { formData: async () => createMockFormData({ companyId: 'companyA', assetFile: fakeFile }) } as unknown as NextRequest;
    const response = await POST(mockRequest);
    const json = await response.json();
    expect(response.status).toBe(200);
    expect(json.message).toBe('Assets uploaded successfully');
    expect(json.count).toBe(2);
    const storedAssets = assetStorage.getAssets('companyA');
    expect(storedAssets).toEqual(validAssets);
  });

  // --- CSV tests ---

  it('returns 400 if CSV has missing header or data row', async () => {
    const csvFile = new File(['address,latitude,longitude'], 'assets.csv', { type: 'text/csv' });
    const mockRequest = { formData: async () => createMockFormData({ companyId: 'csv1', assetFile: csvFile }) } as unknown as NextRequest;
    const response = await POST(mockRequest);
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json.error).toBe('CSV file must contain header and at least one data row');
  });

  it('returns 400 if CSV headers are invalid', async () => {
    const csvFile = new File(['foo,bar,baz\n1,2,3'], 'assets.csv', { type: 'text/csv' });
    const mockRequest = { formData: async () => createMockFormData({ companyId: 'csv2', assetFile: csvFile }) } as unknown as NextRequest;
    const response = await POST(mockRequest);
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json.error).toBe('CSV must contain address, latitude, and longitude columns');
  });

  it('returns 400 if CSV numeric values are invalid', async () => {
    const csvFile = new File(['address,latitude,longitude\n123 St,notanumber,50'], 'assets.csv', { type: 'text/csv' });
    const mockRequest = { formData: async () => createMockFormData({ companyId: 'csv3', assetFile: csvFile }) } as unknown as NextRequest;
    const response = await POST(mockRequest);
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json.error).toBe('Invalid numeric values in CSV');
  });

  it('returns 200 and stores assets for valid CSV', async () => {
    const csvContent = 'address,latitude,longitude\n123 St,51.5,-0.1\n456 Ave,40.7,-74';
    const csvFile = new File([csvContent], 'assets.csv', { type: 'text/csv' });
    const mockRequest = { formData: async () => createMockFormData({ companyId: 'csvValid', assetFile: csvFile }) } as unknown as NextRequest;
    const response = await POST(mockRequest);
    const json = await response.json();
    expect(response.status).toBe(200);
    expect(json.message).toBe('Assets uploaded successfully');
    expect(json.count).toBe(2);

    const storedAssets = assetStorage.getAssets('csvValid');
    expect(storedAssets).toEqual([
      { address: '123 St', latitude: 51.5, longitude: -0.1 },
      { address: '456 Ave', latitude: 40.7, longitude: -74 }
    ]);
  });

  it('returns 500 if an exception occurs', async () => {
    const mockRequest = { formData: async () => { throw new Error('boom'); } } as unknown as NextRequest;
    const response = await POST(mockRequest);
    const json = await response.json();
    expect(response.status).toBe(500);
    expect(json.error).toBe('Internal server error');
  });

});
