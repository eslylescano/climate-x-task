import { assetStorage } from '@/utils/storage';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get('companyId');

  if (companyId) {
    const assets = assetStorage.getAssets(companyId);
    return NextResponse.json({ [companyId]: assets });
  } else {
    const all = Object.fromEntries(assetStorage['store']);
    return NextResponse.json(all);
  }
}

// PUT: Edit companyId or update an asset's fields
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Change companyId
    if (body.oldCompanyId && body.newCompanyId) {
      const all = Object.fromEntries(assetStorage['store']);
      if (!all[body.oldCompanyId]) {
        return NextResponse.json(
          { error: `Company ID "${body.oldCompanyId}" does not exist` },
          { status: 404 }
        );
      }
      if (all[body.newCompanyId]) {
        return NextResponse.json(
          { error: `Company ID "${body.newCompanyId}" already exists` },
          { status: 409 }
        );
      }
      assetStorage['store'].set(body.newCompanyId, assetStorage['store'].get(body.oldCompanyId)!);
      assetStorage['store'].delete(body.oldCompanyId);
      assetStorage['save']();
      return NextResponse.json({ message: "Company ID updated successfully" });
    }

    // Change asset fields (address, latitude, longitude)
    if (
      body.companyId &&
      typeof body.index === "number" &&
      (body.address !== undefined || body.latitude !== undefined || body.longitude !== undefined)
    ) {
      const assets = assetStorage.getAssets(body.companyId);
      if (!assets[body.index]) {
        return NextResponse.json(
          { error: "Asset not found at given index" },
          { status: 404 }
        );
      }
      if (body.address !== undefined) assets[body.index].address = body.address;
      if (body.latitude !== undefined) assets[body.index].latitude = body.latitude;
      if (body.longitude !== undefined) assets[body.index].longitude = body.longitude;
      assetStorage.setAssets(body.companyId, assets);
      return NextResponse.json({ message: "Asset updated successfully" });
    }

    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}

// DELETE: Remove an asset or an entire company
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    // Delete an entire company
    if (body.companyId && body.index === undefined) {
      if (!assetStorage['store'].has(body.companyId)) {
        return NextResponse.json(
          { error: `Company ID "${body.companyId}" does not exist` },
          { status: 404 }
        );
      }
      assetStorage['store'].delete(body.companyId);
      assetStorage['save']();
      return NextResponse.json({ message: "Company deleted successfully" });
    }

    // Delete an individual asset
    if (body.companyId && typeof body.index === "number") {
      const assets = assetStorage.getAssets(body.companyId);
      if (!assets[body.index]) {
        return NextResponse.json(
          { error: "Asset not found at given index" },
          { status: 404 }
        );
      }
      assets.splice(body.index, 1);
      assetStorage.setAssets(body.companyId, assets);
      return NextResponse.json({ message: "Asset deleted successfully" });
    }

    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete" },
      { status: 500 }
    );
  }
}