import { NextRequest } from 'next/server';
import { connectToDb } from '@/db/mongodb';
import { QRCode } from '@/models/QRCode';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDb();

    console.log('Redirect requested for ID:', context.params.id); 

    const qr = await QRCode.findOne({ id: context.params.id });
    
    if (!qr) {
      return Response.redirect(new URL('/404', request.url));
    }

    await QRCode.updateOne(
      { id: context.params.id },
      { $inc: { scans: 1 } }
    );

    return Response.redirect(qr.originalUrl);
  } catch (error) {
    console.error("Failed to redirect", error);
    return Response.redirect(new URL('/error', request.url));
  }
}