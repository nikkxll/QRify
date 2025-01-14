"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import URLForm from "@/components/URLForm";
import HistoryView from "@/components/HistoryView";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { convertSvgToPng } from "@/utils/converter";
import { useAuth } from "@/components/Auth";

interface QRGeneratorAppProps {
  initialView?: "generate" | "history";
}

const QRGeneratorApp: React.FC<QRGeneratorAppProps> = ({
  initialView = "generate",
}) => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState(initialView);
  const [authMode, setAuthMode] = useState<"login" | "register" | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFormSubmit = async (url: string, backgroundColor: string, bodyStyle: string, eyeStyle: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/qr/generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          config: {
            body: bodyStyle,
            eye: eyeStyle,
            eyeBall: "ball15",
            bgColor: backgroundColor.replace("#", ""),
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to generate QR code");

      const svgContent = await response.text();
      const trackingId = response.headers.get("X-Tracking-Id");

      const img = document.createElement("img");
      const canvas = document.createElement("canvas");
      canvas.width = 350;
      canvas.height = 350;
      const ctx = canvas.getContext("2d");

      await new Promise((resolve, reject) => {
        img.onload = () => {
          const x = (canvas.width - img.width) / 2;
          const y = (canvas.height - img.height) / 2;
          ctx?.drawImage(img, x, y, img.width, img.height);
          resolve(null);
        };
        img.onerror = reject;
        img.src = "data:image/svg+xml;base64," + btoa(svgContent);
      });

      const pngDataUrl = canvas.toDataURL("image/png");
      setQrCode(pngDataUrl);

      await fetch("/api/qr/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          qrCode: pngDataUrl,
          trackingId,
        }),
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate QR code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!qrCode) return;
    try {
      const pngBlob = await convertSvgToPng(qrCode);
      const blobUrl = URL.createObjectURL(pngBlob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "qr_code.png";
      link.click();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleShare = async () => {
    if (!qrCode) return;
    try {
      const pngBlob = await convertSvgToPng(qrCode);
      const file = new File([pngBlob], "qr-code.png", { type: "image/png" });

      if (navigator.share) {
        await navigator.share({
          title: "QR Code",
          text: "Check out this QR code!",
          files: [file],
        });
      } else {
        await navigator.clipboard.writeText("QR Code Generated");
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Failed to share QR code:", err);
      setError("Failed to share QR code");
    }
  };

  const handleLogout = async () => {
    await logout();

    setQrCode(null);
    setError(null);
    setCurrentView("generate");
    setAuthMode(null);
    localStorage.clear();

    window.location.reload();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 w-full h-full bg-black">
        <Image
          src="/back.svg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative min-h-screen">
        {/* Navigation */}
        <nav
          className={`fixed top-0 left-0 right-0 border-b border-white/10 backdrop-blur-sm transition-all duration-300 z-50 bg-transparent`}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div
              className={`flex justify-between items-center transition-all duration-300 ${
                isScrolled ? "h-14" : "h-16"
              }`}
            >
              <div
                className="text-white font-bold text-2xl cursor-pointer"
                onClick={() => setCurrentView("generate")}
              >
                QRify
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentView("generate")}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Generate
                </button>

                {user ? (
                  <>
                    <button
                      onClick={() => setCurrentView("history")}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                      History
                    </button>
                    <div className="flex items-center">
                      <button
                        onClick={handleLogout}
                        className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => setAuthMode("login")}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Auth Modals */}
        {authMode === "login" && (
          <LoginForm
            onClose={() => setAuthMode(null)}
            onSwitchToRegister={() => setAuthMode("register")}
          />
        )}
        {authMode === "register" && (
          <RegisterForm
            onClose={() => setAuthMode(null)}
            onSwitchToLogin={() => setAuthMode("login")}
          />
        )}

        {/* Generate QR and History */}
        <div className="pt-16">
          {currentView === "generate" ? (
            <div className="max-w-7xl mx-auto px-4 py-10">
              <div className="max-w-3xl mx-auto text-center mb-10">
                <h1 className="text-5xl font-bold text-white mb-6">
                  QR Generator
                </h1>
                <p className="text-xl text-white/80">
                  {user
                    ? "Create and save QR codes for your URLs"
                    : "Create QR codes instantly for any URL"}
                </p>
              </div>

              <div className="max-w-xl mx-auto">
                <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                  <URLForm onSubmit={handleFormSubmit} />

                  {error && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {isLoading && (
                    <div className="mt-8 flex justify-center">
                      <div className="w-64 h-64 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                      </div>
                    </div>
                  )}

                  {qrCode && !isLoading && (
                    <div className="mt-8 space-y-6">
                      <div className="flex justify-center">
                        <div className="w-64 h-64 rounded-lg">
                          <Image
                            src={qrCode}
                            alt="Generated QR Code"
                            width={300}
                            height={300}
                            className="rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="flex space-x-4 pt-2">
                        <button
                          onClick={handleDownload}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          <span>Download</span>
                        </button>

                        <button
                          onClick={handleShare}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            />
                          </svg>
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : user ? (
            <HistoryView />
          ) : (
            <p className="text-center text-white">
              Please log in to view history
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRGeneratorApp;