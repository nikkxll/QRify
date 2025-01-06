"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface QRCodeRecord {
  _id: string;
  url: string;
  qrCode: string;
  scans: number;
  createdAt: string;
}

export default function HistoryView() {
  const [qrCodes, setQrCodes] = useState<QRCodeRecord[]>([]);
  const [filteredQrCodes, setFilteredQrCodes] = useState<QRCodeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const QR_PER_PAGE = 9;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/qr/history");
        if (!response.ok) throw new Error("Failed to fetch history");

        const data = await response.json();
        setQrCodes(data);
        setFilteredQrCodes(data);
      } catch (error) {
        setError("Failed to load QR code history");
        console.error("History fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    const filtered = qrCodes.filter((qr) =>
      qr.url.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQrCodes(filtered);
    setCurrentPage(1);
  }, [searchTerm, qrCodes]);

  const indexOfLastQR = currentPage * QR_PER_PAGE;
  const indexOfFirstQR = indexOfLastQR - QR_PER_PAGE;
  const currentQRs = filteredQrCodes.slice(indexOfFirstQR, indexOfLastQR);
  const totalPages = Math.ceil(filteredQrCodes.length / QR_PER_PAGE);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const PaginationControls = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center space-x-2 mt-8">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentPage === pageNum
                ? "bg-purple-600 text-white"
                : "bg-black/20 text-white/70 hover:text-white hover:bg-black/30"
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>
    );
  };

  const handleDownload = async (qrCode: string) => {
    try {
      const link = document.createElement("a");
      link.href = `data:image/png;base64,${qrCode}`;
      link.download = "qr_code.png";
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
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
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-6">History</h1>
        <p className="text-xl text-white/80">Previously generated QR codes</p>
        <div className="max-w-md mx-auto py-6">
          <input
            type="text"
            placeholder="Search by URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 
              text-white placeholder-white/50 focus:outline-none focus:ring-2 
              focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentQRs.map((qr) => (
          <div
            key={qr._id}
            className="bg-black/20 backdrop-blur-xl rounded-2xl p-6"
          >
            <p className="text-white truncate mb-2">{qr.url}</p>
            <div className="w-64 h-64 mx-auto rounded-lg">
              <Image
                src={`data:image/png;base64,${qr.qrCode}`}
                alt="QR Code"
                width={300}
                height={300}
                className="object-contain"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-white/50">
                {new Date(qr.createdAt).toLocaleDateString()}
              </p>
              <span className="text-purple-400">{qr.scans} scans</span>
              <button
                onClick={() => handleDownload(qr.qrCode)}
                className="text-purple-400"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredQrCodes.length === 0 ? (
        <div className="text-center text-white/50 mt-8">
          {searchTerm
            ? "No matching QR codes found"
            : "No QR codes in history yet"}
        </div>
      ) : (
        <PaginationControls />
      )}
    </div>
  );
}
