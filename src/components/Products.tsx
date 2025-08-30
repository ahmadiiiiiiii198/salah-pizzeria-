import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Pizza, Sparkles, ChefHat, Users, ShoppingBag, Search, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import ProductCard from './ProductCard';
import OrderOptionsModal from './OrderOptionsModal';


import { Product, ProductsByCategory } from '@/types/category';
import { useStockManagement } from '@/hooks/useStockManagement';
import { useBusinessHoursContext } from '@/contexts/BusinessHoursContext';

const Products = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const { isProductAvailable } = useStockManagement();
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Get business hours for all product cards
  const {
    isOpen: businessIsOpen,
    message: businessMessage,
    validateOrderTime,
    formattedHours,
    todayHours
  } = useBusinessHoursContext();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Function to format business hours for availability display
  const formatAvailabilityHours = useCallback(() => {
    if (!formattedHours) return "Controlla i nostri orari di apertura";

    // Parse the formatted hours and create a more readable format
    const lines = formattedHours.split('\n');
    const openDays = lines
      .filter(line => !line.includes('Chiuso'))
      .map(line => {
        const [day, hours] = line.split(': ');
        const dayAbbr = day.substring(0, 3).toUpperCase();
        return { day: dayAbbr, hours };
      });

    if (openDays.length === 0) return "Attualmente chiuso";

    // Group consecutive days with same hours
    const groupedDays = [];
    let currentGroup = [openDays[0]];

    for (let i = 1; i < openDays.length; i++) {
      if (openDays[i].hours === currentGroup[0].hours) {
        currentGroup.push(openDays[i]);
      } else {
        groupedDays.push(currentGroup);
        currentGroup = [openDays[i]];
      }
    }
    groupedDays.push(currentGroup);

    // Format the display
    const formattedGroups = groupedDays.map(group => {
      const days = group.length > 1
        ? `${group[0].day}-${group[group.length - 1].day}`
        : group[0].day;
      const hours = group[0].hours.replace('-', ' alle ');
      return `${days} dalle ${hours}`;
    });

    return `Disponibile ${formattedGroups.join(', ')}`;
  }, [formattedHours]);
  const [productsContent, setProductsContent] = useState({
    heading: "I Nostri Piatti",
    subheading: "Autentico kebap turco e pizza italiana preparati con ingredienti freschi e tecniche tradizionali",
    backgroundImage: ""
  });

  // Load products content settings
  useEffect(() => {
    const loadProductsContent = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'productsContent')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading products content:', error);
          return;
        }

        if (data?.value) {
          setProductsContent(prev => ({
            ...prev,
            ...data.value
          }));
        }
      } catch (error) {
        console.error('Error loading products content:', error);
      }
    };

    loadProductsContent();
  }, []);

  // Use React Query for products loading with caching
  const { data: products = {}, isLoading, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<ProductsByCategory> => {
      console.log('🍕 [PRODUCTS-QUERY] Loading products with React Query...');
      const startTime = Date.now();

      const { data: productsData, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug,
            extras_enabled
          )
        `)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('🍕 [PRODUCTS-QUERY] Error:', error);
        throw error;
      }

      // Group products by category slug
      const groupedProducts: ProductsByCategory = {};

      productsData?.forEach((product) => {
        const categorySlug = product.categories?.slug || 'uncategorized';
        if (!groupedProducts[categorySlug]) {
          groupedProducts[categorySlug] = [];
        }

        // Transform database product to frontend format
        const transformedProduct: Product = {
          ...product,
          category: product.categories?.name || 'Uncategorized',
          category_slug: categorySlug,
          is_available: product.is_active && isProductAvailable(product.stock_quantity),
          images: product.gallery ? (Array.isArray(product.gallery) ? product.gallery : [product.image_url].filter(Boolean)) : [product.image_url].filter(Boolean)
        };

        groupedProducts[categorySlug].push(transformedProduct);
      });

      const queryTime = Date.now() - startTime;
      console.log(`🍕 [PRODUCTS-QUERY] Completed in ${queryTime}ms, found ${Object.values(groupedProducts).flat().length} products`);

      return groupedProducts;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Use React Query for content sections
  const { data: contentData } = useQuery({
    queryKey: ['content-sections', 'products'],
    queryFn: async () => {
      console.log('🍕 [CONTENT-QUERY] Loading content sections...');

      const { data, error } = await supabase
        .from('content_sections')
        .select('section_key, content_value')
        .in('section_key', ['products_heading', 'products_subheading'])
        .eq('is_active', true);

      if (error) {
        console.warn('🍕 [CONTENT-QUERY] Error loading content, using defaults:', error);
        return null;
      }

      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });

  // Set heading and subheading from content data
  const heading = useMemo(() => {
    const headingData = contentData?.find(item => item.section_key === 'products_heading');
    return headingData?.content_value || "I Nostri Piatti";
  }, [contentData]);

  const subheading = useMemo(() => {
    const subheadingData = contentData?.find(item => item.section_key === 'products_subheading');
    return subheadingData?.content_value || "Autentico kebap turco e pizza italiana preparati con ingredienti freschi e tecniche tradizionali";
  }, [contentData]);

  // Update search active state when search term changes
  useEffect(() => {
    setIsSearchActive(!!searchTerm.trim());
  }, [searchTerm]);

  // Memoized filtered products to prevent unnecessary re-calculations
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products;
    } else {
      const filtered: ProductsByCategory = {};

      Object.entries(products).forEach(([categorySlug, categoryProducts]) => {
        const matchingProducts = categoryProducts.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (matchingProducts.length > 0) {
          filtered[categorySlug] = matchingProducts;
        }
      });

      return filtered;
    }
  }, [searchTerm, products]);

  // Remove old loading functions - now using React Query

  // Memoized event handlers to prevent unnecessary re-renders
  const toggleCategoryExpansion = useCallback((categorySlug: string) => {
    console.log(`🔄 Toggling category expansion for: ${categorySlug}`);
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categorySlug)) {
        newSet.delete(categorySlug);
        console.log(`📉 Collapsed category: ${categorySlug}`);
      } else {
        newSet.add(categorySlug);
        console.log(`📈 Expanded category: ${categorySlug}`);
      }
      return newSet;
    });
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setIsSearchActive(false);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);



  // Memoized utility functions to prevent recreation on every render
  const getIconForCategory = useCallback((categorySlug: string) => {
    switch (categorySlug) {
      case 'semplici':
        return <Pizza className="text-efes-gold" size={28} />;
      case 'speciali':
        return <ChefHat className="text-efes-dark-gold" size={28} />;
      case 'extra':
        return <Sparkles className="text-green-600" size={28} />;
      default:
        return <Pizza className="text-efes-gold" size={28} />;
    }
  }, []);

  const getColorForCategory = useCallback((categorySlug: string) => {
    switch (categorySlug) {
      case 'semplici':
        return 'from-flegrea-gold-accent to-flegrea-burgundy';
      case 'speciali':
        return 'from-flegrea-burgundy to-flegrea-deep-red';
      case 'extra':
        return 'from-flegrea-deep-red to-flegrea-burgundy';
      default:
        return 'from-flegrea-gold-accent to-flegrea-burgundy';
    }
  }, []);

  // Category display names
  const getCategoryDisplayName = (categorySlug: string) => {
    switch (categorySlug) {
      case 'semplici':
        return 'SEMPLICI - Kebap & Pizze Classiche';
      case 'speciali':
        return 'SPECIALI - Kebap & Pizze Gourmet';
      case 'extra':
        return 'EXTRA - Toppings';
      case 'pizze-al-metro-per-4-5-persone':
        return 'Pizze al metro per 4-5 persone';
      default:
        return categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace('-', ' ');
    }
  };

  // Get category pricing information
  const getCategoryPricingInfo = (categorySlug: string) => {
    switch (categorySlug) {
      case 'pizze-al-metro-per-4-5-persone':
        return 'Prezzo chef, si stabilisce secondo i gusti';
      default:
        return null;
    }
  };

  console.log('🍕 [PRODUCTS-RENDER] Render state:', {
    isLoading,
    productsCount: Object.values(products).flat().length,
    filteredProductsCount: Object.values(filteredProducts).flat().length,
    searchTerm,
    isSearchActive
  });

  // Show error state
  if (productsError) {
    console.log('🍕 [PRODUCTS-RENDER] Showing error state:', productsError);
    return (
      <section id="products" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Oops! Qualcosa è andato storto</h2>
            <p className="text-lg text-gray-600 mb-8">Non riusciamo a caricare i nostri prodotti al momento. Riprova tra poco.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Ricarica la pagina
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    console.log('🍕 [PRODUCTS-RENDER] Showing loading state');
    return (
      <section id="products" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center animate-fade-in-up">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto animate-pulse-glow"></div>
            <p className="mt-4 text-gray-600 animate-bounce-gentle">Caricamento prodotti...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show all categories that have products, with preferred order for pizza categories
  // Exclude 'extra', 'extras', and 'bevande' categories as they should only appear in product customization
  const categoryOrder = ['semplici', 'speciali'];
  const excludedCategories = ['extra', 'extras', 'bevande', 'vini']; // Categories that should not appear in main menu
  const allCategoriesWithProducts = Object.keys(filteredProducts).filter(slug =>
    filteredProducts[slug] &&
    filteredProducts[slug].length > 0 &&
    !excludedCategories.includes(slug) // Exclude extras and beverages from main menu display
  );

  // Sort categories: preferred order first, then any others alphabetically
  const sortedCategories = [
    ...categoryOrder.filter(slug => allCategoriesWithProducts.includes(slug)),
    ...allCategoriesWithProducts.filter(slug => !categoryOrder.includes(slug)).sort()
  ];



  return (
    <>
      <div
        className="relative py-20"
        style={{
          backgroundImage: productsContent.backgroundImage
            ? `url(${productsContent.backgroundImage})`
            : 'url("/background01.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          width: '100%',
          filter: 'none',
          WebkitFilter: 'none',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          zIndex: 1
        }}
      >
        {/* Light overlay for text readability - removed to show background clearly */}
        <section id="products" className="relative">
          {/* Background decorations removed to show background image clearly */}

          {/* Floating pizza icons removed to show background clearly */}

        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center mb-12 animate-fade-in-up bg-efes-warm-white/95 backdrop-blur-sm rounded-2xl p-8 border border-efes-gold/20 shadow-xl">
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <Pizza className="text-efes-gold animate-pizza-spin" size={48} />
                <ChefHat className="text-efes-dark-gold animate-tomato-bounce" size={48} />
                <Pizza className="text-efes-bronze animate-pizza-spin animation-delay-2000" size={48} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-efes-dark-navy mb-6 font-oswald">
                🥙 {productsContent.heading}
              </h2>
            </div>
            <p className="text-xl text-efes-soft-gray max-w-2xl mx-auto font-raleway animate-fade-in-up animate-stagger-1">
              {productsContent.subheading}
            </p>
            <div className="flex items-center justify-center space-x-4 mt-4 text-efes-gold animate-fade-in-up animate-stagger-2">
              <Sparkles className="animate-wiggle" size={20} />
              <span className="font-pacifico text-lg">Tradizione turca e italiana</span>
              <Sparkles className="animate-wiggle animation-delay-2000" size={20} />
            </div>
          </div>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-12 animate-fade-in-up animate-stagger-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-pizza-brown/60" />
              </div>
              <input
                type="text"
                placeholder="Cerca pizze, bevande, dolci... 🔍"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-12 py-4 bg-white/95 border-2 border-pizza-orange/20 rounded-2xl text-pizza-dark placeholder-pizza-brown/60 focus:outline-none focus:border-pizza-orange focus:ring-4 focus:ring-pizza-orange/20 transition-all duration-300 shadow-lg hover:shadow-xl font-roboto text-lg"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-pizza-brown/60 hover:text-pizza-red transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Search Results Info */}
            {isSearchActive && (
              <div className="mt-4 text-center">
                <p className="text-pizza-brown font-roboto">
                  {Object.keys(filteredProducts).length === 0 ? (
                    <span className="text-pizza-red">
                      🔍 Nessun risultato trovato per "{searchTerm}"
                    </span>
                  ) : (
                    <span className="text-pizza-green">
                      ✨ Trovati {Object.values(filteredProducts).flat().length} prodotti per "{searchTerm}"
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Category Sections - EFES KEBAP Theme with Collapsible Design */}
          <div className="space-y-4">
            {/* Availability Status */}
            <div className="bg-efes-dark-navy rounded-lg p-4 flex items-center justify-between border border-efes-gold/20">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${businessIsOpen ? 'bg-green-500' : 'bg-efes-gold'} ${businessIsOpen ? '' : 'animate-pulse'}`}></div>
                <span className="text-efes-warm-white text-sm font-raleway">
                  {formatAvailabilityHours()}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium font-montserrat ${
                businessIsOpen
                  ? 'bg-green-600 text-white'
                  : 'bg-efes-charcoal text-efes-warm-white'
              }`}>
                {businessIsOpen ? 'DISPONIBILE' : 'NON DISPONIBILE'}
              </span>
            </div>

            {sortedCategories.length === 0 ? (
              <div className="text-center py-12">
                <Pizza className="h-16 w-16 text-efes-soft-gray mx-auto mb-4" />
                <p className="text-efes-soft-gray font-raleway">Nessun prodotto disponibile al momento.</p>
                <p className="text-sm text-efes-soft-gray mt-2 font-raleway">
                  Aggiungi prodotti dal pannello admin per visualizzarli qui.
                </p>
              </div>
            ) : (
              sortedCategories.map((categorySlug, categoryIndex) => {
              const categoryProducts = filteredProducts[categorySlug] || [];
              const displayName = getCategoryDisplayName(categorySlug);
              const icon = getIconForCategory(categorySlug);
              const isExpanded = expandedCategories.has(categorySlug);

              if (categoryProducts.length === 0) return null;

              return (
                <div
                  key={categorySlug}
                  className="bg-efes-dark-navy rounded-lg overflow-hidden border border-efes-gold/20 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {/* Category Header - Clickable */}
                  <button
                    onClick={() => toggleCategoryExpansion(categorySlug)}
                    className="w-full p-4 flex items-center justify-between hover:bg-efes-charcoal/50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-efes-gold p-2 bg-efes-gold/10 rounded-lg">
                        {icon}
                      </div>
                      <div className="text-left">
                        <h3 className="text-efes-warm-white font-semibold text-lg font-oswald">
                          {displayName}
                        </h3>
                        <p className="text-efes-soft-gray text-sm font-raleway">
                          {getCategoryPricingInfo(categorySlug)}
                        </p>
                      </div>
                    </div>
                    <div className="text-efes-gold">
                      <svg
                        className={`w-5 h-5 transform transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Collapsible Products Section */}
                  {isExpanded && (
                    <div className="border-t border-efes-gold/20 p-4 bg-efes-charcoal/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryProducts.map((product, productIndex) => (
                          <div
                            key={product.id}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${productIndex * 100}ms` }}
                          >
                            <ProductCard
                              product={product}
                              businessIsOpen={businessIsOpen}
                              businessMessage={businessMessage}
                              validateOrderTime={validateOrderTime}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
            )}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center animate-slide-in-up animate-stagger-5">
            <div className="bg-gradient-to-br from-pizza-cream/50 via-white to-pizza-orange/10 rounded-2xl p-8 border border-pizza-orange/20 hover-lift animate-pulse-glow">
              <div className="flex items-center justify-center mb-4">
                <Pizza className="text-pizza-red animate-pizza-spin mr-3" size={32} />
                <h3 className="text-2xl font-bold text-pizza-dark font-fredoka animate-fade-in-up">
                  🍕 Vuoi una Pizza Personalizzata?
                </h3>
                <Pizza className="text-pizza-orange animate-pizza-spin ml-3 animation-delay-2000" size={32} />
              </div>
              <p className="text-pizza-brown mb-6 font-roboto text-lg animate-fade-in-up animate-stagger-1">
                Chiamaci per pizze su misura ed eventi speciali per le tue feste!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-stagger-2">
                <button
                  onClick={() => setIsOrderModalOpen(true)}
                  className="bg-gradient-to-r from-pizza-red to-pizza-orange text-white px-8 py-4 rounded-full hover:from-pizza-red hover:to-pizza-tomato transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover-glow animate-heartbeat font-fredoka font-bold text-lg"
                >
                  Richiedi Preventivo Personalizzato
                </button>
                <button
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="border-2 border-emerald-500 text-emerald-600 px-8 py-3 rounded-full hover:bg-emerald-50 transition-all duration-300 hover-lift animate-bounce-gentle"
                >
                  Contattaci
                </button>
              </div>
            </div>
          </div>
        </div>
        </section>
      </div>

      {/* Order Options Modal */}
      <OrderOptionsModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </>
  );
};

export default Products;
