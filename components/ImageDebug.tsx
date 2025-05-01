'use client';

import React, { useState, useEffect } from 'react';

interface ImageDebugProps {
  src: string;
}

const ImageDebug: React.FC<ImageDebugProps> = ({ src }) => {
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // Reset states when src changes
    setError(null);
    setLoaded(false);
  }, [src]);

  const handleError = () => {
    setError(`Failed to load image from: ${src}`);
    console.error(`Image failed to load: ${src}`);
  };

  const handleLoad = () => {
    setLoaded(true);
    console.log(`Image loaded successfully: ${src}`);
  };

  return (
    <div className="image-debug">
      <div className="mb-2 border border-gray-200 p-2 inline-block">
        <img 
          src={src} 
          alt="Image" 
          onError={handleError}
          onLoad={handleLoad}
          className="object-cover w-[200px] h-[150px]"
        />
        <p className="text-sm text-gray-500 mt-1">
          {loaded ? "✅ Image loaded" : error ? "❌ " + error : "⏳ Loading..."}
        </p>
        <p className="text-xs text-gray-400 mt-1 break-all">Path: {src}</p>
      </div>
    </div>
  );
};

export default ImageDebug;
