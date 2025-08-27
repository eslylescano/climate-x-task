import { POST } from './route';
import { NextRequest } from 'next/server';

// Helper to mock FormData
function createMockFormData(entries: Record<string, any>) {
  return {
    get: (key: string) => entries[key],
  } as unknown as FormData;
}

describe('POST /api/assets/upload', () => {
  it('returns 400 if companyId or file is missing', async () => {
    const mockRequest = {
      formData: async () => createMockFormData({}),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe('companyId and assetFile are required');
  });

  it('returns 400 for unsupported file type', async () => {
    const fakeFile = new File(['dummy'], 'test.txt', { type: 'text/plain' });

    const mockRequest = {
      formData: async () =>
        createMockFormData({
          companyId: '123',
          assetFile: fakeFile,
        }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe('Unsupported file type. Please upload JSON or CSV');
  });

  it('returns 200 for valid CSV file', async () => {
    const fakeFile = new File(['name,age\nJohn,30'], 'data.csv', { type: 'text/csv' });

    const mockRequest = {
      formData: async () =>
        createMockFormData({
          companyId: '456',
          assetFile: fakeFile,
        }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.message).toBe('File validation passed');
    expect(json.companyId).toBe('456');
    expect(json.fileName).toBe('data.csv');
    expect(json.fileType).toBe('text/csv');
  });

  it('returns 200 for valid JSON file', async () => {
    const fakeFile = new File([JSON.stringify({ foo: 'bar' })], 'data.json', { type: 'application/json' });

    const mockRequest = {
      formData: async () =>
        createMockFormData({
          companyId: '789',
          assetFile: fakeFile,
        }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.message).toBe('File validation passed');
    expect(json.companyId).toBe('789');
    expect(json.fileName).toBe('data.json');
    expect(json.fileType).toBe('application/json');
  });

  it('returns 500 if an exception occurs', async () => {
    const mockRequest = {
      formData: async () => { throw new Error('boom'); },
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error).toBe('Internal server error');
  });
});
