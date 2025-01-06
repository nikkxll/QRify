import { Schema, model, models, Document } from 'mongoose';

export interface IQRCode extends Document {
  url: string;
  qrCode: string;
  scans: number;
  createdAt: Date;
}

const QRCodeSchema = new Schema<IQRCode>({
  url: { type: String, required: true },
  qrCode: { type: String, required: true },
  scans: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const QRCode = models.QRCode || model<IQRCode>('QRCode', QRCodeSchema);