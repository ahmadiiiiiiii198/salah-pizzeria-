import React, { useState, useEffect } from 'react';
import { Pizza, ChefHat, Clock, Star, Camera, Phone } from 'lucide-react';
import { usePizzeriaHours } from '@/hooks/usePizzeriaHours';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';

// Hardcoded hero content - no database fetching
const HARDCODED_HERO_CONTENT = {
  welcomeMessage: "BENVENUTI DA EFES KEBAP",
  pizzaType: "KEBAP",
  subtitle: "Autentico kebap turco e pizza italiana nel cuore di Torino",
  openingHours: "APERTO 7 SU 7 DALLE 19",
  buttonText: "ORDINA ORA",
  backgroundImage: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Turkish kebab background
  heroImage: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" // Delicious kebab image
};

const Hero = () => {
  const { displayText, allHours, isLoading: hoursLoading } = usePizzeriaHours();
  const { isAuthenticated, user } = useCustomerAuth();

  // Use hardcoded content instead of database
  const heroContent = HARDCODED_HERO_CONTENT;
  const heroLoading = false;

  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [backgroundImageLoaded, setBackgroundImageLoaded] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Detect iOS devices
  useEffect(() => {
    const detectIOS = () => {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
             (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    };
    setIsIOS(detectIOS());
  }, []);

  // Preload background image for better performance
  useEffect(() => {
    if (heroContent.backgroundImage) {
      const img = new Image();
      img.onload = () => {
        console.log('🖼️ [Hero] Background image preloaded successfully');
        setBackgroundImageLoaded(true);
      };
      img.onerror = () => {
        console.warn('⚠️ [Hero] Background image failed to preload');
        setBackgroundImageLoaded(false);
      };
      img.src = heroContent.backgroundImage;
    }
  }, []);

  // Combine loading states
  const isLoading = heroLoading || hoursLoading;

  // Debug logging for hero content
  useEffect(() => {
    console.log('🍕 [Hero] Using hardcoded hero content:', heroContent);
    console.log('🖼️ [Hero] Background image:', heroContent.backgroundImage);
    console.log('✅ [Hero] Using hardcoded image (no database)');
    console.log('📱 [Hero] Is iOS device:', isIOS);
    console.log('🖼️ [Hero] Background image loaded:', backgroundImageLoaded);
  }, [isIOS, backgroundImageLoaded]);

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

  // Show loading skeleton while data is being fetched
  if (isLoading) {
    return (
      <section className="relative h-[70vh] overflow-x-hidden hero-container-mobile">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-pizza-red/20 via-pizza-orange/10 to-pizza-cheese/20"></div>

        {/* Loading skeleton */}
        <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[50vh]">

            {/* Left Column Skeleton */}
            <div className="text-center lg:text-left space-y-8">
              {/* Content loading skeleton */}
              <div className="flex justify-center lg:justify-start mb-8">
                <div className="h-32 w-96 bg-gradient-to-br from-red-100 to-orange-100 rounded-3xl animate-pulse flex items-center justify-center">
                  <Pizza className="text-red-400 animate-float" size={64} />
                </div>
              </div>

              {/* Text skeleton */}
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-1/2"></div>
              </div>

              {/* Hours skeleton */}
              <div className="bg-gradient-to-br from-pizza-red/90 to-pizza-orange/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
                <div className="text-center">
                  <div className="text-5xl mb-4">⏰</div>
                  <div className="h-6 bg-white/20 rounded animate-pulse mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                    <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                    <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="relative">
              <div className="h-96 md:h-[500px] bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl animate-pulse flex items-center justify-center">
                <Pizza className="text-red-400 animate-float" size={64} />
                <div className="ml-4 text-red-600 font-semibold">
                  Caricamento...
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Loading indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-pizza-red rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-pizza-orange rounded-full animate-bounce animation-delay-200"></div>
            <div className="w-2 h-2 bg-pizza-cheese rounded-full animate-bounce animation-delay-400"></div>
            <span className="text-white text-sm ml-2">Caricamento contenuto...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden hero-container-mobile"
      style={{
        minHeight: '70vh',
        height: '70vh',
        maxHeight: '70vh',
        // Only apply iOS viewport fix on mobile devices
        ...(window.innerWidth <= 768 && {
          minHeight: 'calc(var(--vh, 1vh) * 70)',
          height: 'calc(var(--vh, 1vh) * 70)',
          maxHeight: 'calc(var(--vh, 1vh) * 70)'
        }),
        background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${heroContent.backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
        WebkitBackgroundSize: 'cover',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)'
      }}
    >

      {/* Debug info for mobile */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ position: 'fixed', top: '100px', left: '10px', zIndex: 1000, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '10px', fontSize: '12px' }}>
          Mobile Hero Debug:<br/>
          Image: {heroContent.backgroundImage ? '✅' : '❌'}<br/>
          Hardcoded: ✅ (No Database)<br/>
          iOS Device: {isIOS ? '✅' : '❌'}<br/>
          BG Loaded: {backgroundImageLoaded ? '✅' : '❌'}<br/>
          BG Method: Hardcoded IMG element
        </div>
      )}

      {/* Simplified decorative elements for better mobile performance */}
      <div className="absolute inset-0 opacity-10 z-10 hidden md:block">
        <div className="absolute top-20 left-10 w-8 h-8 bg-orange-400 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-10 h-10 bg-red-400 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 pt-20 relative z-20" style={{ paddingBottom: 0, marginBottom: 0 }}>
        <div className="grid grid-cols-1 gap-8 items-center min-h-[50vh] hero-main-grid">

          {/* Center Column - Content Only */}
          <div className="text-center space-y-8">
            {/* Content area - hero image removed, background image now handles visual appeal */}
          </div>

          {/* Hero image section removed for better mobile performance */}
        </div>

        {/* Bottom Section - Modern Hero Design */}
        <div className="text-center z-10 relative max-w-6xl mx-auto px-4 space-y-8 mt-8">
          {/* Main Title Section */}
          <div className="space-y-8">
            {/* Welcome Message - Dynamic from Admin */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide leading-none transform hover:scale-105 transition-all duration-500 font-sans uppercase">
                <span className="relative inline-block">
                  {heroContent.welcomeMessage || 'BENVENUTI DA FLEGREA'}
                  <div className="absolute -inset-2 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-xl blur-lg opacity-50"></div>
                </span>
              </h1>
            </div>

            {/* Pizza Type - Dynamic Elegant Script Typography */}
            <div className="relative mb-6">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif italic text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text font-bold tracking-wide drop-shadow-2xl">
                {heroContent.pizzaType || 'la Pizza Napoletana'}
              </h2>
              <div className="absolute inset-0 text-5xl md:text-7xl lg:text-8xl font-serif italic text-yellow-400/20 blur-sm">
                {heroContent.pizzaType || 'la Pizza Napoletana'}
              </div>
            </div>

            {/* Subtitle - Dynamic */}
            <h3 className="text-2xl md:text-3xl lg:text-4xl text-white/90 font-light tracking-wide mb-6 drop-shadow-lg">
              {heroContent.subtitle || 'ad Alta Digeribilità, anche Gluten Free!'}
            </h3>

            {/* Opening Hours - Dynamic Modern Card Design */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-black/50 to-black/30 backdrop-blur-xl rounded-2xl px-8 py-4 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <div className="text-2xl animate-pulse">🕐</div>
                <p className="text-white text-lg md:text-xl font-medium tracking-wide">
                  {heroContent.openingHours || 'APERTO 7 SU 7 DALLE 19'}
                </p>
              </div>
            </div>
          </div>

          {/* Feature Pills removed */}

          {/* Info Cards removed */}

          {/* Action Buttons - Simplified for Performance */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            {/* Primary CTA - Order Now */}
            <button
              onClick={() => {
                const productsSection = document.getElementById('products');
                if (productsSection) {
                  productsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors duration-300 shadow-lg"
            >
              <span className="flex items-center justify-center gap-3">
                <Pizza size={24} />
                <span>{heroContent.buttonText || 'ORDINA ORA'}</span>
              </span>
            </button>

            {/* Secondary CTA - Call Now */}
            <button
              onClick={() => {
                window.open('tel:+393479190907', '_self');
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors duration-300 shadow-lg"
            >
              <span className="flex items-center justify-center gap-3">
                <Phone size={24} />
                <span>📞 CHIAMA ORA</span>
              </span>
            </button>

            {/* Tertiary CTA - Gallery */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                try {
                  const gallerySection = document.getElementById('gallery');
                  if (gallerySection) {
                    gallerySection.scrollIntoView({ behavior: 'smooth' });
                  }
                } catch (error) {
                  // Handle error silently
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors duration-300 shadow-lg"
            >
              <span className="flex items-center justify-center gap-3">
                <Camera size={24} />
                <span>📸 GALLERIA</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
