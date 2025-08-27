import { NextRequest, NextResponse } from 'next/server';
import { assetStorage } from '@/utils/storage';
import { Asset } from '@/types/asset';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const companyId = formData.get('companyId') as string;
    const file = formData.get('assetFile') as File;

    if (!companyId || !file) {
      return NextResponse.json(
        { error: 'companyId and assetFile are required' },
        { status: 400 }
      );
    }

    const isValidType = ['application/json', 'text/csv'].includes(file.type) || 
                       file.name.match(/\.(json|csv)$/i);
    
    if (!isValidType) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload JSON or CSV' },
        { status: 400 }
      );
    }

    const fileText = await file.text();
    let assets: Asset[] = [];

    if (file.type === 'application/json' || file.name.endsWith('.json')) {
      try {
        const parsedData = JSON.parse(fileText);
        assets = Array.isArray(parsedData) ? parsedData : [parsedData];
      } catch {
        return NextResponse.json(
          { error: 'Invalid JSON format' },
          { status: 400 }
        );
      }
    } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
  try {
    const lines = fileText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'CSV file must contain header and at least one data row' },
        { status: 400 }
      );
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const expectedHeaders = ['address', 'latitude', 'longitude'];
    
    const hasValidHeaders = expectedHeaders.every(header => 
      headers.includes(header.toLowerCase())
    );

    if (!hasValidHeaders) {
      return NextResponse.json(
        { error: 'CSV must contain address, latitude, and longitude columns' },
        { status: 400 }
      );
    }

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length !== 3) continue;

      const asset: Asset = {
        address: values[headers.indexOf('address')],
        latitude: parseFloat(values[headers.indexOf('latitude')]),
        longitude: parseFloat(values[headers.indexOf('longitude')])
      };

      if (isNaN(asset.latitude) || isNaN(asset.longitude)) {
        return NextResponse.json(
          { error: 'Invalid numeric values in CSV' },
          { status: 400 }
        );
      }

      assets.push(asset);
    }
  } catch  {
    return NextResponse.json(
      { error: 'Failed to parse CSV file' },
      { status: 400 }
    );
  }
}

    // Validate assets structure
    for (const asset of assets) {
      if (!asset.address || typeof asset.latitude !== 'number' || typeof asset.longitude !== 'number') {
        return NextResponse.json(
          { error: 'Invalid asset data structure' },
          { status: 400 }
        );
      }
    }

    assetStorage.setAssets(companyId, assets);

    return NextResponse.json({
      message: 'Assets uploaded successfully',
      count: assets.length
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}