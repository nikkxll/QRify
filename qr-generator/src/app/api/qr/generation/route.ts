import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.BASE_URL!;
const API_URL = process.env.QR_API_URL!;

export async function POST(req: NextRequest) {
  try {
    const { config } = await req.json();

    const qrId = randomUUID();
    const trackingUrl = `${BASE_URL}/redirect/${qrId}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: trackingUrl,
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
      headers: { 
        'Content-Type': 'image/svg+xml',
        'X-Tracking-Id': qrId
      }
    });

  } catch (error) {
    console.error("Failed to generate QR code:", error);
    return NextResponse.json({ error: 'Failed to generate QR' }, { status: 500 });
  }
}