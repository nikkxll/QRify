import { NextRequest, NextResponse } from 'next/server';

const QR_API_URL = 'https://api.qrcode-monkey.com/qr/custom';

export async function POST(req: NextRequest) {
  try {
    const { url, config } = await req.json();

    const response = await fetch(QR_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: url,
        config,
        size: 300,
        download: false,
        file: "svg"
      })
    });

    if (!response.ok) {
      throw new Error('QR API response error');
    }

    const imageBuffer = await response.arrayBuffer();
    return new NextResponse(imageBuffer, {
      headers: { 'Content-Type': 'image/svg+xml' }
    });

  } catch (error) {
    console.log("Failed to generate QR code:", error);
    return NextResponse.json({ error: 'Failed to generate QR' }, { status: 500 });
  }
}