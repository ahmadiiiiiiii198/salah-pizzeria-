import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: string;
  blurDataURL?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  quality = 80,
  priority = false,
  sizes,
  onLoad,
  onError,
  placeholder = '/placeholder.svg',
  blurDataURL,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate responsive image sources
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc || hasError) return '';
    
    // For Unsplash images, generate different sizes
    if (baseSrc.includes('unsplash.com')) {
      const baseUrl = baseSrc.split('?')[0];
      const widths = [320, 640, 768, 1024, 1280, 1920];
      
      return widths
        .map(w => `${baseUrl}?w=${w}&q=${quality}&auto=format&fit=crop ${w}w`)
        .join(', ');
    }
    
    // For Supabase storage images, we can add query parameters for optimization
    if (baseSrc.includes('supabase.co')) {
      return baseSrc;
    }
    
    return baseSrc;
  };

  // Generate optimized src
  const generateOptimizedSrc = (baseSrc: string) => {
    if (!baseSrc || hasError) return placeholder;
    
    if (baseSrc.includes('unsplash.com')) {
      const baseUrl = baseSrc.split('?')[0];
      const params = new URLSearchParams();
      
      if (width) params.set('w', width.toString());
      if (height) params.set('h', height.toString());
      params.set('q', quality.toString());
      params.set('auto', 'format');
      params.set('fit', 'crop');
      
      return `${baseUrl}?${params.toString()}`;
    }
    
    return baseSrc;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

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

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority]);

  // Update current src when in view
  useEffect(() => {
    if (isInView && src && !hasError) {
      setCurrentSrc(generateOptimizedSrc(src));
    }
  }, [isInView, src, width, height, quality, hasError]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    console.warn(`Failed to load image: ${src}`);
    setHasError(true);
    setCurrentSrc(placeholder);
    onError?.();
  };

  const srcSet = generateSrcSet(src);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
          aria-hidden="true"
        />
      )}
      
      {/* Loading placeholder */}
      {!isLoaded && !blurDataURL && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={isInView ? currentSrc : ''}
        srcSet={isInView && srcSet ? srcSet : undefined}
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
    </div>
  );
};

export default OptimizedImage;
