import { NextRequest, NextResponse } from 'next/server';
import { connectToDb } from '@/db/mongodb';
import { QRCode } from '@/models/QRCode';

type Props = {
  params: Promise<{ id: string }>
}

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