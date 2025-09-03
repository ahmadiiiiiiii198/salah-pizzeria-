/**
 * Cache Busting Utility
 * Helps clear various types of caches when data is updated
 */

export class CacheBuster {
  /**
   * Clear all opening hours related caches
   */
  static clearOpeningHoursCache(): void {
    console.log('🗑️ [CacheBuster] Clearing opening hours caches...');
    
    // Clear localStorage items
    const itemsToClear = [
      'cachedOpeningHours',
      'heroContent',
      'contactContent',
      'businessHours',
      'opening_hours'
    ];
    
    itemsToClear.forEach(item => {
      localStorage.removeItem(item);
    });
    
    // Clear sessionStorage items
    sessionStorage.removeItem('cachedOpeningHours');
    sessionStorage.removeItem('heroContent');
    
    console.log('✅ [CacheBuster] Opening hours caches cleared');
  }

  /**
   * Clear service worker cache for specific URLs
   */
  static async clearServiceWorkerCache(urls?: string[]): Promise<void> {
    if ('serviceWorker' in navigator && 'caches' in window) {
      try {
        const cacheNames = await caches.keys();
        
        for (const cacheName of cacheNames) {
          if (urls && urls.length > 0) {
            // Clear specific URLs from cache
            const cache = await caches.open(cacheName);
            for (const url of urls) {
              await cache.delete(url);
            }
          } else {
            // Clear entire cache
            await caches.delete(cacheName);
          }
        }
        
        console.log('✅ [CacheBuster] Service worker cache cleared');
      } catch (error) {
        console.error('❌ [CacheBuster] Error clearing service worker cache:', error);
      }
    }
  }

  /**
   * Force reload the page to clear all caches
   */
  static forceReload(): void {
    console.log('🔄 [CacheBuster] Force reloading page...');
    window.location.reload();
  }

  /**
   * Clear all application caches
   */
  static async clearAllCaches(): Promise<void> {
    console.log('🗑️ [CacheBuster] Clearing all application caches...');
    
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear service worker cache
    await this.clearServiceWorkerCache();
    
    // Clear optimized settings service cache if available
    if ((window as any).optimizedSettingsService) {
      (window as any).optimizedSettingsService.clearCache();
    }
    
    console.log('✅ [CacheBuster] All caches cleared');
  }

  /**
   * Add cache busting parameter to URL
   */
  static addCacheBustingParam(url: string): string {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}_cb=${Date.now()}`;
  }

  /**
   * Check if browser has cached data that might be stale
   */
  static hasPotentialStaleCache(): boolean {
    const cacheIndicators = [
      'cachedOpeningHours',
      'heroContent',
      'contactContent'
    ];
    
    return cacheIndicators.some(key => 
      localStorage.getItem(key) !== null || 
      sessionStorage.getItem(key) !== null
    );
  }

  /**
   * Show cache warning to user if stale cache detected
   */
  static showCacheWarningIfNeeded(): void {
    if (this.hasPotentialStaleCache()) {
      console.warn('⚠️ [CacheBuster] Potential stale cache detected');
      
      // You can add a toast notification here if needed
      if ((window as any).showToast) {
        (window as any).showToast({
          title: 'Cache Detected',
          description: 'If you see outdated information, try refreshing the page.',
          variant: 'warning'
        });
      }
    }
  }
}

// Export as default for easier importing
export default CacheBuster;

// Also expose globally for debugging
(window as any).CacheBuster = CacheBuster;
