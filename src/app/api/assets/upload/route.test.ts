import { POST } from "./route";
import { NextRequest } from "next/server";


function createMockFormData(entries: Record<string, unknown>) {
  return {
    get: (key: string) => entries[key],
  } as unknown as FormData;
}

describe("POST /api/assets/upload", () => {
  it("should return 400 if companyId or file is missing", async () => {
    const mockRequest = {
      formData: async () => createMockFormData({}),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe("companyId and assetFile are required");
  });

  it("should return 200 with correct data when companyId and file are provided", async () => {
    const fakeFile = new File(["dummy"], "test.csv", { type: "text/csv" });

    const mockRequest = {
      formData: async () =>
        createMockFormData({
          companyId: "123",
          assetFile: fakeFile,
        }),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.message).toBe("File received");
    expect(json.companyId).toBe("123");
    expect(json.fileName).toBe("test.csv");
  });

  it("should return 500 if an exception occurs", async () => {
    const mockRequest = {
      formData: async () => {
        throw new Error("boom");
      },
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error).toBe("Internal server error");
  });
});
