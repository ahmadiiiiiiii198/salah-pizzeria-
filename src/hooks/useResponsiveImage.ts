import { useState, useEffect, useMemo } from 'react';

interface ResponsiveImageOptions {
  src: string;
  sizes?: number[];
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  fallback?: string;
}

interface ResponsiveImageResult {
  src: string;
  srcSet: string;
  sizes: string;
  placeholder: string;
  isLoading: boolean;
  error: string | null;
}

const DEFAULT_SIZES = [320, 640, 768, 1024, 1280, 1920];
const DEFAULT_QUALITY = 80;

export const useResponsiveImage = ({
  src,
  sizes = DEFAULT_SIZES,
  quality = DEFAULT_QUALITY,
  format = 'auto',
  fallback = '/placeholder.svg'
}: ResponsiveImageOptions): ResponsiveImageResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate optimized URLs for different sizes
  const generateOptimizedUrl = (baseSrc: string, width: number, targetFormat?: string) => {
    if (!baseSrc) return fallback;

    // Handle Unsplash images
    if (baseSrc.includes('unsplash.com')) {
      const baseUrl = baseSrc.split('?')[0];
      const params = new URLSearchParams();
      params.set('w', width.toString());
      params.set('q', quality.toString());
      params.set('auto', 'format');
      params.set('fit', 'crop');
      
      if (targetFormat && targetFormat !== 'auto') {
        params.set('fm', targetFormat);
      }
      
      return `${baseUrl}?${params.toString()}`;
    }

    // Handle Supabase storage images
    if (baseSrc.includes('supabase.co')) {
      // For now, return as-is since Supabase doesn't have built-in image optimization
      // In the future, you could implement a transformation service
      return baseSrc;
    }

    // Handle local images
    if (baseSrc.startsWith('/')) {
      // For local images, we'll rely on the build-time optimization
      return baseSrc;
    }

    return baseSrc;
  };

  // Generate srcSet string
  const srcSet = useMemo(() => {
    if (!src || error) return '';

    return sizes
      .map(width => {
        const url = generateOptimizedUrl(src, width, format === 'auto' ? undefined : format);
        return `${url} ${width}w`;
      })
      .join(', ');
  }, [src, sizes, quality, format, error]);

  // Generate sizes attribute
  const sizesAttr = useMemo(() => {
    return sizes
      .map((width, index) => {
        if (index === sizes.length - 1) {
          return `${width}px`;
        }
        return `(max-width: ${width}px) ${width}px`;
      })
      .join(', ');
  }, [sizes]);

  // Generate main src (largest size)
  const mainSrc = useMemo(() => {
    if (!src || error) return fallback;
    
    const largestSize = Math.max(...sizes);
    return generateOptimizedUrl(src, largestSize, format === 'auto' ? undefined : format);
  }, [src, sizes, quality, format, error, fallback]);

  // Generate placeholder (smallest size, low quality)
  const placeholder = useMemo(() => {
    if (!src) return fallback;
    
    const smallestSize = Math.min(...sizes);
    return generateOptimizedUrl(src, smallestSize, 'webp');
  }, [src, sizes, fallback]);

  // Preload the main image
  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const img = new Image();
    
    img.onload = () => {
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setError('Failed to load image');
      setIsLoading(false);
    };

    img.src = mainSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [mainSrc]);

  return {
    src: mainSrc,
    srcSet,
    sizes: sizesAttr,
    placeholder,
    isLoading,
    error
  };
};

// Hook for detecting WebP support
export const useWebPSupport = () => {
  const [supportsWebP, setSupportsWebP] = useState<boolean | null>(null);

  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      
      const dataURL = canvas.toDataURL('image/webp');
      setSupportsWebP(dataURL.indexOf('data:image/webp') === 0);
    };

    checkWebPSupport();
  }, []);

  return supportsWebP;
};

// Hook for detecting AVIF support
export const useAVIFSupport = () => {
  const [supportsAVIF, setSupportsAVIF] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAVIFSupport = async () => {
      try {
        const avifData = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
        
        const img = new Image();
        const promise = new Promise<boolean>((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
        });
        
        img.src = avifData;
        const result = await promise;
        setSupportsAVIF(result);
      } catch {
        setSupportsAVIF(false);
      }
    };

    checkAVIFSupport();
  }, []);

  return supportsAVIF;
};
