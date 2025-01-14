"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface QRStyleOption {
  value: string;
  label: string;
  previewUrl: string;
}

interface QRStyleSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const styles: QRStyleOption[] = [
  { value: 'square', label: 'Square', previewUrl: '/assets/qr-styles/square.png' },
  { value: 'mosaic', label: 'Mosaic', previewUrl: '/assets/qr-styles/mosaic.png' },
  { value: 'dot', label: 'Dot', previewUrl: '/assets/qr-styles/dot.png' },
  { value: 'circle', label: 'Circle', previewUrl: '/assets/qr-styles/circle.png' },
  { value: 'circle-zebra', label: 'Circle Zebra', previewUrl: '/assets/qr-styles/circle-zebra.png' },
  { value: 'circle-zebra-vertical', label: 'Circle Zebra Vertical', previewUrl: '/assets/qr-styles/circle-zebra-vertical.png' },
  { value: 'circular', label: 'Circular', previewUrl: '/assets/qr-styles/circular.png' },
  { value: 'edge-cut', label: 'Edge Cut', previewUrl: '/assets/qr-styles/edge-cut.png' },
  { value: 'edge-cut-smooth', label: 'Edge Cut Smooth', previewUrl: '/assets/qr-styles/edge-cut-smooth.png' },
  { value: 'japnese', label: 'Japanese', previewUrl: '/assets/qr-styles/japnese.png' },
  { value: 'leaf', label: 'Leaf', previewUrl: '/assets/qr-styles/leaf.png' },
  { value: 'pointed', label: 'Pointed', previewUrl: '/assets/qr-styles/pointed.png' },
  { value: 'pointed-edge-cut', label: 'Pointed Edge Cut', previewUrl: '/assets/qr-styles/pointed-edge-cut.png' },
  { value: 'pointed-in', label: 'Pointed In', previewUrl: '/assets/qr-styles/pointed-in.png' },
  { value: 'pointed-in-smooth', label: 'Pointed In Smooth', previewUrl: '/assets/qr-styles/pointed-in-smooth.png' },
  { value: 'pointed-smooth', label: 'Pointed Smooth', previewUrl: '/assets/qr-styles/pointed-smooth.png' },
  { value: 'round', label: 'Round', previewUrl: '/assets/qr-styles/round.png' },
  { value: 'rounded-in', label: 'Rounded In', previewUrl: '/assets/qr-styles/rounded-in.png' },
  { value: 'rounded-in-smooth', label: 'Rounded In Smooth', previewUrl: '/assets/qr-styles/rounded-in-smooth.png' },
  { value: 'rounded-pointed', label: 'Rounded Pointed', previewUrl: '/assets/qr-styles/rounded-pointed.png' },
  { value: 'star', label: 'Star', previewUrl: '/assets/qr-styles/star.png' },
  { value: 'diamond', label: 'Diamond', previewUrl: '/assets/qr-styles/diamond.png' },
];

export default function QRStyleSelect({ value, onChange }: QRStyleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedStyle = styles.find(style => style.value === value) || styles[0];

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
        <div className="absolute z-10 w-full mt-2 bg-white/20 backdrop-blur-xl border border-white/40 
          rounded-lg shadow-lg max-h-[320px] overflow-auto custom-scrollbar">
          {styles.map((style) => (
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