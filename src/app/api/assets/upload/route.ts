import { NextRequest, NextResponse } from 'next/server';


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

    return NextResponse.json(
      { message: 'File received', companyId, fileName: file.name },
      { status: 200 }
    );

  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}