'use client';

import { useState, useEffect } from 'react';

interface QRCodeRecord {
  _id: string;
  url: string;
  qrCode: string;
  createdAt: string;
}

export default function HistoryView() {
  const [qrCodes, setQrCodes] = useState<QRCodeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/qr/history');
        if (!response.ok) throw new Error('Failed to fetch history');
        
        const data = await response.json();
        setQrCodes(data);
      } catch (error) {
        setError('Failed to load QR code history');
        console.error('History fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDownload = async (qrCode: string) => {
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = 'qr_code.png';
        link.click();
      };
      const blob = new Blob([qrCode], { type: 'image/svg+xml' });
      img.src = URL.createObjectURL(blob);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-6">
          History
        </h1>
        <p className="text-xl text-white/80">
          Previously generated QR codes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {qrCodes.map((qr) => (
          <div 
            key={qr._id} 
            className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
          >
            <p className="text-white truncate mb-2">{qr.url}</p>
            <div 
                dangerouslySetInnerHTML={{ __html: qr.qrCode }} 
                className="w-full h-full"
            />
            <div className="flex justify-between items-center">
              <p className="text-base text-white/50">
                {new Date(qr.createdAt).toLocaleDateString()}
              </p>
              <button 
                onClick={() => handleDownload(qr.qrCode)}
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {qrCodes.length === 0 && (
        <div className="text-center text-white/50 mt-8">
          No QR codes in history yet
        </div>
      )}
    </div>
  );
}