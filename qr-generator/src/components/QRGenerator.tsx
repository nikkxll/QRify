'use client';

import React, { useState } from 'react';

interface QRGeneratorProps {
  initialView?: 'generate' | 'history';
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ 
  initialView = 'generate' 
}) => {
  const [currentView, setCurrentView] = useState(initialView);
  const [url, setUrl] = useState('');
  const [saveToHistory, setSaveToHistory] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Base structure - we'll add the implementation later */}
      <div>QR Generator App - {currentView} view</div>
    </div>
  );
};

export default QRGenerator;