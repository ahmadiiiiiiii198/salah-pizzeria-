import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface WhyChooseUsData {
  title: string;
  subtitle: string;
  centralImage: string;
  features: {
    id: string;
    icon: string;
    title: string;
    description: string;
  }[];
}

const WhyChooseUsSection = () => {
  const [data, setData] = useState<WhyChooseUsData>({
    title: "Perché scegliere EFES KEBAP?",
    subtitle: "Autentico sapore turco e pizza italiana dal 2020",
    centralImage: "/placeholder-kebab.jpg",
    features: [
      {
        id: "1",
        icon: "🥙",
        title: "Kebab Autentico",
        description: "Ricette tradizionali turche"
      },
      {
        id: "2", 
        icon: "🍕",
        title: "Pizza Napoletana",
        description: "Impasto fatto in casa"
      },
      {
        id: "3",
        icon: "⏰",
        title: "Servizio Veloce",
        description: "Consegna in 30 minuti"
      },
      {
        id: "4",
        icon: "🌟",
        title: "Ingredienti Freschi",
        description: "Qualità garantita"
      },
      {
        id: "5",
        icon: "🔥",
        title: "Cottura Perfetta",
        description: "Forno a legna tradizionale"
      },
      {
        id: "6",
        icon: "💯",
        title: "Soddisfazione",
        description: "Clienti sempre felici"
      }
    ]
  });

  const [backgroundRefreshKey, setBackgroundRefreshKey] = useState(Date.now());

  // Load data from database
  useEffect(() => {
    const loadWhyChooseUsData = async () => {
      try {
        const { data: settingsData, error } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'whyChooseUsContent')
          .single();

        if (settingsData?.value) {
          const value = settingsData.value as any;
          setData(prevData => ({
            title: value.title || prevData.title,
            subtitle: value.subtitle || prevData.subtitle,
            centralImage: value.centralImage || prevData.centralImage,
            features: value.features || prevData.features
          }));
        }
      } catch (error) {
        console.error('Error loading why choose us data:', error);
      }
    };

    loadWhyChooseUsData();
  }, []);

  // Central image with cache busting
  const centralImageUrl = data.centralImage 
    ? `${data.centralImage}?v=${backgroundRefreshKey}`
    : null;

  return (
    <section className="py-20 bg-gradient-to-br from-efes-cream to-efes-warm-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 bg-efes-gold rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-efes-bronze rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-efes-dark-navy mb-4 efes-heading">
            {data.title}
          </h2>
          <p className="text-xl text-efes-charcoal max-w-3xl mx-auto font-raleway">
            {data.subtitle}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Features */}
          <div className="space-y-8">
            {data.features.slice(0, 3).map((feature, index) => (
              <div
                key={feature.id}
                className="flex items-center space-x-4"
              >
                {/* Red circular icon */}
                <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white text-2xl">{feature.icon}</span>
                </div>
                {/* Cream colored frame */}
                <div className="bg-cream-100 rounded-full px-6 py-4 shadow-md flex-1 border border-cream-200">
                  <h3 className="font-bold text-gray-800 text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Central Image */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 rounded-full overflow-hidden shadow-2xl">
                {centralImageUrl ? (
                  <img
                    src={centralImageUrl}
                    alt="Efes Kebap Specialità"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                    <span className="text-6xl">🥙</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Features */}
          <div className="space-y-8">
            {data.features.slice(3, 6).map((feature, index) => (
              <div
                key={feature.id}
                className="flex items-center space-x-4"
              >
                {/* Cream colored frame */}
                <div className="bg-cream-100 rounded-full px-6 py-4 shadow-md flex-1 border border-cream-200 text-right">
                  <h3 className="font-bold text-gray-800 text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {feature.description}
                  </p>
                </div>
                {/* Red circular icon */}
                <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-white text-2xl">{feature.icon}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-efes-gold/10 px-6 py-3 rounded-full border border-efes-gold/20">
            <span className="text-2xl">🏆</span>
            <span className="text-efes-dark-navy font-semibold efes-heading">
              La scelta migliore per kebab e pizza a Torino
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
