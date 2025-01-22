"use client";

import React, { useState, useEffect } from "react";
import { isValidUrl } from "@/utils/urlValidator";
import QRStyleSelect from "@/components/QRStyleSelect";
import QREyeSelect from "@/components/QREyeSelect";
import { isColorDark } from "@/utils/colorUtils";

interface URLFormProps {
  onSubmit: (
    url: string,
    backgroundColor: string,
    bodyStyle: string,
    eyeStyle: string
  ) => void;
}

const URLForm: React.FC<URLFormProps> = ({ onSubmit }) => {
  const [url, setUrl] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [bodyStyle, setBodyStyle] = useState("round");
  const [eyeStyle, setEyeStyle] = useState("frame0");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setUrl(localStorage.getItem("qr_url") || "");
    setBackgroundColor(
      localStorage.getItem("qr_background_color") || "#FFFFFF"
    );
    setBodyStyle(localStorage.getItem("qr_body_style") || "round");
    setEyeStyle(localStorage.getItem("eye_style") || "frame0");
  }, []);

  useEffect(() => {
    if (url) localStorage.setItem("qr_url", url);
    if (backgroundColor)
      localStorage.setItem("qr_background_color", backgroundColor);
    if (bodyStyle) localStorage.setItem("qr_body_style", bodyStyle);
    if (eyeStyle) localStorage.setItem("eye_style", eyeStyle);
  }, [url, backgroundColor, bodyStyle, eyeStyle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isValidUrl(url)) {
      setIsValid(true);
      onSubmit(url, backgroundColor, bodyStyle, eyeStyle);
    } else {
      setIsValid(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="url"
          className="block text-sm font-medium text-white/80 mb-2"
        >
          Enter URL
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setIsValid(true);
          }}
          placeholder="https://example.com"
          className={`w-full bg-white/10 border ${
            isValid ? "border-white/20" : "border-red-500"
          } 
            rounded-lg px-4 py-3 text-white placeholder-white/50 
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
            transition-all`}
        />
        {!isValid && (
          <p className="mt-2 text-sm text-red-400">Please enter a valid URL</p>
        )}
      </div>

      <div>
        <label
          htmlFor="bgColor"
          className="block text-sm font-medium text-white/80 mb-2"
        >
          Background Color
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            id="bgColor"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="h-10 w-20 bg-transparent border-0 rounded cursor-pointer"
          />
          <input
            type="text"
            value={backgroundColor}
            onChange={(e) => {
              if (e.target.value.startsWith("#")) {
                setBackgroundColor(e.target.value);
              }
            }}
            className="w-28 bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
            placeholder="#FFFFFF"
          />
        </div>
        {isColorDark(backgroundColor.replace('#', '')) && (
          <p className="mt-5 text-sm text-yellow-400 flex items-center space-x-2">
            <svg 
              className="w-4 h-4" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2L1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m-2 6v2h2v-2" />
            </svg>
            <span>Dark background detected. Generated QR code might be invisible.</span>
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Body Style
        </label>
        <QRStyleSelect value={bodyStyle} onChange={setBodyStyle} />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Eye Style
        </label>
        <QREyeSelect value={eyeStyle} onChange={setEyeStyle} />
      </div>

      <button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 
          rounded-lg transition-colors flex items-center justify-center space-x-2"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
        <span>Generate QR Code</span>
      </button>
    </form>
  );
};

export default URLForm;
