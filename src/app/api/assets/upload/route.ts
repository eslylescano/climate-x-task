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

    const isValidType = ['application/json', 'text/csv'].includes(file.type) || 
                       file.name.match(/\.(json|csv)$/i);
    
    if (!isValidType) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload JSON or CSV' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: 'File validation passed', 
        companyId, 
        fileName: file.name,
        fileType: file.type
      },
      { status: 200 }
    );

  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}