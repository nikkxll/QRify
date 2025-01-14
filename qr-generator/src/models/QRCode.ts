import { Schema, model, models, Document, Types } from 'mongoose';

export interface IQRCode extends Document {
  trackingId: string;
  url: string;
  qrCode: string;
  scans: number;
  userId?: Types.ObjectId;
  createdAt: Date;
}

const QRCodeSchema = new Schema<IQRCode>({
  trackingId: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  qrCode: { type: String, required: true },
  scans: { type: Number, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now }
});

// for faster queries
QRCodeSchema.index({ userId: 1, createdAt: -1 });

export const QRCode = models.QRCode || model<IQRCode>('QRCode', QRCodeSchema);