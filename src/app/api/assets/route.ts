import { NextRequest, NextResponse } from 'next/server';
import { assetStorage } from '@/utils/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    const assets = assetStorage.getAssets(companyId || undefined);

    return NextResponse.json(assets);

  } catch  {
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}