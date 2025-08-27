import { assetStorage } from '@/utils/storage';
import { NextResponse } from 'next/server';

export async function GET() {
  // Return the full object: { companyId: [assets], ... }
  const all = Object.fromEntries(assetStorage['store']);
  return NextResponse.json(all);
}