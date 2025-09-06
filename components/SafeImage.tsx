import React, { useMemo, useState } from 'react';

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string | string[];
}

// Renders an <img> that automatically falls back to provided sources when loading fails.
// Example:
// <SafeImage src="/primary.png" fallbackSrc={["/secondary.svg", "/image-fallback.svg"]} />
const SafeImage: React.FC<SafeImageProps> = ({ src, fallbackSrc, alt = '', loading = 'lazy', onError, ...rest }) => {
  const sources = useMemo(() => {
    const list = [src].concat(Array.isArray(fallbackSrc) ? fallbackSrc : fallbackSrc ? [fallbackSrc] : []);
    // Remove falsy and duplicates while preserving order
    return list.filter(Boolean).filter((s, i, a) => a.indexOf(s) === i) as string[];
  }, [src, fallbackSrc]);

  const [index, setIndex] = useState(0);

  const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    if (onError) onError(e);
    if (index < sources.length - 1) {
      setIndex(index + 1);
    }
  };

  const currentSrc = sources.length > 0 ? sources[index] : undefined;

  return (
    <img
      {...rest}
      alt={alt}
      loading={loading as any}
      src={currentSrc}
      onError={handleError}
    />
  );
};

export default SafeImage;

