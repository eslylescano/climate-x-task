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