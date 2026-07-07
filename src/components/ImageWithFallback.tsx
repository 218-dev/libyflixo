import React, { useState, useEffect } from "react";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  maxRetries?: number;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  fallbackSrc = "https://i.top4top.io/p_3839qx2t30.png", 
  maxRetries = 3,
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setErrorCount(0);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (errorCount < maxRetries) {
      setErrorCount((prev) => prev + 1);
      // Optional: Add a simple cache buster to force re-fetch if it was a transient network error
      const retryUrl = src ? (src.includes('?') ? `${src}&retry=${errorCount}` : `${src}?retry=${errorCount}`) : fallbackSrc;
      setImgSrc(retryUrl);
    } else {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img 
      {...props} 
      src={imgSrc} 
      onError={handleError} 
    />
  );
};

export default ImageWithFallback;
