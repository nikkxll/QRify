"use client";

import React, { useState, useEffect } from "react";
import URLForm from '@/components/URLForm';

interface QRGeneratorAppProps {
  initialView?: "generate" | "history";
}

const QRGeneratorApp: React.FC<QRGeneratorAppProps> = ({
  initialView = "generate",
}) => {
  const [currentView, setCurrentView] = useState(initialView);
  const [isScrolled, setIsScrolled] = useState(false);

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

  const handleFormSubmit = (url: string, saveToHistory: boolean) => {
    console.log('Generating QR for:', url, 'Save to history:', saveToHistory);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 w-full h-full bg-black">
        <img
          src="/back.svg"
          alt="Background"
          className="w-full h-full object-cover"
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
              <div className="text-white font-bold text-2xl">QRify</div>
              <div className="flex space-x-8">
                <button
                  onClick={() => setCurrentView("generate")}
                  className={`text-base transition-colors ${
                    currentView === "generate"
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Generate
                </button>
                <button
                  onClick={() => setCurrentView("history")}
                  className={`text-base transition-colors ${
                    currentView === "history"
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  History
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Generate QR and History */}
        <div className="pt-16">
          {currentView === "generate" ? (
            <div className="max-w-7xl mx-auto px-4 py-10">
              <div className="max-w-3xl mx-auto text-center mb-10">
                <h1 className="text-5xl font-bold text-white mb-6">
                  QR Generator
                </h1>
                <p className="text-xl text-white/80">
                  Create static QR instantly for any URL.
                </p>
              </div>

              <div className="max-w-xl mx-auto">
                <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                  <URLForm onSubmit={handleFormSubmit} />

                  {/* Buttons section */}
                  <div className="mt-6 space-y-4">
                    <button
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      onClick={() => {}}
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
                      <span>Download Code</span>
                    </button>

                    <div className="flex space-x-4">
                      <button
                        className="flex-1 bg-black/20 hover:bg-black/30 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        onClick={() => {}}
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
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Share via Email</span>
                      </button>

                      <button
                        className="flex-1 bg-black/20 hover:bg-black/30 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        onClick={() => {}}
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
                        <span>Share on Social Media</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-4 py-12">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-white mb-6">History</h1>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRGeneratorApp;