import { NextRequest, NextResponse } from 'next/server';

const QR_API_URL = process.env.QR_API_URL_IMG!;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const response = await fetch(QR_API_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload to QR service');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}