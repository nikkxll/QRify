import { NextRequest } from 'next/server';
import { connectToDb } from '@/db/mongodb';
import { QRCode } from '@/models/QRCode';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDb();

    const { id } = await params;

    console.log('Redirect requested for ID:', id); 

    const qr = await QRCode.findOne({ trackingId: id });
    console.log('Found QR:', qr);
    
    if (!qr) {
      return Response.redirect(qr.url);
    }

    await QRCode.updateOne(
      { trackingId: id },
      { $inc: { scans: 1 } }
    );

    return Response.redirect(qr.url);
  } catch (error) {
    console.error("Failed to redirect", error);
    return Response.redirect(new URL('/error', request.url));
  }
}