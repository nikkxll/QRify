import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from "@/middleware/auth";
import { getContrastColor } from "@/utils/colorUtils";

const BASE_URL = process.env.BASE_URL!;
const API_URL = process.env.QR_API_URL!;

/**
 * QR Code Generator API
 * - POST: Generates a QR code with a unique tracking URL
 * - Request: { url, config }
 * - Response: SVG image with headers:
 *   - Content-Type: image/svg+xml
 *   - X-Tracking-Id: <UUID>
 */

export async function POST(req: NextRequest) {
  try {
    const { config } = await req.json();
    const user = await authenticateUser();

    const qrId = randomUUID();
    const trackingUrl = `${BASE_URL}/redirect/${qrId}`;

    const contrastColor = getContrastColor(config.bgColor);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: trackingUrl,
        config: {
          ...config,
          bodyColor: contrastColor,
          eye1Color: contrastColor,
          eye2Color: contrastColor,
          eye3Color: contrastColor,
          eyeBall1Color: contrastColor,
          eyeBall2Color: contrastColor,
          eyeBall3Color: contrastColor
        },
        size: 300,
        download: false,
        file: "svg"
      })
    });

    if (!response.ok) {
      throw new Error('QR API response error');
    }

    const userId = user?.userId ? String(user.userId) : '';

    const imageBuffer = await response.arrayBuffer();
    return new NextResponse(imageBuffer, {
      headers: { 
        'Content-Type': 'image/svg+xml',
        'X-Tracking-Id': qrId,
        'X-User-Id': userId
      }
    });

  } catch (error) {
    console.error("Failed to generate QR code:", error);
    return NextResponse.json({ error: 'Failed to generate QR' }, { status: 500 });
  }
}