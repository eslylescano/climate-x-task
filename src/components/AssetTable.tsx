"use client";

import { useState } from "react";
import { Asset } from "@/types/asset";

interface AssetTableProps {
  assets: Asset[];
  isLoading: boolean;
  companyId: string;
  onAssetEdit: (
    companyId: string,
    index: number,
    updated: Partial<Asset>
  ) => Promise<void>;
  onAssetDelete: (companyId: string, index: number) => Promise<void>;
}

export default function AssetTable({
  assets,
  isLoading,
  companyId,
  onAssetEdit,
  onAssetDelete,
}: AssetTableProps) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<Asset>>({});

  if (isLoading) {
    return <div className="px-6 py-4 text-gray-500">Loading...</div>;
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-100">
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
          <th className="px-6 py-3"></th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {assets.map((asset, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingIdx === idx ? (
                <input
                  className="border px-2 py-1 rounded w-full"
                  value={editValues.address ?? asset.address}
                  onChange={(e) =>
                    setEditValues((v) => ({ ...v, address: e.target.value }))
                  }
                />
              ) : (
                <span
                  className="cursor-pointer underline"
                  title="Click to edit"
                  onClick={() => {
                    setEditingIdx(idx);
                    setEditValues({
                      address: asset.address,
                      latitude: asset.latitude,
                      longitude: asset.longitude,
                    });
                  }}
                >
                  {asset.address}
                </span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingIdx === idx ? (
                <input
                  className="border px-2 py-1 rounded w-full"
                  type="number"
                  value={editValues.latitude ?? asset.latitude}
                  onChange={(e) =>
                    setEditValues((v) => ({
                      ...v,
                      latitude: parseFloat(e.target.value),
                    }))
                  }
                />
              ) : (
                <span
                  className="cursor-pointer underline"
                  title="Click to edit"
                  onClick={() => {
                    setEditingIdx(idx);
                    setEditValues({
                      address: asset.address,
                      latitude: asset.latitude,
                      longitude: asset.longitude,
                    });
                  }}
                >
                  {asset.latitude}
                </span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingIdx === idx ? (
                <input
                  className="border px-2 py-1 rounded w-full"
                  type="number"
                  value={editValues.longitude ?? asset.longitude}
                  onChange={(e) =>
                    setEditValues((v) => ({
                      ...v,
                      longitude: parseFloat(e.target.value),
                    }))
                  }
                />
              ) : (
                <span
                  className="cursor-pointer underline"
                  title="Click to edit"
                  onClick={() => {
                    setEditingIdx(idx);
                    setEditValues({
                      address: asset.address,
                      latitude: asset.latitude,
                      longitude: asset.longitude,
                    });
                  }}
                >
                  {asset.longitude}
                </span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              {editingIdx === idx ? (
                <>
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded mr-2"
                    onClick={async () => {
                      await onAssetEdit(companyId, idx, editValues);
                      setEditingIdx(null);
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="text-gray-600 underline"
                    onClick={() => setEditingIdx(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="text-red-600 underline ml-2"
                  title="Delete asset"
                  onClick={() => onAssetDelete(companyId, idx)}
                >
                  Delete
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
