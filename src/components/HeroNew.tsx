import React, { useState, useEffect } from 'react';
import { Pizza, ChefHat } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { usePizzeriaHours } from '@/hooks/usePizzeriaHours';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { useHeroContent } from '@/hooks/use-settings';

const HeroNew = () => {
  const { t } = useLanguage();
  const { displayText, allHours, isLoading: hoursLoading } = usePizzeriaHours();
  const { isAuthenticated, user } = useCustomerAuth();
  
  // Use the proper hooks to load content from database
  const [heroContent, updateHeroContent, heroLoading] = useHeroContent();
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  // Listen for hero content updates from admin panel
  useEffect(() => {
    const handleHeroContentUpdate = (event: CustomEvent) => {
      console.log('🍕 [Hero] Received hero content update event:', event.detail);
      // Clear localStorage cache to force refresh
      try {
        localStorage.removeItem('heroContent_cache');
        localStorage.removeItem('heroContent_cache_timestamp');
        console.log('🧹 [Hero] Cleared hero content cache');
      } catch (e) {
        console.warn('⚠️ [Hero] Failed to clear cache:', e);
      }
      // Force a page refresh to show new background image
      setTimeout(() => {
        window.location.reload();
      }, 500);
    };

    window.addEventListener('heroContentUpdated', handleHeroContentUpdate as EventListener);

    return () => {
      window.removeEventListener('heroContentUpdated', handleHeroContentUpdate as EventListener);
    };
  }, []);

  // iOS viewport height fix for dynamic address bar - only on mobile
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isMobile || isIOS) {
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };

      setVH();
      window.addEventListener('resize', setVH);
      window.addEventListener('orientationchange', setVH);

      return () => {
        window.removeEventListener('resize', setVH);
        window.removeEventListener('orientationchange', setVH);
      };
    }
  }, []);

  // Combine loading states
  const isLoading = heroLoading || hoursLoading;

  // Show loading skeleton while data is being fetched
  if (isLoading) {
    return (
      <section className="relative w-full h-screen overflow-hidden" style={{ margin: 0, padding: 0 }}>

        
        {/* Loading skeleton */}
        <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24 h-full flex items-center justify-center">
          <div className="text-center">
            <Pizza className="text-efes-gold animate-spin mx-auto mb-4" size={64} />
            <div className="text-2xl font-bold text-efes-gold">Caricamento...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="hero-section relative w-full overflow-hidden"
      style={{
        margin: 0,
        padding: 0,
        height: '100vh',
        // Only apply iOS viewport fix on mobile devices
        ...(window.innerWidth <= 768 && { height: 'calc(var(--vh, 1vh) * 100)' }),
        backgroundImage: heroContent.backgroundImage ? `url('${heroContent.backgroundImage}')` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll', // Changed from 'fixed' to 'scroll' for iOS compatibility
        // iOS-specific optimizations
        WebkitBackgroundSize: 'cover',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)'
      }}
    >




      {/* Main content */}
      <div className="relative z-10 h-full flex items-center justify-center" style={{ paddingTop: 0 }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 items-center justify-center">
            
            {/* Main Content - Text Content */}
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              {/* Welcome Message */}
              <div>
                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wide leading-tight font-montserrat drop-shadow-2xl`}>
                  {heroContent.welcomeMessage || 'BENVENUTI DA EFES KEBAP'}
                </h1>
              </div>

              {/* Subtitle */}
              <div>
                <p className="text-lg md:text-xl lg:text-2xl text-white/95 max-w-2xl mx-auto leading-relaxed font-inter drop-shadow-lg">
                  Autentico kebap turco e pizza italiana nel cuore di Torino
                </p>
              </div>







              {/* CTA Buttons */}
              <div className="flex justify-center items-center">
                <button
                  onClick={() => {
                    const productsSection = document.getElementById('products');
                    if (productsSection) {
                      productsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-gradient-to-r from-efes-gold to-efes-dark-gold text-white px-10 py-4 rounded-lg font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-efes-light-gold/30"
                >
                  Ordina Ora
                </button>
              </div>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroNew;
