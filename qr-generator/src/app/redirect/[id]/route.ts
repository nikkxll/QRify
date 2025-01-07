import { NextRequest, NextResponse } from 'next/server';
import { connectToDb } from '@/db/mongodb';
import { QRCode } from '@/models/QRCode';

type Props = {
  params: Promise<{ id: string }>
}

/**
 * Redirect QR Code
 * - Retrieves a QR code by tracking ID, increments amount of scans and redirects to its URL
 * 
 * Response:
 * - Success: Redirects to the QR code URL and increments scan count.
 * - Failure: Redirects to 404 or error page.
 */

export async function GET(
  request: NextRequest,
  props: Props,
) {
  try {
    await connectToDb();

    const params = await props.params;
    const qr = await QRCode.findOne({ trackingId: params.id });
    
    if (!qr) {
      return NextResponse.redirect(new URL('/404', request.url));
    }

    await QRCode.updateOne(
      { trackingId: params.id },
      { $inc: { scans: 1 } }
    );

    return NextResponse.redirect(new URL(qr.url, request.url));
  } catch (error) {
    console.error("Failed to redirect", error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}