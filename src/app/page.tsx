"use client";

import { useState, useEffect } from "react";
import { Asset } from "@/types/asset";
import AssetUploadForm from "@/components/AssetUploadForm";
import CompanyAssetsList from "@/components/CompanyAssetsList";
import CompanyFilterForm from "@/components/CompanyFilterForm";

export default function Home() {
  const [companyAssets, setCompanyAssets] = useState<Record<string, Asset[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [filterId, setFilterId] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  const fetchAssets = async (companyId?: string) => {
    try {
      setLoading(true);
      const url = companyId
        ? `/api/assets?companyId=${encodeURIComponent(companyId)}`
        : "/api/assets";
      const response = await fetch(url);
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

  // Handle editing companyId
  const handleCompanyIdEdit = async (
    oldCompanyId: string,
    newCompanyId: string
  ) => {
    setEditError(null);
    if (!newCompanyId.trim()) {
      setEditError("Company ID cannot be empty.");
      return;
    }
    if (oldCompanyId === newCompanyId) return;
    try {
      const response = await fetch("/api/assets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldCompanyId, newCompanyId }),
      });
      const result = await response.json();
      if (!response.ok) {
        setEditError(result.error || "Failed to update company ID");
      } else {
        setEditError(null);
        fetchAssets(filterId.trim() || undefined);
      }
    } catch (err) {
      setEditError("Failed to update company ID");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Asset Management</h1>
          <p className="text-gray-600">View asset data</p>
        </header>

        <AssetUploadForm
          onUploadSuccess={() => fetchAssets(filterId.trim() || undefined)}
        />

        <CompanyFilterForm
          filterId={filterId}
          setFilterId={setFilterId}
          onFilter={fetchAssets}
        />

        {editError && (
          <div className="text-red-600 text-sm mb-2">{editError}</div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <CompanyAssetsList
            companyAssets={companyAssets}
            loading={loading}
            hasMounted={hasMounted}
            onCompanyIdEdit={handleCompanyIdEdit}
          />
        </div>
      </div>
    </div>
  );
}
