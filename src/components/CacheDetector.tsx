import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import CacheBuster from '@/utils/cacheBuster';

/**
 * Component that detects potential cache issues and warns users
 */
const CacheDetector: React.FC = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Check for potential cache issues on mount
    const checkCache = () => {
      if (CacheBuster.hasPotentialStaleCache()) {
        console.warn('⚠️ [CacheDetector] Potential stale cache detected');
        
        // Show warning toast after a delay to not interfere with page load
        setTimeout(() => {
          toast({
            title: '⚠️ Cache Detected',
            description: 'If you see outdated opening hours, try refreshing the page (Ctrl+F5).',
            duration: 8000,
            variant: 'default',
          });
        }, 2000);
      }
    };

    // Check cache on mount
    checkCache();

    // Also check when the page becomes visible (user switches back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkCache();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [toast]);

  // This component doesn't render anything visible
  return null;
};

export default CacheDetector;
