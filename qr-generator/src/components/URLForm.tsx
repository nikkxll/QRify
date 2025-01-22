"use client";

import React, { useState, useEffect } from "react";
import { isValidUrl } from "@/utils/urlValidator";
import QRStyleSelect from "@/components/QRStyleSelect";
import QREyeSelect from "@/components/QREyeSelect";
import { isColorDark } from "@/utils/colorUtils";
import { uploadImageToQR } from "@/utils/uploadImage";

interface URLFormProps {
  onSubmit: (
    url: string,
    backgroundColor: string,
    bodyStyle: string,
    eyeStyle: string,
    uploadedLogoId?: string | null,
    gradientColor1?: string,
    gradientColor2?: string,
    gradientType?: "linear" | "radial",
    gradientOnEyes?: boolean
  ) => void;
}

const MAX_LOGO_SIZE = 1024 * 1024;

const URLForm: React.FC<URLFormProps> = ({ onSubmit }) => {
  const [url, setUrl] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [bodyStyle, setBodyStyle] = useState("round");
  const [eyeStyle, setEyeStyle] = useState("frame0");
  const [isValid, setIsValid] = useState(true);
  const [uploadedLogoId, setUploadedLogoId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [gradientColor1, setGradientColor1] = useState("#000000");
  const [gradientColor2, setGradientColor2] = useState("#000000");
  const [gradientType, setGradientType] = useState<"linear" | "radial">(
    "linear"
  );
  const [useGradient, setUseGradient] = useState(false);
  const [gradientOnEyes, setGradientOnEyes] = useState(false);

  useEffect(() => {
    setUrl(localStorage.getItem("qr_url") || "");
    setBackgroundColor(
      localStorage.getItem("qr_background_color") || "#FFFFFF"
    );
  }, []);

  useEffect(() => {
    if (url) localStorage.setItem("qr_url", url);
    if (backgroundColor)
      localStorage.setItem("qr_background_color", backgroundColor);
  }, [url, backgroundColor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isValidUrl(url)) {
      setIsValid(true);
      onSubmit(
        url,
        backgroundColor,
        bodyStyle,
        eyeStyle,
        uploadedLogoId,
        gradientColor1,
        gradientColor2,
        gradientType,
        gradientOnEyes
      );
    } else {
      setIsValid(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/image\/(png|jpeg|svg\+xml)/)) {
        alert("Please upload a PNG, JPG or SVG file");
        return;
      }
      if (file.size > MAX_LOGO_SIZE) {
        alert('Logo must be less than 1MB');
        return;
      }
      try {
        setIsUploading(true);
        const uploadedFile = await uploadImageToQR(file);
        setUploadedLogoId(uploadedFile);
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload logo");
      } finally {
        setIsUploading(false);
      }
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
        {isColorDark(backgroundColor.replace("#", "")) && (
          <p className="mt-5 text-sm text-yellow-400 flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m-2 6v2h2v-2" />
            </svg>
            <span>
              Dark background detected. Generated QR code might be invisible.
            </span>
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="useGradient"
            checked={useGradient}
            onChange={(e) => setUseGradient(e.target.checked)}
            className="h-4 w-4 bg-white/10 border-white/20 rounded"
          />
          <label htmlFor="useGradient" className="ml-2 text-sm text-white/80">
            Use gradient
          </label>
        </div>

        {useGradient && (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Gradient Color 1
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={gradientColor1}
                    onChange={(e) => setGradientColor1(e.target.value)}
                    className="h-10 w-20 bg-transparent border-0 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={gradientColor1}
                    onChange={(e) => {
                      if (e.target.value.startsWith("#")) {
                        setGradientColor1(e.target.value);
                      }
                    }}
                    className="w-28 bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Gradient Color 2
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={gradientColor2}
                    onChange={(e) => setGradientColor2(e.target.value)}
                    className="h-10 w-20 bg-transparent border-0 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={gradientColor2}
                    onChange={(e) => {
                      if (e.target.value.startsWith("#")) {
                        setGradientColor2(e.target.value);
                      }
                    }}
                    className="w-28 bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Gradient Type
                </label>
                <select
                  value={gradientType}
                  onChange={(e) =>
                    setGradientType(e.target.value as "linear" | "radial")
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 
                  text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="linear">Linear</option>
                  <option value="radial">Radial</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="gradientOnEyes"
                  checked={gradientOnEyes}
                  onChange={(e) => setGradientOnEyes(e.target.checked)}
                  className="h-4 w-4 bg-white/10 border-white/20 rounded"
                />
                <label
                  htmlFor="gradientOnEyes"
                  className="ml-2 text-sm text-white/80"
                >
                  Apply gradient to eyes
                </label>
              </div>
            </div>
          </>
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

      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Custom Logo
        </label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/svg+xml"
          onChange={handleLogoUpload}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 
      text-white file:bg-purple-600 file:text-white file:border-0 
      file:rounded-lg file:px-4 file:py-2 file:mr-4
      hover:file:bg-purple-700 file:cursor-pointer cursor-pointer"
          disabled={isUploading}
        />
        {isUploading && (
          <p className="text-sm text-white/60 mt-1">Uploading logo...</p>
        )}
        {uploadedLogoId && !isUploading && (
          <p className="text-sm text-green-400 mt-1">
            Logo uploaded successfully
          </p>
        )}
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
