import { useState } from "react";

interface AssetUploadFormProps {
  onUploadSuccess: () => void;
}

export default function AssetUploadForm({
  onUploadSuccess,
}: AssetUploadFormProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadError(null);
    setUploading(true);

    const form = e.currentTarget;
    const fileInput = form.assetFile as HTMLInputElement;
    const companyIdInput = form.companyId as HTMLInputElement;

    if (!fileInput.files?.[0] || !companyIdInput.value) {
      setUploadError("Please provide a company ID and select a file.");
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("companyId", companyIdInput.value);
    formData.append("assetFile", fileInput.files[0]);

    try {
      const response = await fetch("/api/assets/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        // Show backend error and help if provided
        const errorMsg = result.error || "Upload failed";
        const helpMsg = result.help ? `\n${result.help}` : "";
        setUploadError(errorMsg + helpMsg);
      } else {
        setUploadError(null);
        onUploadSuccess(); // <-- This triggers asset refresh in the parent
      }
    } catch (err) {
      setUploadError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      className="mb-8 bg-white shadow rounded-lg p-6 flex flex-col gap-4"
      onSubmit={handleUpload}
    >
      <div>
        <label
          htmlFor="companyId"
          className="block text-sm font-medium text-gray-700"
        >
          Company ID
        </label>
        <input
          id="companyId"
          name="companyId"
          type="text"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="assetFile"
          className="block text-sm font-medium text-gray-700"
        >
          Asset File (JSON or CSV)
        </label>
        <input
          id="assetFile"
          name="assetFile"
          type="file"
          accept=".json,.csv,application/json,text/csv"
          className="mt-1 block w-full"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {uploadError && (
        <div className="text-red-600 text-sm mt-2">{uploadError}</div>
      )}
    </form>
  );
}
