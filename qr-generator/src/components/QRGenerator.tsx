"use client";

import React, { useState, useEffect } from "react";

interface QRGeneratorAppProps {
  initialView?: "generate" | "history";
}

const QRGeneratorApp: React.FC<QRGeneratorAppProps> = ({
  initialView = "generate",
}) => {
  const [currentView, setCurrentView] = useState(initialView);
  const [url, setUrl] = useState("");
  const [saveToHistory, setSaveToHistory] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          className={`fixed top-0 left-0 right-0 border-b border-white/10 backdrop-blur-sm transition-all duration-300 z-50 ${
            isScrolled ? 'bg-black/50' : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className={`flex justify-between items-center transition-all duration-300 ${
              isScrolled ? 'h-14' : 'h-16'
            }`}>
              <div className="text-white font-bold text-2xl">QRify</div>
              <div className="flex space-x-8">
                <button 
                  onClick={() => setCurrentView('generate')}
                  className={`text-base transition-colors ${
                    currentView === 'generate' 
                      ? 'text-white' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Generate
                </button>
                <button
                  onClick={() => setCurrentView('history')}
                  className={`text-base transition-colors ${
                    currentView === 'history'
                      ? 'text-white' 
                      : 'text-white/70 hover:text-white'
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
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="url"
                      className="block text-base text-white/80 mb-2"
                    >
                      Enter URL
                    </label>
                    <input
                      type="url"
                      id="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="saveHistory"
                      checked={saveToHistory}
                      onChange={(e) => setSaveToHistory(e.target.checked)}
                      className="h-4 w-4 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-offset-0"
                    />
                    <label
                      htmlFor="saveHistory"
                      className="ml-2 text-base text-white/80"
                    >
                      Save to history
                    </label>
                  </div>

                  <div className="flex justify-center">
                    <div className="w-64 h-64 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                      <p className="text-white/50 text-sm">
                        QR code will appear here
                      </p>
                    </div>
                  </div>

                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                    <span>Generate Code</span>
                  </button>
                </div>

                {/* New buttons section */}
                <div className="mt-6 space-y-4">
                  <button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    onClick={() => {
                      /* Download logic will go here */
                    }}
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
                      onClick={() => {
                        /* Email sharing logic will go here */
                      }}
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
                      onClick={() => {
                        /* Social media sharing logic will go here */
                      }}
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
