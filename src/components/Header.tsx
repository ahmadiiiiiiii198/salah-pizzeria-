import React, { useState, useEffect } from 'react';
import { ShoppingCart, Pizza, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import LanguageSelector from '@/components/LanguageSelector';
import OrderOptionsModal from './OrderOptionsModal';
import { useSimpleCart } from '@/hooks/use-simple-cart';
import SimpleCart from './SimpleCart';
import ProductSearch from './ProductSearch';
import MobileSearchModal from './MobileSearchModal';
import { useLanguage } from '@/hooks/use-language';
import CustomerAccountWidget from './customer/CustomerAccountWidget';
import logoImage from '@/assets/logo.png';
import { useNavbarLogoSettings } from '@/hooks/use-settings';


const Header = () => {
  const { getTotalItems, openCart } = useSimpleCart();
  const { t } = useLanguage();
  const [navbarLogoSettings, , isNavbarLogoLoading] = useNavbarLogoSettings();

  // DEBUG: Log navbar logo settings
  useEffect(() => {
    console.log('🔍 [Header] Logo settings changed:', {
      logoUrl: navbarLogoSettings.logoUrl,
      altText: navbarLogoSettings.altText,
      showLogo: navbarLogoSettings.showLogo,
      logoSize: navbarLogoSettings.logoSize,
      isLoading: isNavbarLogoLoading
    });
  }, [navbarLogoSettings, isNavbarLogoLoading]);

  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full bg-white shadow-lg border-b border-gray-200 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3 logo-container hover-elegant-glow">
                {/* Database-driven logo display */}
                {navbarLogoSettings.showLogo && !isNavbarLogoLoading && (
                  <img
                    src={navbarLogoSettings.logoUrl}
                    alt={navbarLogoSettings.altText}
                    className={`transition-all duration-500 hover-gentle-scale animate-gentle-float ${
                      navbarLogoSettings.logoSize === 'small' ? 'h-16 w-auto' :
                      navbarLogoSettings.logoSize === 'large' ? 'h-28 w-auto' :
                      'h-24 w-auto'
                    }`}
                    onLoad={() => console.log('✅ Header logo loaded successfully')}
                    onError={(e) => {
                      console.error('❌ Header logo failed to load:', e);
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                )}

                {/* Loading placeholder */}
                {isNavbarLogoLoading && (
                  <div className={`bg-gray-200 animate-skeleton-loading rounded-xl ${
                    navbarLogoSettings.logoSize === 'small' ? 'h-16 w-16' :
                    navbarLogoSettings.logoSize === 'large' ? 'h-28 w-28' :
                    'h-24 w-24'
                  }`}></div>
                )}

                {/* Fallback text logo */}
                <div className="h-12 hidden items-center px-4 bg-gradient-to-r from-efes-gold to-efes-dark-gold text-white rounded-xl font-fredoka font-bold text-lg shadow-lg animate-subtle-glow hover-elegant-glow">
                  🥙 EFES KEBAP
                </div>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="/" className="text-gray-700 hover:text-efes-gold transition-all duration-300 font-medium relative group hover-elegant-glow">
                  {t('home')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-efes-gold to-efes-dark-gold transition-all duration-500 group-hover:w-full"></span>
                </a>
                <a href="/#products" className="text-gray-700 hover:text-efes-gold transition-all duration-300 font-medium relative group hover-elegant-glow">
                  {t('menu')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-efes-gold to-efes-dark-gold transition-all duration-500 group-hover:w-full"></span>
                </a>
                <a href="/#gallery" className="text-gray-700 hover:text-efes-gold transition-all duration-300 font-medium relative group hover-elegant-glow">
                  {t('gallery')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-efes-gold to-efes-dark-gold transition-all duration-500 group-hover:w-full"></span>
                </a>
                <a href="/#about" className="text-gray-700 hover:text-efes-gold transition-all duration-300 font-medium relative group hover-elegant-glow">
                  {t('about')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-efes-gold to-efes-dark-gold transition-all duration-500 group-hover:w-full"></span>
                </a>
                <a href="/#contact" className="text-gray-700 hover:text-efes-gold transition-all duration-300 font-medium relative group hover-elegant-glow">
                  {t('contact')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-efes-gold to-efes-dark-gold transition-all duration-500 group-hover:w-full"></span>
                </a>
              </nav>
            </div>

            {/* Search Component - Hidden on mobile */}
            <div className="hidden lg:block flex-1 max-w-md mx-8 animate-fade-in-up animate-stagger-3">
              <ProductSearch
                placeholder="Cerca pizze, bevande..."
                compact={true}
                onProductSelect={(product) => {
                  console.log('🔍 Product selected from search:', product);
                  // Scroll to products section
                  const productsSection = document.getElementById('products');
                  if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              />
            </div>

            <div className="flex items-center space-x-4 animate-fade-in-right">
              {/* Mobile Search Button */}
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(true)}
                className="lg:hidden p-2 text-white hover:text-amber-100 transition-colors bg-white/20 hover:bg-white/30 rounded-full animate-scale-in animate-stagger-1"
                aria-label="Cerca prodotti"
                title="Cerca prodotti"
              >
                <Search size={20} />
              </button>

              <div className="animate-scale-in animate-stagger-1">
                <CustomerAccountWidget />
              </div>
              <div className="animate-scale-in animate-stagger-1">
                <LanguageSelector />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('🍕 Order button clicked, opening modal...');
                  try {
                    setIsOrderModalOpen(true);
                  } catch (error) {
                    console.error('❌ Error opening order modal:', error);
                  }
                }}
                className="hidden sm:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-efes-gold to-efes-dark-gold text-white rounded-lg hover:shadow-lg hover-elegant-glow transition-all duration-500 font-bold font-montserrat border border-efes-light-gold/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-efes-gold focus:ring-offset-2 animate-button-pulse ripple-effect animate-elegant-scale-in animate-stagger-3"
                aria-label="Ordina ora"
                title="Ordina ora"
              >
                <Pizza size={18} className="animate-wiggle" />
                🥙 {t('makeReservation')}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('🛒 Cart button clicked, opening cart...');
                  try {
                    openCart();
                  } catch (error) {
                    console.error('❌ Error opening cart:', error);
                  }
                }}
                className="relative p-3 text-white hover:text-amber-100 transition-all duration-500 bg-white/20 hover:bg-white/30 rounded-full group shadow-md hover:shadow-lg hover-elegant-glow animate-gentle-float animate-elegant-scale-in animate-stagger-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 glass-morphism"
                aria-label={`Apri carrello (${getTotalItems()} articoli)`}
                title={`Carrello (${getTotalItems()} articoli)`}
              >
                <ShoppingCart size={20} className="group-hover:animate-wiggle" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs rounded-full flex items-center justify-center font-inter font-semibold shadow-md animate-heartbeat">
                  {getTotalItems()}
                </span>
                <Pizza className="absolute -bottom-1 -right-1 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce animate-float" size={12} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <OrderOptionsModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
      <MobileSearchModal
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
      />
      <SimpleCart />
    </>
  );
};

export default Header;
