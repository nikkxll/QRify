import { Schema, model, models, Document } from 'mongoose';

export interface IQRCode extends Document {
  trackingId: string;
  url: string;
  qrCode: string;
  scans: number;
  showInHistory: boolean;
  createdAt: Date;
}

const QRCodeSchema = new Schema<IQRCode>({
  trackingId: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  qrCode: { type: String, required: true },
  scans: { type: Number, default: 0 },
  showInHistory: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const QRCode = models.QRCode || model<IQRCode>('QRCode', QRCodeSchema);