"use client";

import { Asset } from "@/types/asset";

interface AssetTableProps {
  assets: Asset[];
  isLoading?: boolean;
}

export default function AssetTable({ assets, isLoading }: AssetTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Latitude
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Longitude
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {assets.map((asset, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {asset.address}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {asset.latitude}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {asset.longitude}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {assets.length === 0 && (
        <div className="text-center py-8 text-gray-500">No assets found</div>
      )}
    </div>
  );
}
