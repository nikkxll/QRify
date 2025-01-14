"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/components/Auth";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

interface QRCodeRecord {
  _id: string;
  url: string;
  qrCode: string;
  scans: number;
  createdAt: string;
  userId?: string;
}

export default function HistoryView() {
  const { user } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
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
        setIsLoading(true);
        setError(null);
        
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

    if (user) {
      fetchHistory();
    } else {
      setQrCodes([]);
      setFilteredQrCodes([]);
      setIsLoading(false);
    }
  }, [user]);

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

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">History</h1>
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-8 max-w-lg mx-auto">
          <p className="text-xl text-white/80 mb-4">
            Access your QR code history
          </p>
          <p className="text-white/60 mb-6">
            Login or create an account to save your QR codes
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setAuthMode('login')}
              className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 
                rounded-lg transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className="bg-white/10 hover:bg-white/20 text-white py-3 px-8 
                rounded-lg transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>

        {authMode === 'login' && (
          <LoginForm 
            onClose={() => setAuthMode(null)}
            onSwitchToRegister={() => setAuthMode('register')}
          />
        )}
        {authMode === 'register' && (
          <RegisterForm 
            onClose={() => setAuthMode(null)}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )}
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
        <h1 className="text-5xl font-bold text-white mb-6">Your QR Codes</h1>
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

      {filteredQrCodes.length === 0 ? (
        <div className="text-center text-white/50 mt-8">
          {searchTerm
            ? "No matching QR codes found"
            : "You haven't created any QR codes yet"}
        </div>
      ) : (
        <>
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
                  <span className="text-purple-400">Scans: {qr.scans}</span>
                  <button
                    onClick={() => handleDownload(qr.qrCode)}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          <PaginationControls />
        </>
      )}
    </div>
  );
}