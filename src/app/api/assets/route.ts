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