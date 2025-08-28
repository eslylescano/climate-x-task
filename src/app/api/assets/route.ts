import { assetStorage } from '@/utils/storage';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get('companyId');

  if (companyId) {
    // Return only the assets for the requested companyId
    const assets = assetStorage.getAssets(companyId);
    return NextResponse.json({ [companyId]: assets });
  } else {
    // Return all companies and their assets
    const all = Object.fromEntries(assetStorage['store']);
    return NextResponse.json(all);
  }
}

// Edit companyId: expects JSON { oldCompanyId: string, newCompanyId: string }
export async function PUT(request: NextRequest) {
  try {
    const { oldCompanyId, newCompanyId } = await request.json();

    if (!oldCompanyId || !newCompanyId) {
      return NextResponse.json(
        { error: "Both oldCompanyId and newCompanyId are required" },
        { status: 400 }
      );
    }

    const all = Object.fromEntries(assetStorage['store']);
    if (!all[oldCompanyId]) {
      return NextResponse.json(
        { error: `Company ID "${oldCompanyId}" does not exist` },
        { status: 404 }
      );
    }
    if (all[newCompanyId]) {
      return NextResponse.json(
        { error: `Company ID "${newCompanyId}" already exists` },
        { status: 409 }
      );
    }

    // Move assets to new key and remove old key
    assetStorage['store'].set(newCompanyId, assetStorage['store'].get(oldCompanyId)!);
    assetStorage['store'].delete(oldCompanyId);
    assetStorage['save']();

    return NextResponse.json({ message: "Company ID updated successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update company ID" },
      { status: 500 }
    );
  }
}