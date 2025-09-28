'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

type Props = Omit<ImageProps, 'alt' | 'onLoad' | 'onLoadingComplete'> & {
  alt?: string;
  containerClassName?: string;
  roundedClassName?: string;
  onLoad?: React.ComponentProps<'img'>['onLoad'];
};

export default function ImgSkeleton({
  alt = '',
  containerClassName = '',
  roundedClassName = 'rounded-app',
  className,
  onLoad,
  ...img
}: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden ${roundedClassName} ${containerClassName}`}
    >
      {/* decorative skeleton */}
      <div
        aria-hidden
        className={`absolute inset-0 bg-ink/10 animate-pulse transition-opacity duration-300 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <Image
        {...img}
        alt={alt}
        className={`object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className ?? ''}`}
        // Fires after the image is decoded and painted — smoother than onLoad
        onLoadingComplete={() => setLoaded(true)}
        // Keep onLoad if you need it for other callers
        onLoad={(e) => {
          onLoad?.(e);
        }}
      />
    </div>
  );
}
