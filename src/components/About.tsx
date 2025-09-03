
import React, { useState, useEffect } from 'react';
import { Pizza, ChefHat, Clock, Star, Flower } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

// Hardcoded content for About section
const HARDCODED_ABOUT_CONTENT = {
  heading: "Chi Siamo",
  subheading: "La nostra storia e passione per il kebab autentico",
  description: "Efes Kebap è un ristorante che porta l'autentica tradizione turca nel cuore di Torino. Con anni di esperienza nella preparazione di kebab tradizionali e pizza italiana, offriamo un'esperienza culinaria unica che combina i sapori del Mediterraneo.",
  features: [
    "Ingredienti freschi e di qualità",
    "Ricette tradizionali turche",
    "Ambiente accogliente e familiare",
    "Servizio rapido e cortese"
  ]
};

const HARDCODED_CHI_SIAMO_CONTENT = {
  heading: "La Nostra Passione",
  subheading: "Tradizione turca nel cuore di Torino",
  description: "Da generazioni la nostra famiglia porta avanti l'arte della preparazione del kebab autentico. Ogni piatto è preparato con cura e passione, utilizzando solo ingredienti freschi e di prima qualità.",
  backgroundImage: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" // Turkish food background
};

const About = () => {
  const { language, t } = useLanguage();

  // Use hardcoded content instead of database
  const aboutContent = HARDCODED_ABOUT_CONTENT;
  const chiSiamoContent = HARDCODED_CHI_SIAMO_CONTENT;
  const chiSiamoImage = {
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', // Turkish kebab image
    alt: 'EFES KEBAP - La nostra storia'
  };
  const [imageRefreshKey, setImageRefreshKey] = useState(Date.now());

  useEffect(() => {
    console.log('🚀 [About] Component mounted with hardcoded content');
  }, []);

  // Multilingual content
  const content = {
    it: {
      title: '👨‍🍳 Chi Siamo - EFES KEBAP',
      storyTitle: '🥙 La Nostra Storia',
      paragraph1: 'EFES KEBAP nasce dalla passione per l\'autentica tradizione turca e italiana, unendo l\'esperienza culinaria tramandata nel tempo. Da anni, offriamo kebap e pizza preparati con amore, ingredienti freschi e tecniche tradizionali.',
      paragraph2: 'I nostri piatti nascono da una profonda passione per la tradizione culinaria turca e italiana. Solo ingredienti selezionati, solo autenticità made in Torino. 🥙 Situati nel cuore di Torino, offriamo esperienza artigianale e passione per il vero kebap e la vera pizza italiana.',
      quote: '🏪 Nel nostro ristorante puoi trovare:',
      quoteAuthor: 'Un viaggio tra sapori, tradizione e autenticità',
      servicesTitle: 'Nel nostro ristorante puoi trovare:',
      services: [
        'Pizza italiana cotta nel forno a legna',
        'Ingredienti freschi e di prima qualità',
        'Impasto preparato quotidianamente con lievitazione naturale',
        'Servizio per eventi e feste personalizzato'
      ],
      stats: {
        years: 'Anni di Esperienza',
        customers: 'Clienti Soddisfatti',
        varieties: 'Varietà di Pizze'
      },
      closingMessage: 'Vieni a trovarci da Efes Kebap e scopri il vero sapore della tradizione turca e italiana.',
      tagline: 'Creiamo sapori autentici, una pizza alla volta'
    },
    en: {
      title: '👨‍🍳 About Us - Efes Kebap',
      storyTitle: '🥙 Our Story',
      paragraph1: 'Efes Kebap was born from a passion for authentic Turkish and Italian tradition and culinary experience passed down through time. We offer Turkish kebap and Italian pizza prepared with love, fresh ingredients and traditional techniques.',
      paragraph2: 'Our dishes are born from a deep passion for Turkish and Italian culinary tradition. Only selected ingredients, only authenticity made in Turin. 🥙 Located in the heart of Turin, we offer artisanal experience and passion for authentic kebap and pizza.',
      quote: '🏪 In our restaurant you can find:',
      quoteAuthor: 'A journey through flavors, tradition and authenticity',
      servicesTitle: 'In our restaurant you can find:',
      services: [
        'Italian pizza cooked in a wood-fired oven',
        'Fresh and top quality ingredients',
        'Dough prepared daily with natural leavening',
        'Service for events and personalized parties'
      ],
      stats: {
        years: 'Years of Experience',
        customers: 'Satisfied Customers',
        varieties: 'Pizza Varieties'
      },
      closingMessage: 'Come visit us at Efes Kebap and discover the true taste of Turkish and Italian tradition.',
      tagline: 'Creating authentic flavors, one pizza at a time'
    },
    fr: {
      title: '👨‍🍳 À Propos - Efes Kebap',
      storyTitle: '🥙 Notre Histoire',
      paragraph1: 'Efes Kebap est né d\'une passion pour la tradition turque et italienne authentique et l\'expérience culinaire transmise à travers le temps. Nous offrons du kebap turc et de la pizza italienne préparés avec amour, des ingrédients frais et des techniques traditionnelles.',
      paragraph2: 'Nos plats naissent d\'une passion profonde pour la tradition culinaire turque et italienne. Seulement des ingrédients sélectionnés, seulement l\'authenticité made in Turin. 🥙 Situés au cœur de Turin, nous offrons une expérience artisanale et une passion pour le kebap et la pizza authentiques.',
      quote: '🏪 Dans notre restaurant vous pouvez trouver:',
      quoteAuthor: 'Un voyage à travers les saveurs, la tradition et l\'authenticité',
      servicesTitle: 'Dans notre restaurant vous pouvez trouver:',
      services: [
        'Pizza italienne cuite au four à bois',
        'Ingrédients frais et de première qualité',
        'Pâte préparée quotidiennement avec levage naturel',
        'Service pour événements et fêtes personnalisé'
      ],
      stats: {
        years: 'Années d\'Expérience',
        customers: 'Clients Satisfaits',
        varieties: 'Variétés de Pizzas'
      },
      closingMessage: 'Venez nous rendre visite à Efes Kebap et découvrez le vrai goût de la tradition turque et italienne.',
      tagline: 'Créer des saveurs authentiques, une pizza à la fois'
    },
    ar: {
      title: 'حول بيتزيريا ريجينا 2000',
      storyTitle: 'قصتنا',
      paragraph1: 'ولدت بيتزيريا ريجينا 2000 من شغف بالتقاليد الإيطالية الأصيلة والخبرة الطهوية المتوارثة عبر الزمن. منذ عام 2000، نقدم البيتزا الإيطالية المحضرة بحب، مع مكونات طازجة وفرننا التقليدي الذي يعمل بالحطب.',
      paragraph2: 'بيتزاتنا تولد من شغف عميق بالتقاليد الطهوية الإيطالية. فقط مكونات مختارة، فقط أصالة صنع في تورين. 🍕 تقع في قلب تورين، نقدم خبرة حرفية وشغف بالبيتزا الإيطالية الأصيلة.',
      quote: '📍 اعثر علينا في وسط تورين – حيث تلتقي التقاليد الإيطالية بالضيافة البيدمونتية.',
      quoteAuthor: 'رحلة عبر النكهات والتقاليد والأصالة',
      servicesTitle: 'في بيتزيريتنا يمكنك أن تجد:',
      services: [
        'بيتزا إيطالية مطبوخة في فرن الحطب',
        'مكونات طازجة وعالية الجودة',
        'عجين محضر يومياً مع تخمير طبيعي',
        'خدمة للفعاليات والحفلات والتموين المخصص'
      ],
      stats: {
        years: 'سنوات الخبرة',
        customers: 'عملاء راضون',
        varieties: 'أنواع البيتزا'
      },
      closingMessage: 'تعال لزيارتنا في بيتزيريا ريجينا 2000 واكتشف الطعم الحقيقي للتقاليد الإيطالية.',
      tagline: 'نخلق نكهات أصيلة، بيتزا واحدة في كل مرة'
    },
    fa: {
      title: 'درباره پیتزریا رجینا 2000',
      storyTitle: 'داستان ما',
      paragraph1: 'پیتزریا رجینا 2000 از عشق به سنت‌های اصیل ایتالیایی و تجربه آشپزی که در طول زمان منتقل شده، متولد شد. از سال 2000، ما پیتزای ایتالیایی تهیه شده با عشق، مواد تازه و کوره سنتی هیزمی خود ارائه می‌دهیم.',
      paragraph2: 'پیتزاهای ما از عشق عمیق به سنت‌های آشپزی ایتالیایی متولد می‌شوند. فقط مواد انتخابی، فقط اصالت ساخت تورین. 🍕 واقع در قلب تورین، ما تجربه صنعتگری و عشق به پیتزای اصیل ایتالیایی ارائه می‌دهیم.',
      quote: '📍 ما را در مرکز تورین پیدا کنید – جایی که سنت ایتالیایی با مهمان‌نوازی پیدمونتی ملاقات می‌کند.',
      quoteAuthor: 'سفری در میان طعم‌ها، سنت و اصالت',
      servicesTitle: 'در پیتزریای ما می‌توانید پیدا کنید:',
      services: [
        'پیتزای ایتالیایی پخته شده در کوره هیزمی',
        'مواد تازه و با کیفیت بالا',
        'خمیر تهیه شده روزانه با تخمیر طبیعی',
        'خدمات برای رویدادها، جشن‌ها و کترینگ شخصی‌سازی شده'
      ],
      stats: {
        years: 'سال تجربه',
        customers: 'مشتریان راضی',
        varieties: 'انواع پیتزا'
      },
      closingMessage: 'برای دیدن ما به افس پیتزا کباب بیایید و طعم واقعی سنت ایتالیایی و ترکی را کشف کنید.',
      tagline: 'خلق طعم‌های اصیل، یک پیتزا در هر زمان'
    }
  };

  // Use hardcoded content structure (chiSiamoContent is for background only)
  const currentContent = content[language] || content.it;

  // Create background style with cache busting
  const backgroundImageUrl = chiSiamoContent?.backgroundImage ?
    `${chiSiamoContent.backgroundImage}${chiSiamoContent.backgroundImage.includes('?') ? '&' : '?'}t=${imageRefreshKey}` :
    undefined;

  const sectionStyle = {
    backgroundImage: backgroundImageUrl ?
      `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${backgroundImageUrl}')` :
      undefined,
    backgroundSize: backgroundImageUrl ? 'cover' : undefined,
    backgroundPosition: backgroundImageUrl ? 'center' : undefined,
  };

  // Debug logging
  console.log('🔍 [About] Debug Info:');
  console.log('   - chiSiamoContent:', chiSiamoContent);
  console.log('   - chiSiamoContent?.backgroundImage:', chiSiamoContent?.backgroundImage);
  console.log('   - backgroundImageUrl:', backgroundImageUrl);
  console.log('   - Will use background image?', !!backgroundImageUrl);
  console.log('   - Section style:', sectionStyle);

  // Add manual refresh function to window for debugging
  React.useEffect(() => {
    (window as any).refreshAboutBackground = () => {
      console.log('🔄 [About] Manual background refresh triggered');
      setImageRefreshKey(Date.now());
    };
  }, []);

  return backgroundImageUrl ? (
    <section
      id="about"
      className="py-20 relative"
      style={sectionStyle}
    >
        {/* Pizza-themed background decorations */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-pizza-red rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-pizza-orange rounded-full blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pizza-green rounded-full blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Floating pizza icons */}
        <div className="absolute top-20 right-20 text-pizza-orange/20 animate-float">
          <ChefHat size={50} />
        </div>
        <div className="absolute bottom-20 left-20 text-pizza-red/20 animate-float animation-delay-2000">
          <Pizza size={40} />
        </div>
        <div className="absolute top-1/3 left-10 text-pizza-green/20 animate-float animation-delay-4000">
          <Star size={30} />
        </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Pizza className="text-pizza-red animate-pizza-spin" size={48} />
              <ChefHat className="text-pizza-orange animate-tomato-bounce" size={48} />
              <Pizza className="text-pizza-green animate-pizza-spin animation-delay-2000" size={48} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-fredoka drop-shadow-lg">
              👨‍🍳 {currentContent.title}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6 font-pacifico flex items-center drop-shadow-md">
                🍕 {currentContent.storyTitle}
              </h3>
              <p className="text-white mb-6 leading-relaxed font-roboto text-lg drop-shadow-sm">
                {currentContent.paragraph1}
              </p>
              <p className="text-white mb-6 leading-relaxed font-roboto text-lg drop-shadow-sm">
                {currentContent.paragraph2}
              </p>

              {/* Services Section */}
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-white mb-4 font-fredoka flex items-center drop-shadow-md">
                  🏪 {currentContent.servicesTitle}
                </h4>
                <ul className="space-y-3">
                  {currentContent.services.map((service, index) => (
                    <li key={index} className="flex items-start gap-3 text-white font-roboto drop-shadow-sm">
                      <div className="w-3 h-3 bg-gradient-to-r from-pizza-red to-pizza-orange rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                      <span className="text-lg">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-center p-4 bg-gradient-to-br from-peach-50 to-coral-50 rounded-xl">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-peach-600 to-coral-600 font-playfair">15</div>
                  <div className="text-sm text-gray-600 font-inter">{currentContent.stats.years}</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-700 font-playfair">5000+</div>
                  <div className="text-sm text-gray-600 font-inter">{currentContent.stats.customers}</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-coral-600 font-playfair">100+</div>
                  <div className="text-sm text-gray-600 font-inter">{currentContent.stats.varieties}</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                {chiSiamoImage.image ? (
                  <img
                    src={`${chiSiamoImage.image}${chiSiamoImage.image.includes('?') ? '&' : '?'}t=${imageRefreshKey}`}
                    alt={chiSiamoImage.alt}
                    className="rounded-xl w-full h-auto"
                    onError={(e) => {
                      console.error('❌ [About] Chi Siamo image failed to load:', chiSiamoImage.image);
                      // Fallback to default image
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
                    }}
                    onLoad={() => {
                      console.log('✅ [About] Chi Siamo image loaded successfully:', chiSiamoImage.image);
                    }}
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-2">🍕</div>
                      <p className="text-sm">Immagine non disponibile</p>
                      <p className="text-xs mt-1">Carica un'immagine dal pannello admin</p>
                    </div>
                  </div>
                )}
              </div>
              {/* REMOVED: The overlay panel that was here */}
            </div>
          </div>

          {/* Closing Message */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-white to-peach-50 p-8 rounded-2xl shadow-lg border border-peach-200 max-w-3xl mx-auto">
              <p className="text-lg text-gray-700 font-inter leading-relaxed mb-4">
                {currentContent.closingMessage}
              </p>
              <div className="flex items-center justify-center gap-2 text-peach-600">
                <Flower size={20} />
                <span className="text-sm font-medium">{currentContent.tagline}</span>
                <Flower size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
  ) : (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
      <section id="about" className="relative">
        {/* Pizza-themed background decorations */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-pizza-red rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-pizza-orange rounded-full blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pizza-green rounded-full blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Floating pizza icons */}
        <div className="absolute top-20 right-20 text-pizza-orange/20 animate-float">
          <ChefHat size={50} />
        </div>
        <div className="absolute bottom-20 left-20 text-pizza-red/20 animate-float animation-delay-2000">
          <Pizza size={40} />
        </div>
        <div className="absolute top-1/3 left-10 text-pizza-green/20 animate-float animation-delay-4000">
          <Star size={30} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <Pizza className="text-pizza-red animate-pizza-spin" size={48} />
                <ChefHat className="text-pizza-orange animate-tomato-bounce" size={48} />
                <Pizza className="text-pizza-green animate-pizza-spin animation-delay-2000" size={48} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-pizza-dark mb-6 font-fredoka">
                👨‍🍳 {currentContent.title}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <h3 className="text-2xl md:text-3xl font-semibold text-pizza-dark mb-6 font-pacifico flex items-center">
                  🍕 {currentContent.storyTitle}
                </h3>
                <p className="text-pizza-dark mb-6 leading-relaxed font-roboto text-lg">
                  {currentContent.paragraph1}
                </p>
                <p className="text-pizza-dark mb-6 leading-relaxed font-roboto text-lg">
                  {currentContent.paragraph2}
                </p>

                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-pizza-dark mb-4 font-pacifico">
                    🍽️ {currentContent.servicesTitle}
                  </h4>
                  <ul className="text-left space-y-2 font-roboto">
                    {currentContent.services.map((service, index) => (
                      <li key={index} className="flex items-center text-pizza-dark">
                        <span className="text-pizza-red mr-3">✓</span>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="relative">
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  {chiSiamoImage.image ? (
                    <img
                      src={`${chiSiamoImage.image}${chiSiamoImage.image.includes('?') ? '&' : '?'}t=${imageRefreshKey}`}
                      alt={chiSiamoImage.alt}
                      className="rounded-xl w-full h-auto"
                      onError={(e) => {
                        console.error('❌ [About] Chi Siamo image failed to load:', chiSiamoImage.image);
                        // Fallback to default image
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
                      }}
                      onLoad={() => {
                        console.log('✅ [About] Chi Siamo image loaded successfully:', chiSiamoImage.image);
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <div className="text-4xl mb-2">🍕</div>
                        <p className="text-sm">Immagine non disponibile</p>
                        <p className="text-xs mt-1">Carica un'immagine dal pannello admin</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* REMOVED: The overlay panel that was here */}
              </div>
            </div>

            {/* Closing Message */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-br from-white to-peach-50 p-8 rounded-2xl shadow-lg border border-peach-200 max-w-3xl mx-auto">
                <p className="text-lg text-gray-700 font-inter leading-relaxed mb-4">
                  {currentContent.closingMessage}
                </p>
                <div className="flex justify-center items-center space-x-2 text-pizza-orange">
                  <Flower size={20} />
                  <span className="text-sm font-medium">{currentContent.quoteAuthor}</span>
                  <Flower size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default About;
