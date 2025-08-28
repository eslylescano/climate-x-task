import AssetTable from "@/components/AssetTable";
import { Asset } from "@/types/asset";

interface CompanyAssetsListProps {
  companyAssets: Record<string, Asset[]>;
  loading: boolean;
  hasMounted: boolean;
}

export default function CompanyAssetsList({
  companyAssets,
  loading,
  hasMounted,
}: CompanyAssetsListProps) {
  if (!hasMounted || (Object.entries(companyAssets).length === 0 && !loading)) {
    return (
      <div className="text-center py-8 text-gray-500">
        No assets found
      </div>
    );
  }

  return (
    <>
      {Object.entries(companyAssets).map(([companyId, assets], idx, arr) => (
        <div key={companyId}>
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center gap-4">
            <span className="font-semibold text-blue-700">Company ID:</span>
            <span className="text-blue-900">{companyId}</span>
            <span className="ml-4 text-sm text-gray-600">
              {assets.length} asset{assets.length !== 1 ? "s" : ""} found
            </span>
          </div>
          <AssetTable assets={assets} isLoading={loading} />
          {idx < arr.length - 1 && (
            <div className="mx-6 my-2 border-t border-dashed border-blue-200" />
          )}
        </div>
      ))}
    </>
  );
}