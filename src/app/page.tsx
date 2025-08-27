"use client";

import { useState, useEffect } from "react";
import { Asset } from "@/types/asset";
import AssetTable from "@/components/AssetTable";

export default function Home() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/assets");

      if (response.ok) {
        const data = await response.json();
        setAssets(data);
      }
    } catch (error) {
      console.error("Failed to fetch assets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Asset Management</h1>
          <p className="text-gray-600">View asset data</p>
        </header>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Assets</h2>
            <p className="text-sm text-gray-600">
              {assets.length} asset{assets.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <AssetTable assets={assets} isLoading={loading} />
        </div>
      </div>
    </div>
  );
}
