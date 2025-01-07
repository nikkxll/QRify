import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/db/mongodb";
import { QRCode, IQRCode } from "@/models/QRCode";

/**
 * Save QR Code
 * - Saves a QR code entry to the database
 * 
 * Request Body:
 * {
 *   url: string,
 *   qrCode: string,
 *   trackingId: string,
 *   showInHistory: boolean
 * }
 * 
 * Response:
 * - Success: JSON object of the saved QR code
 * - Failure: JSON error response with status 500
 */

export async function POST(req: NextRequest) {
  try {
    await connectToDb();
    const { url, qrCode, trackingId, showInHistory } = await req.json();
    
    const cleanQRCode = qrCode.replace(/^data:image\/\w+;base64,/, '');
    
    const newQR = new QRCode({
      trackingId,
      url,
      qrCode: cleanQRCode,
      showInHistory
    });
    
    const savedQR = await newQR.save();
    return NextResponse.json(savedQR);
  } catch (error) {
    console.error("Failed to connect to the db:", error);
    return NextResponse.json({ error: "Failed to save QR code" }, { status: 500 });
  }
}

/**
 * Fetch QR Codes
 * - Retrieves QR codes visible in history from the database
 * 
 * Response:
 * - Success: Array of QR codes with fields:
 *   - url: string
 *   - qrCode: string (Base64 image data)
 *   - createdAt: Date
 *   - scans: number
 * - Failure: JSON error response with status 500
 */

export async function GET() {
  try {
    await connectToDb();
    const qrCodes: IQRCode[] = await QRCode.find({ showInHistory: true })
      .sort({ createdAt: -1 })
      .select('url qrCode createdAt scans')
      .exec();
    
    return NextResponse.json(qrCodes);
  } catch (error) {
    console.error("Failed to fetch QR codes:", error);
    return NextResponse.json(
      { error: "Failed to fetch QR codes" },
      { status: 500 }
    );
  }
}