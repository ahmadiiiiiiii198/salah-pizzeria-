import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PictureProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: string;
  quality?: number;
}

const Picture: React.FC<PictureProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  sizes = '100vw',
  onLoad,
  onError,
  placeholder = '/placeholder.svg',
  quality = 80,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const pictureRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate WebP and fallback sources
  const generateSources = (baseSrc: string) => {
    if (!baseSrc || hasError) return { webp: '', fallback: placeholder };

    // For local images, check if WebP version exists
    if (baseSrc.startsWith('/')) {
      const pathParts = baseSrc.split('.');
      const extension = pathParts.pop();
      const basePath = pathParts.join('.');
      
      return {
        webp: `${basePath}.webp`,
        fallback: baseSrc,
        avif: `${basePath}.avif` // In case AVIF versions exist
      };
    }

    // For Unsplash images, generate optimized URLs
    if (baseSrc.includes('unsplash.com')) {
      const baseUrl = baseSrc.split('?')[0];
      const params = new URLSearchParams();
      
      if (width) params.set('w', width.toString());
      if (height) params.set('h', height.toString());
      params.set('q', quality.toString());
      params.set('auto', 'format');
      params.set('fit', 'crop');

      const webpParams = new URLSearchParams(params);
      webpParams.set('fm', 'webp');

      const avifParams = new URLSearchParams(params);
      avifParams.set('fm', 'avif');

      return {
        avif: `${baseUrl}?${avifParams.toString()}`,
        webp: `${baseUrl}?${webpParams.toString()}`,
        fallback: `${baseUrl}?${params.toString()}`
      };
    }

    // For other sources, return as-is
    return {
      webp: baseSrc,
      fallback: baseSrc
    };
  };

  // Generate responsive srcSet for different formats
  const generateSrcSet = (baseSrc: string, format?: string) => {
    if (!baseSrc || hasError) return '';

    const breakpoints = [320, 640, 768, 1024, 1280, 1920];
    
    if (baseSrc.includes('unsplash.com')) {
      const baseUrl = baseSrc.split('?')[0];
      
      return breakpoints
        .map(w => {
          const params = new URLSearchParams();
          params.set('w', w.toString());
          params.set('q', quality.toString());
          params.set('auto', 'format');
          params.set('fit', 'crop');
          
          if (format) params.set('fm', format);
          
          return `${baseUrl}?${params.toString()} ${w}w`;
        })
        .join(', ');
    }

    return baseSrc;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !pictureRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    observerRef.current.observe(pictureRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    console.warn(`Failed to load image: ${src}`);
    setHasError(true);
    onError?.();
  };

  const sources = generateSources(src);

  return (
    <div className={cn('relative overflow-hidden', className)} ref={pictureRef}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Picture element with multiple sources */}
      {isInView && (
        <picture>
          {/* AVIF source (best compression, modern browsers) */}
          {sources.avif && (
            <source
              srcSet={generateSrcSet(sources.avif, 'avif')}
              sizes={sizes}
              type="image/avif"
            />
          )}
          
          {/* WebP source (good compression, wide support) */}
          {sources.webp && (
            <source
              srcSet={generateSrcSet(sources.webp, 'webp')}
              sizes={sizes}
              type="image/webp"
            />
          )}
          
          {/* Fallback image */}
          <img
            src={sources.fallback}
            srcSet={generateSrcSet(sources.fallback)}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        </picture>
      )}
    </div>
  );
};

export default Picture;
