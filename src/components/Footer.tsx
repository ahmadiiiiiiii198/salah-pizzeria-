
import React, { useState, useEffect } from 'react';
import { Pizza, ChefHat, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { supabase } from '@/integrations/supabase/client';
import CacheBuster from '@/utils/cacheBuster';



const Footer = () => {
  const { t } = useLanguage();
  const [contactHours, setContactHours] = useState<string>('');
  const [contactInfo, setContactInfo] = useState({
    address: 'C.so Giulio Cesare, 36, 10152 Torino TO',
    phone: '+393479190907',
    email: ''
  });
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: 'EFES KEBAP',
    description: 'Autentico kebap turco e pizza italiana nel cuore di Torino. Tradizione, qualità e passione in ogni piatto.'
  });

  // Load contact information from database
  useEffect(() => {
    const loadContactData = async () => {
      try {
        // Load contact content
        const { data: contactData, error: contactError } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'contactContent')
          .single();

        if (contactData?.value) {
          setContactInfo({
            address: contactData.value.address || 'C.so Giulio Cesare, 36, 10152 Torino TO',
            phone: contactData.value.phone || '+393479190907',
            email: contactData.value.email || ''
          });
        }

        // Load display hours from heroContent.openingHours with cache busting
        try {
          // Add cache busting parameter to force fresh data
          const cacheKey = `heroContent_${Date.now()}`;
          const { data: heroData, error: heroError } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'heroContent')
            .single();

          if (heroData?.value?.openingHours) {
            setContactHours(heroData.value.openingHours);
            console.log('✅ [Footer] Opening hours loaded from heroContent:', heroData.value.openingHours);
            console.log('✅ [Footer] Updated contactHours state to:', heroData.value.openingHours);

            // Clear any cached versions using cache buster
            CacheBuster.clearOpeningHoursCache();
          } else {
            setContactHours('APERTO 7 SU 7 DALLE 19'); // Fallback
            console.log('⚠️ [Footer] No opening hours in heroContent, using fallback');
            console.log('⚠️ [Footer] HeroData received:', heroData);
          }
        } catch (error) {
          console.error('❌ [Footer] Error loading opening hours:', error);
          setContactHours('APERTO 7 SU 7 DALLE 19'); // Fallback
        }

        // Load restaurant info
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'restaurantInfo')
          .single();

        if (restaurantData?.value) {
          setRestaurantInfo({
            name: restaurantData.value.name || 'EFES KEBAP',
            description: restaurantData.value.description || 'Autentico kebap turco e pizza italiana nel cuore di Torino. Tradizione, qualità e passione in ogni piatto.'
          });
        }
      } catch (error) {
        console.error('Failed to load contact data:', error);
      }
    };

    loadContactData();

    // Set up real-time listener for contact and restaurant info changes
    const timestamp = Date.now();
    const channelName = `footer-contact-updates-${timestamp}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'settings',
        filter: 'key=eq.contactContent'
      }, async (payload) => {
        console.log('🔔 [Footer] Real-time contact content update received from admin');
        if (payload.new?.value) {
          const newValue = payload.new.value;
          setContactInfo(prev => ({
            address: newValue.address || prev.address,
            phone: newValue.phone || prev.phone,
            email: newValue.email || prev.email
          }));
          console.log('✅ [Footer] Contact info updated from real-time change');
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'settings',
        filter: 'key=eq.heroContent'
      }, async (payload) => {
        console.log('🔔 [Footer] Real-time heroContent update received from admin');
        if (payload.new?.value?.openingHours) {
          setContactHours(payload.new.value.openingHours);
          console.log('✅ [Footer] Opening hours updated from heroContent real-time change:', payload.new.value.openingHours);
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'settings',
        filter: 'key=eq.restaurantInfo'
      }, async (payload) => {
        console.log('🔔 [Footer] Real-time restaurant info update received from admin');
        if (payload.new?.value) {
          const newValue = payload.new.value;
          setRestaurantInfo({
            name: newValue.name || restaurantInfo.name,
            description: newValue.description || restaurantInfo.description
          });
          console.log('✅ [Footer] Restaurant info updated from real-time change');
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <footer className="bg-gradient-to-br from-pizza-dark via-gray-800 to-pizza-dark text-white py-16 relative overflow-hidden">
      {/* Pizza-themed background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pizza-red to-pizza-orange rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-pizza-orange to-pizza-yellow rounded-full blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-pizza-green/20 to-pizza-basil/20 rounded-full blur-2xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating pizza icons */}
      <div className="absolute top-20 right-20 text-pizza-orange/20 animate-float">
        <Pizza size={50} />
      </div>
      <div className="absolute bottom-20 left-20 text-pizza-red/20 animate-float animation-delay-2000">
        <ChefHat size={40} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-efes-gold to-efes-dark-gold p-3 rounded-full">
                <Pizza className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-fredoka font-bold text-xl text-efes-cream">{restaurantInfo.name}</h3>
                <p className="font-pacifico text-efes-gold">Ristorante - Pizzeria</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md font-roboto">
              {restaurantInfo.description}
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-pizza-orange" />
                <p>{contactInfo.address}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-pizza-orange" />
                <p>Tel: {contactInfo.phone}</p>
              </div>
              {contactInfo.email && (
                <div className="flex items-center space-x-2">
                  <Mail size={16} className="text-pizza-orange" />
                  <p>Email: {contactInfo.email}</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Menu</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#home" className="hover:text-pizza-orange transition-colors">Home</a></li>
              <li><a href="#products" className="hover:text-pizza-orange transition-colors">Le Nostre Pizze</a></li>
              <li><a href="#categories" className="hover:text-pizza-orange transition-colors">Categorie</a></li>
              <li><a href="#about" className="hover:text-pizza-orange transition-colors">Chi Siamo</a></li>
              <li><a href="#contact" className="hover:text-pizza-orange transition-colors">Contatti</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('ourServices')}</h3>
            <ul className="space-y-2 text-gray-300">
              <li>🍕 {t('pizzaAlTaglio')}</li>
              <li>🚚 {t('homeDelivery')}</li>
              <li>👨‍🍳 {t('customPizza')}</li>
              <li>🥤 {t('beveragesAndDesserts')}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('openingHours')}</h3>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {contactHours || 'Lun-Dom: 11:00-03:00'}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Efes Kebap Torino. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
