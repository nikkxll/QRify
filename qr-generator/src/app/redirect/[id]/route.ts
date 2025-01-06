import { NextRequest } from 'next/server';
import { connectToDb } from '@/db/mongodb';
import { QRCode } from '@/models/QRCode';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDb();

    console.log('Redirect requested for ID:', params.id); 

    const qr = await QRCode.findOne({ id: params.id });
    
    if (!qr) {
      return Response.redirect(new URL('/404', request.url));
    }

    await QRCode.updateOne(
      { id: params.id },
      { $inc: { scans: 1 } }
    );

    return Response.redirect(qr.originalUrl);
  } catch (error) {
    return Response.redirect(new URL('/error', request.url));
  }
}