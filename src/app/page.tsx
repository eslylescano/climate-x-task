"use client";

import { useState, useEffect } from "react";
import { Asset } from "@/types/asset";
import AssetTable from "@/components/AssetTable";
import AssetUploadForm from "@/components/AssetUploadForm";

export default function Home() {
  const [companyAssets, setCompanyAssets] = useState<Record<string, Asset[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/assets");
      if (response.ok) {
        const data = await response.json();
        setCompanyAssets(data);
      }
    } catch (error) {
      console.error("Failed to fetch assets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHasMounted(true);
    fetchAssets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Asset Management</h1>
          <p className="text-gray-600">View asset data</p>
        </header>

        <AssetUploadForm onUploadSuccess={fetchAssets} />

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {!hasMounted ||
          (Object.entries(companyAssets).length === 0 && !loading) ? (
            <div className="text-center py-8 text-gray-500">
              No assets found
            </div>
          ) : (
            Object.entries(companyAssets).map(
              ([companyId, assets], idx, arr) => (
                <div key={companyId}>
                  <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center gap-4">
                    <span className="font-semibold text-blue-700">
                      Company ID:
                    </span>
                    <span className="text-blue-900">{companyId}</span>
                    <span className="ml-4 text-sm text-gray-600">
                      {assets.length} asset{assets.length !== 1 ? "s" : ""}{" "}
                      found
                    </span>
                  </div>
                  <AssetTable assets={assets} isLoading={loading} />
                  {idx < arr.length - 1 && (
                    <div className="mx-6 my-2 border-t border-dashed border-blue-200" />
                  )}
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}
