import { useState } from "react";
import AssetTable from "@/components/AssetTable";
import { Asset } from "@/types/asset";

interface CompanyAssetsListProps {
  companyAssets: Record<string, Asset[]>;
  loading: boolean;
  hasMounted: boolean;
  onCompanyIdEdit: (
    oldCompanyId: string,
    newCompanyId: string
  ) => Promise<void>;
  onAssetEdit: (
    companyId: string,
    index: number,
    updated: Partial<Asset>
  ) => Promise<void>;
}

export default function CompanyAssetsList({
  companyAssets,
  loading,
  hasMounted,
  onCompanyIdEdit,
  onAssetEdit,
}: CompanyAssetsListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  if (!hasMounted || (Object.entries(companyAssets).length === 0 && !loading)) {
    return (
      <div className="text-center py-8 text-gray-500">No assets found</div>
    );
  }

  return (
    <>
      {Object.entries(companyAssets).map(([companyId, assets], idx, arr) => (
        <div key={companyId}>
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center gap-4">
            <span className="font-semibold text-blue-700">Company ID:</span>
            {editingId === companyId ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (editValue && editValue !== companyId) {
                    await onCompanyIdEdit(companyId, editValue);
                  }
                  setEditingId(null);
                }}
                className="flex items-center gap-2"
              >
                <input
                  className="border px-2 py-1 rounded"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="text-gray-600 underline"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <span
                className="text-blue-900 cursor-pointer underline"
                title="Click to edit"
                onClick={() => {
                  setEditingId(companyId);
                  setEditValue(companyId);
                }}
              >
                {companyId}
              </span>
            )}
            <span className="ml-4 text-sm text-gray-600">
              {assets.length} asset{assets.length !== 1 ? "s" : ""} found
            </span>
          </div>
          <AssetTable
            assets={assets}
            isLoading={loading}
            companyId={companyId}
            onAssetEdit={onAssetEdit}
          />
          {idx < arr.length - 1 && (
            <div className="mx-6 my-2 border-t border-dashed border-blue-200" />
          )}
        </div>
      ))}
    </>
  );
}
