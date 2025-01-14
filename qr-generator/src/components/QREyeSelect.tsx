"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface QREyeOption {
  value: string;
  label: string;
  previewUrl: string;
}

interface QREyeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const eyeStyles: QREyeOption[] = [
  { value: 'frame0', label: 'Option 0', previewUrl: '/assets/qr-eyes/frame0.png' },
  { value: 'frame1', label: 'Option 1', previewUrl: '/assets/qr-eyes/frame1.png' },
  { value: 'frame2', label: 'Option 2', previewUrl: '/assets/qr-eyes/frame2.png' },
  { value: 'frame3', label: 'Option 3', previewUrl: '/assets/qr-eyes/frame3.png' },
  { value: 'frame4', label: 'Option 4', previewUrl: '/assets/qr-eyes/frame4.png' },
  { value: 'frame5', label: 'Option 5', previewUrl: '/assets/qr-eyes/frame5.png' },
  { value: 'frame6', label: 'Option 6', previewUrl: '/assets/qr-eyes/frame6.png' },
  { value: 'frame7', label: 'Option 7', previewUrl: '/assets/qr-eyes/frame7.png' },
  { value: 'frame8', label: 'Option 8', previewUrl: '/assets/qr-eyes/frame8.png' },
  { value: 'frame10', label: 'Option 9', previewUrl: '/assets/qr-eyes/frame10.png' },
  { value: 'frame11', label: 'Option 10', previewUrl: '/assets/qr-eyes/frame11.png' },
  { value: 'frame12', label: 'Option 11', previewUrl: '/assets/qr-eyes/frame12.png' },
  { value: 'frame13', label: 'Option 12', previewUrl: '/assets/qr-eyes/frame13.png' },
  { value: 'frame14', label: 'Option 13', previewUrl: '/assets/qr-eyes/frame14.png' },
  { value: 'frame16', label: 'Option 14', previewUrl: '/assets/qr-eyes/frame16.png' },
];

export default function QREyeSelect({ value, onChange }: QREyeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedStyle = eyeStyles.find(style => style.value === value) || eyeStyles[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 
          text-white flex items-center justify-between focus:outline-none focus:ring-2 
          focus:ring-purple-500 focus:border-transparent hover:bg-white/20 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-md p-1">
            <Image
              src={selectedStyle.previewUrl}
              alt={selectedStyle.label}
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <span>{selectedStyle.label}</span>
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-black/100 backdrop-blur-xl border border-white/40 
          rounded-lg shadow-lg max-h-[240px] overflow-auto custom-scrollbar">
          {eyeStyles.map((style) => (
            <button
              key={style.value}
              type="button"
              onClick={() => {
                onChange(style.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 flex items-center space-x-3 
                ${style.value === value ? 'bg-purple-500/40' : 'hover:bg-white/20'} 
                transition-colors border-b border-white/10 last:border-0`}
            >
              <div className="w-8 h-8 bg-white rounded-md p-1 flex-shrink-0">
                <Image
                  src={style.previewUrl}
                  alt={style.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <span className="text-white font-medium">{style.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}