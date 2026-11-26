import React, { useState } from 'react';
import { Camera } from 'lucide-react';

interface StudioImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const StudioImage: React.FC<StudioImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#262930] to-[#17191D] p-4 text-center text-[#EAE8E3] ${className}`}
        role="img"
        aria-label={alt}
      >
        <Camera className="h-7 w-7 text-[var(--studio-accent)] opacity-85" />
        <p className="mt-2 text-xs font-medium opacity-80">{fallbackTitle || alt}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
