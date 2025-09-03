import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CacheBuster from '@/utils/cacheBuster';

interface CacheClearButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showText?: boolean;
  className?: string;
}

const CacheClearButton: React.FC<CacheClearButtonProps> = ({
  variant = 'outline',
  size = 'sm',
  showText = true,
  className = ''
}) => {
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

  const handleClearCache = async () => {
    setIsClearing(true);
    
    try {
      // Clear opening hours specific cache
      CacheBuster.clearOpeningHoursCache();
      
      // Clear service worker cache for main pages
      await CacheBuster.clearServiceWorkerCache([
        '/',
        '/admin',
        '/ordini'
      ]);
      
      toast({
        title: '✅ Cache Cleared',
        description: 'Page cache has been cleared. Refreshing...',
        duration: 2000,
      });
      
      // Wait a moment then reload
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast({
        title: '❌ Error',
        description: 'Failed to clear cache completely',
        variant: 'destructive',
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClearCache}
      disabled={isClearing}
      className={`${className} ${isClearing ? 'opacity-50' : ''}`}
      title="Clear cache and refresh page"
    >
      {isClearing ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
      {showText && (
        <span className="ml-2">
          {isClearing ? 'Clearing...' : 'Clear Cache'}
        </span>
      )}
    </Button>
  );
};

export default CacheClearButton;
