import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Pizza,
  Settings,
  Image,
  Video,
  MessageSquare,
  Bell,
  Users,
  ShoppingCart,
  BarChart3,
  MapPin,
  Palette,
  Globe,
  Menu as MenuIcon,
  Wrench,
  Database,
  CheckCircle,
  Eye,
  Plus,
  Clock,
  CreditCard,
  Phone,
  Loader2,
  Package,
  Volume2
} from 'lucide-react';
import CacheClearButton from '@/components/CacheClearButton';

// UnifiedNotificationSystem removed from admin panel to prevent conflicts
// It will only run in the ordini page

// Direct imports for critical components to avoid lazy loading issues
import BusinessHoursManager from './BusinessHoursManager';
import OpeningHoursManager from './OpeningHoursManager';
import ShippingZoneManager from './ShippingZoneManager';

// Lazy load admin components to prevent initialization errors
const ProductsAdmin = lazy(() => import('./ProductsAdmin').catch(() => ({ default: () => <div>Error loading ProductsAdmin</div> })));
const CustomerMenuAdmin = lazy(() => import('./CustomerMenuAdmin').catch(() => ({ default: () => <div>Error loading CustomerMenuAdmin</div> })));
// OrdersAdmin removed - only available in separate ordini section
const ContentEditor = lazy(() => import('./ContentEditor').catch(() => ({ default: () => <div>Error loading ContentEditor</div> })));
const HeroContentEditor = lazy(() => import('./HeroContentEditor').catch(() => ({ default: () => <div>Error loading HeroContentEditor</div> })));
const LogoEditor = lazy(() => import('./LogoEditor').catch(() => ({ default: () => <div>Error loading LogoEditor</div> })));
const NavbarLogoEditor = lazy(() => import('./NavbarLogoEditor').catch(() => ({ default: () => <div>Error loading NavbarLogoEditor</div> })));
const GalleryManager = lazy(() => import('./GalleryManager').catch(() => ({ default: () => <div>Error loading GalleryManager</div> })));
const YouTubeManager = lazy(() => import('./YouTubeManager').catch(() => ({ default: () => <div>Error loading YouTubeManager</div> })));
const FlegreaSectionManager = lazy(() => import('./FlegreaSectionManager').catch(() => ({ default: () => <div>Error loading FlegreaSectionManager</div> })));
const CommentsManager = lazy(() => import('./CommentsManager').catch(() => ({ default: () => <div>Error loading CommentsManager</div> })));
const PopupManager = lazy(() => import('./PopupManager').catch(() => ({ default: () => <div>Error loading PopupManager</div> })));
const SettingsManager = lazy(() => import('./SettingsManager').catch(() => ({ default: () => <div>Error loading SettingsManager</div> })));
const AnalyticsDashboard = lazy(() => import('./AnalyticsDashboard').catch(() => ({ default: () => <div>Error loading AnalyticsDashboard</div> })));
const WeOfferManager = lazy(() => import('./WeOfferManager').catch(() => ({ default: () => <div>Error loading WeOfferManager</div> })));
const WhyChooseUsManager = lazy(() => import('./WhyChooseUsManager').catch(() => ({ default: () => <div>Error loading WhyChooseUsManager</div> })));
const ChiSiamoImageManager = lazy(() => import('./ChiSiamoImageManager').catch(() => ({ default: () => <div>Error loading ChiSiamoImageManager</div> })));
const ChiSiamoContentManager = lazy(() => import('./ChiSiamoContentManager').catch(() => ({ default: () => <div>Error loading ChiSiamoContentManager</div> })));
const SectionBackgroundManager = lazy(() => import('./SectionBackgroundManager').catch(() => ({ default: () => <div>Error loading SectionBackgroundManager</div> })));
const SystemTest = lazy(() => import('./SystemTest').catch(() => ({ default: () => <div>Error loading SystemTest</div> })));
const DatabaseTest = lazy(() => import('./DatabaseTest').catch(() => ({ default: () => <div>Error loading DatabaseTest</div> })));
const SystemConnectionTest = lazy(() => import('../SystemConnectionTest').catch(() => ({ default: () => <div>Error loading SystemConnectionTest</div> })));
const YouTubeConnectionTest = lazy(() => import('../YouTubeConnectionTest').catch(() => ({ default: () => <div>Error loading YouTubeConnectionTest</div> })));
const ContactInfoManager = lazy(() => import('./ContactInfoEditor').catch(() => ({ default: () => <div>Error loading ContactInfoManager</div> })));
const CategoryExtrasManager = lazy(() => import('./CategoryExtrasManager').catch(() => ({ default: () => <div>Error loading CategoryExtrasManager</div> })));
const IOSAudioTest = lazy(() => import('../IOSAudioTest').catch(() => ({ default: () => <div>Error loading IOSAudioTest</div> })));
const StripeSettings = lazy(() => import('./StripeSettings').catch(() => ({ default: () => <div>Error loading StripeSettings</div> })));
const NotificationSettings = lazy(() => import('./NotificationSettings').catch(() => ({ default: () => <div>Error loading NotificationSettings</div> })));
const DatabaseSchemaUpdater = lazy(() => import('./DatabaseSchemaUpdater').catch(() => ({ default: () => <div>Error loading DatabaseSchemaUpdater</div> })));
const DatabaseSchemaMigrator = lazy(() => import('./DatabaseSchemaMigrator').catch(() => ({ default: () => <div>Error loading DatabaseSchemaMigrator</div> })));
const DatabaseSchemaTest = lazy(() => import('./DatabaseSchemaTest').catch(() => ({ default: () => <div>Error loading DatabaseSchemaTest</div> })));
const ProductsDebugger = lazy(() => import('../ProductsDebugger').catch(() => ({ default: () => <div>Error loading ProductsDebugger</div> })));
const MenuProductsConnectionTest = lazy(() => import('../MenuProductsConnectionTest').catch(() => ({ default: () => <div>Error loading MenuProductsConnectionTest</div> })));
const ProductsSchemaFixer = lazy(() => import('../ProductsSchemaFixer').catch(() => ({ default: () => <div>Error loading ProductsSchemaFixer</div> })));
const FrontendConnectionTester = lazy(() => import('../FrontendConnectionTester').catch(() => ({ default: () => <div>Error loading FrontendConnectionTester</div> })));
const BulkStockManager = lazy(() => import('./BulkStockManager').catch(() => ({ default: () => <div>Error loading BulkStockManager</div> })));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    <span className="ml-2 text-gray-600">Caricamento...</span>
  </div>
);

const PizzeriaAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isReady, setIsReady] = useState(false);

  // Add initialization logging with delay
  useEffect(() => {
    console.log('🚀 [AdminPanel] Initializing PizzeriaAdminPanel...');
    console.log('🚀 [AdminPanel] Active tab:', activeTab);
    console.log('🚀 [AdminPanel] Environment check:', {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'configured' : 'missing',
      supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'configured' : 'missing'
    });

    // Add a small delay to ensure all components are ready
    const timer = setTimeout(() => {
      setIsReady(true);
      console.log('🚀 [AdminPanel] Component fully initialized and ready');
      console.log('🚀 [AdminPanel] Notification system available only in separate ordini section');
    }, 200); // Increased delay slightly

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('🔄 [AdminPanel] Active tab changed to:', activeTab);
  }, [activeTab]);

  // Show loading state during initialization
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Caricamento Pannello Admin...</h2>
          <p className="text-gray-500 mt-2">Inizializzazione componenti...</p>
        </div>
      </div>
    );
  }

  // Perfectly organized admin sections with priority-based structure
  const adminSections = [
    // === 🏪 CORE BUSINESS (Most Important) ===
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Panoramica generale e statistiche',
      category: 'core',
      priority: 1
    },
    {
      id: 'products',
      label: 'Menu & Prodotti',
      icon: Pizza,
      description: 'Gestione completa menu e prodotti',
      category: 'core',
      priority: 2
    },
    {
      id: 'customer-menu',
      label: 'Menu Cliente',
      icon: Pizza,
      description: 'Menu visibile ai clienti (/menu)',
      category: 'core',
      priority: 3
    },
    {
      id: 'stock',
      label: 'Gestione Stock',
      icon: Package,
      description: 'Stock e disponibilità prodotti',
      category: 'core',
      priority: 4
    },

    // === ⚙️ BUSINESS OPERATIONS ===
    {
      id: 'business-hours',
      label: 'Orari di Apertura',
      icon: Clock,
      description: 'Gestione orari settimanali',
      category: 'operations',
      priority: 1
    },
    {
      id: 'shipping-zones',
      label: 'Zone di Consegna',
      icon: MapPin,
      description: 'Gestione zone e tariffe consegna',
      category: 'operations',
      priority: 2
    },
    {
      id: 'stripe-settings',
      label: 'Pagamenti Stripe',
      icon: CreditCard,
      description: 'Configurazione pagamenti',
      category: 'operations',
      priority: 3
    },
    {
      id: 'notifications',
      label: 'Notifiche',
      icon: Bell,
      description: 'Sistema notifiche ordini',
      category: 'operations',
      priority: 4
    },

    // === 📝 CONTENT MANAGEMENT ===
    {
      id: 'content',
      label: 'Contenuti Sito',
      icon: Globe,
      description: 'Testi e contenuti principali',
      category: 'content',
      priority: 1
    },
    {
      id: 'gallery',
      label: 'Galleria Immagini',
      icon: Image,
      description: 'Gestione foto e galleria',
      category: 'content',
      priority: 2
    },
    {
      id: 'youtube',
      label: 'Video YouTube',
      icon: Video,
      description: 'Gestione contenuti video',
      category: 'content',
      priority: 3
    },
    {
      id: 'backgrounds',
      label: 'Sfondi Sezioni',
      icon: Image,
      description: 'Sfondi per sezioni del sito',
      category: 'content',
      priority: 4
    },
    {
      id: 'flegrea-section',
      label: 'Sezione Flegrea',
      icon: Image,
      description: 'Contenuti sezione Flegrea',
      category: 'content',
      priority: 5
    },

    // === 👥 CUSTOMER INTERACTION ===
    {
      id: 'comments',
      label: 'Recensioni',
      icon: MessageSquare,
      description: 'Gestione commenti clienti',
      category: 'interaction',
      priority: 1
    },
    {
      id: 'popups',
      label: 'Popup & Annunci',
      icon: Bell,
      description: 'Messaggi e promozioni',
      category: 'interaction',
      priority: 2
    },

    // === 🔧 SYSTEM SETTINGS ===
    {
      id: 'settings',
      label: 'Impostazioni Generali',
      icon: Settings,
      description: 'Configurazioni sistema',
      category: 'system',
      priority: 1
    },
    {
      id: 'contact-info',
      label: 'Informazioni Contatto',
      icon: Phone,
      description: 'Dati contatto e footer',
      category: 'system',
      priority: 2
    },
    {
      id: 'category-extras',
      label: 'Extra Categorie',
      icon: Settings,
      description: 'Extra per categorie prodotti',
      category: 'system',
      priority: 3
    },


    // === 🧪 TESTING & DIAGNOSTICS ===
    {
      id: 'system-test',
      label: 'Test Sistema',
      icon: Wrench,
      description: 'Test completo funzionalità',
      category: 'testing',
      priority: 1
    },
    {
      id: 'database-test',
      label: 'Test Database',
      icon: Database,
      description: 'Verifica connessione DB',
      category: 'testing',
      priority: 2
    },
    {
      id: 'frontend-test',
      label: 'Test Frontend',
      icon: Globe,
      description: 'Test connessioni frontend',
      category: 'testing',
      priority: 3
    },
    {
      id: 'menu-products-test',
      label: 'Test Menu',
      icon: MenuIcon,
      description: 'Test menu e prodotti',
      category: 'testing',
      priority: 4
    },
    {
      id: 'youtube-test',
      label: 'Test YouTube',
      icon: Video,
      description: 'Test integrazione YouTube',
      category: 'testing',
      priority: 5
    },
    {
      id: 'ios-audio-test',
      label: 'Test Audio iOS',
      icon: Volume2,
      description: 'Test notifiche audio iOS',
      category: 'testing',
      priority: 6
    },

    // === 🔧 ADVANCED TOOLS ===
    {
      id: 'products-debug',
      label: 'Debug Prodotti',
      icon: Pizza,
      description: 'Debug avanzato prodotti',
      category: 'advanced',
      priority: 1
    },
    {
      id: 'schema-updater',
      label: 'Aggiorna Schema',
      icon: Wrench,
      description: 'Aggiornamento schema DB',
      category: 'advanced',
      priority: 2
    },
    {
      id: 'schema-fixer',
      label: 'Schema Fix',
      icon: Wrench,
      description: 'Risolvi problemi schema database',
      category: 'advanced'
    },
    {
      id: 'schema-migrator',
      label: 'Schema Migrator',
      icon: Database,
      description: 'Migra schema database per content_sections',
      category: 'advanced'
    },
    {
      id: 'schema-test',
      label: 'Schema Test',
      icon: CheckCircle,
      description: 'Test schema database e RLS policies',
      category: 'testing'
    },

  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* OrderNotificationSystem removed - only available in separate ordini section */}

      {/* Enhanced Modern Header */}
      <div className="bg-gradient-to-r from-white via-gray-50 to-white shadow-xl border-b border-gray-200 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <Pizza className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent">
                  Pannello Admin
                </h1>
                <p className="text-xl text-gray-600 font-semibold">Efes Kebap</p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Sistema attivo e funzionante
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {/* Cache Clear Button */}
              <CacheClearButton
                variant="outline"
                size="sm"
                showText={false}
                className="border-gray-300 hover:border-gray-400"
              />

              {/* Ordini Button */}
              <Button
                onClick={() => window.open('/ordini', '_blank')}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl font-semibold"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Gestione Ordini
              </Button>

              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">
                  {new Date().toLocaleDateString('it-IT', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date().toLocaleTimeString('it-IT', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                A
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Enhanced Modern Navigation */}
          <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-2xl border border-gray-200 p-8 backdrop-blur-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
                <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full mr-4"></div>
                Sezioni di Gestione
              </h2>
              <p className="text-gray-600 text-lg">Seleziona una sezione per iniziare a gestire il tuo sito</p>
            </div>

            {/* Quick Access to Ordini */}
            <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 via-orange-100 to-red-50 rounded-2xl border-2 border-orange-200 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 p-4 rounded-2xl shadow-xl">
                    <ShoppingCart className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Gestione Ordini</h3>
                    <p className="text-gray-600">Accesso rapido alla sezione ordini con notifiche audio</p>
                  </div>
                </div>
                <Button
                  onClick={() => window.open('/ordini', '_blank')}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 rounded-xl font-bold text-lg"
                >
                  <ShoppingCart className="w-6 h-6 mr-3" />
                  Apri Ordini
                </Button>
              </div>
            </div>

            {/* 🏪 CORE BUSINESS - Most Important */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-t-xl">
                <h3 className="text-lg font-bold flex items-center">
                  <div className="w-4 h-4 bg-white rounded-full mr-3 animate-pulse"></div>
                  🏪 Gestione Principale
                </h3>
                <p className="text-red-100 text-sm mt-1">Funzioni essenziali per il business</p>
              </div>
              <div className="bg-white border border-red-200 rounded-b-xl p-6">
                <TabsList className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-transparent h-auto">
                  {adminSections
                    .filter(s => s.category === 'core')
                    .sort((a, b) => a.priority - b.priority)
                    .map((section) => (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className="flex items-center p-4 text-left bg-gradient-to-r from-white to-red-50 border border-red-200 rounded-xl hover:shadow-lg hover:border-red-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-100 data-[state=active]:to-red-200 data-[state=active]:border-red-500 data-[state=active]:shadow-lg transition-all duration-200 h-auto"
                    >
                      <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-lg mr-4 flex-shrink-0">
                        <section.icon size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-sm">{section.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{section.description}</div>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            {/* ⚙️ BUSINESS OPERATIONS */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-xl">
                <h3 className="text-lg font-bold flex items-center">
                  <div className="w-4 h-4 bg-white rounded-full mr-3 animate-pulse"></div>
                  ⚙️ Operazioni Business
                </h3>
                <p className="text-orange-100 text-sm mt-1">Orari, consegne e pagamenti</p>
              </div>
              <div className="bg-white border border-orange-200 rounded-b-xl p-6">
                <TabsList className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-transparent h-auto">
                  {adminSections
                    .filter(s => s.category === 'operations')
                    .sort((a, b) => a.priority - b.priority)
                    .map((section) => (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className="flex items-center p-4 text-left bg-gradient-to-r from-white to-orange-50 border border-orange-200 rounded-xl hover:shadow-lg hover:border-orange-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-100 data-[state=active]:to-orange-200 data-[state=active]:border-orange-500 data-[state=active]:shadow-lg transition-all duration-200 h-auto"
                    >
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-lg mr-4 flex-shrink-0">
                        <section.icon size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-sm">{section.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{section.description}</div>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            {/* 📝 CONTENT MANAGEMENT */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-xl">
                <h3 className="text-lg font-bold flex items-center">
                  <div className="w-4 h-4 bg-white rounded-full mr-3 animate-pulse"></div>
                  📝 Gestione Contenuti
                </h3>
                <p className="text-blue-100 text-sm mt-1">Testi, immagini e video del sito</p>
              </div>
              <div className="bg-white border border-blue-200 rounded-b-xl p-6">
                <TabsList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-transparent h-auto">
                  {adminSections
                    .filter(s => s.category === 'content')
                    .sort((a, b) => a.priority - b.priority)
                    .map((section) => (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className="flex items-center p-4 text-left bg-gradient-to-r from-white to-blue-50 border border-blue-200 rounded-xl hover:shadow-lg hover:border-blue-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-100 data-[state=active]:to-blue-200 data-[state=active]:border-blue-500 data-[state=active]:shadow-lg transition-all duration-200 h-auto"
                    >
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg mr-4 flex-shrink-0">
                        <section.icon size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-sm">{section.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{section.description}</div>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            {/* 👥 CUSTOMER INTERACTION */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-xl">
                <h3 className="text-lg font-bold flex items-center">
                  <div className="w-4 h-4 bg-white rounded-full mr-3 animate-pulse"></div>
                  👥 Interazione Clienti
                </h3>
                <p className="text-green-100 text-sm mt-1">Recensioni e comunicazioni</p>
              </div>
              <div className="bg-white border border-green-200 rounded-b-xl p-6">
                <TabsList className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-transparent h-auto">
                  {adminSections
                    .filter(s => s.category === 'interaction')
                    .sort((a, b) => a.priority - b.priority)
                    .map((section) => (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className="flex items-center p-4 text-left bg-gradient-to-r from-white to-green-50 border border-green-200 rounded-xl hover:shadow-lg hover:border-green-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-100 data-[state=active]:to-green-200 data-[state=active]:border-green-500 data-[state=active]:shadow-lg transition-all duration-200 h-auto"
                    >
                      <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-lg mr-4 flex-shrink-0">
                        <section.icon size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-sm">{section.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{section.description}</div>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            {/* 🔧 SYSTEM SETTINGS */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-t-xl">
                <h3 className="text-lg font-bold flex items-center">
                  <div className="w-4 h-4 bg-white rounded-full mr-3 animate-pulse"></div>
                  🔧 Impostazioni Sistema
                </h3>
                <p className="text-purple-100 text-sm mt-1">Configurazioni generali</p>
              </div>
              <div className="bg-white border border-purple-200 rounded-b-xl p-6">
                <TabsList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-transparent h-auto">
                  {adminSections
                    .filter(s => s.category === 'system')
                    .sort((a, b) => a.priority - b.priority)
                    .map((section) => (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className="flex items-center p-4 text-left bg-gradient-to-r from-white to-purple-50 border border-purple-200 rounded-xl hover:shadow-lg hover:border-purple-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-100 data-[state=active]:to-purple-200 data-[state=active]:border-purple-500 data-[state=active]:shadow-lg transition-all duration-200 h-auto"
                    >
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-lg mr-4 flex-shrink-0">
                        <section.icon size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-sm">{section.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{section.description}</div>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            {/* 🧪 TESTING & DIAGNOSTICS - Collapsible */}
            <details className="mb-6 group">
              <summary className="cursor-pointer bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200">
                <h3 className="text-lg font-bold inline-flex items-center w-full">
                  <div className="w-4 h-4 bg-white rounded-full mr-3 animate-pulse"></div>
                  🧪 Test & Diagnostica
                  <span className="ml-auto text-sm opacity-75 group-open:hidden">Clicca per espandere</span>
                </h3>
                <p className="text-yellow-100 text-sm mt-1">Strumenti di test e debug</p>
              </summary>
              <div className="bg-white border border-yellow-200 rounded-b-xl p-6 mt-2">
                <TabsList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-transparent h-auto">
                  {adminSections
                    .filter(s => s.category === 'testing')
                    .sort((a, b) => a.priority - b.priority)
                    .map((section) => (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className="flex items-center p-4 text-left bg-gradient-to-r from-white to-yellow-50 border border-yellow-200 rounded-xl hover:shadow-lg hover:border-yellow-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-100 data-[state=active]:to-yellow-200 data-[state=active]:border-yellow-500 data-[state=active]:shadow-lg transition-all duration-200 h-auto"
                    >
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-3 rounded-lg mr-4 flex-shrink-0">
                        <section.icon size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-sm">{section.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{section.description}</div>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </details>

            {/* 🔧 ADVANCED TOOLS - Collapsible */}
            <details className="mb-6 group">
              <summary className="cursor-pointer bg-gradient-to-r from-gray-600 to-gray-700 text-white p-4 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200">
                <h3 className="text-lg font-bold inline-flex items-center w-full">
                  <div className="w-4 h-4 bg-white rounded-full mr-3 animate-pulse"></div>
                  🔧 Strumenti Avanzati
                  <span className="ml-auto text-sm opacity-75 group-open:hidden">Solo per esperti</span>
                </h3>
                <p className="text-gray-200 text-sm mt-1">Strumenti per sviluppatori</p>
              </summary>
              <div className="bg-white border border-gray-300 rounded-b-xl p-6 mt-2">
                <TabsList className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-transparent h-auto">
                  {adminSections
                    .filter(s => s.category === 'advanced')
                    .sort((a, b) => a.priority - b.priority)
                    .map((section) => (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className="flex items-center p-4 text-left bg-gradient-to-r from-white to-gray-50 border border-gray-300 rounded-xl hover:shadow-lg hover:border-gray-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-100 data-[state=active]:to-gray-200 data-[state=active]:border-gray-600 data-[state=active]:shadow-lg transition-all duration-200 h-auto"
                    >
                      <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-3 rounded-lg mr-4 flex-shrink-0">
                        <section.icon size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-sm">{section.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{section.description}</div>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </details>
          </div>

          {/* Tab Contents */}
          <div className="space-y-6">
            {/* Dashboard */}
            <TabsContent value="dashboard" className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-blue-800">Prodotti Attivi</CardTitle>
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <Pizza className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-900">14</div>
                    <p className="text-sm text-blue-600 flex items-center mt-2">
                      <span className="text-green-600 font-medium">+3</span>
                      <span className="ml-1">nuovi prodotti</span>
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-green-800">Fatturato Oggi</CardTitle>
                    <div className="bg-green-500 p-2 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-900">€245.50</div>
                    <p className="text-sm text-green-600 flex items-center mt-2">
                      <span className="text-green-600 font-medium">+15%</span>
                      <span className="ml-1">da ieri</span>
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-orange-800">Prodotti Attivi</CardTitle>
                    <div className="bg-orange-500 p-2 rounded-lg">
                      <Pizza className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-900">14</div>
                    <p className="text-sm text-orange-600 mt-2">Menu completo</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-purple-800">Nuovi Commenti</CardTitle>
                    <div className="bg-purple-500 p-2 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-900">3</div>
                    <p className="text-sm text-purple-600 mt-2">Da moderare</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Azioni Rapide</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex items-center p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-200">
                    <Plus className="h-5 w-5 mr-3" />
                    Nuovo Prodotto
                  </button>
                  <button
                    onClick={() => window.open('/ordini', '_blank')}
                    className="flex items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                  >
                    <ShoppingCart className="h-5 w-5 mr-3" />
                    Apri Sezione Ordini
                  </button>
                  <button className="flex items-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-200">
                    <Settings className="h-5 w-5 mr-3" />
                    Impostazioni
                  </button>
                </div>
              </div>

              <Suspense fallback={<LoadingSpinner />}>
                <AnalyticsDashboard />
              </Suspense>
            </TabsContent>

            {/* Orders Management removed - only available in separate ordini section */}

            {/* Stock Management */}
            <TabsContent value="stock">
              <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-2xl border-b border-green-200">
                  <CardTitle className="flex items-center text-green-800">
                    <div className="bg-green-500 p-2 rounded-lg mr-3">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    Gestione Stock Prodotti
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    Gestisci la disponibilità e le quantità di stock per tutti i prodotti
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Suspense fallback={<LoadingSpinner />}>
                    <BulkStockManager />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Management */}
            <TabsContent value="products">
              <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 rounded-t-2xl border-b border-red-200">
                  <CardTitle className="flex items-center text-red-800">
                    <div className="bg-red-500 p-2 rounded-lg mr-3">
                      <Pizza className="h-6 w-6 text-white" />
                    </div>
                    Gestione Menu e Prodotti
                  </CardTitle>
                  <CardDescription className="text-red-600">
                    Aggiungi, modifica o rimuovi pizze e prodotti dal menu
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProductsAdmin />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Customer Menu Management */}
            <TabsContent value="customer-menu">
              <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-2xl border-b border-green-200">
                  <CardTitle className="flex items-center text-green-800">
                    <div className="bg-green-500 p-2 rounded-lg mr-3">
                      <Pizza className="h-6 w-6 text-white" />
                    </div>
                    Gestione Menu Cliente
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Gestisci i prodotti che appaiono nella pagina menu per i clienti (/menu)
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Suspense fallback={<LoadingSpinner />}>
                    <CustomerMenuAdmin />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Management */}
            <TabsContent value="content">
              <div className="space-y-8">
                {/* Logo Management */}
                <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-2xl border-b border-purple-200">
                    <CardTitle className="flex items-center text-purple-800">
                      <div className="bg-purple-500 p-2 rounded-lg mr-3">
                        <Image className="h-6 w-6 text-white" />
                      </div>
                      Gestione Logo Principale
                    </CardTitle>
                    <CardDescription className="text-purple-600">
                      Carica e modifica il logo principale del ristorante (hero, footer, ecc.)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Suspense fallback={<LoadingSpinner />}>
                      <LogoEditor />
                    </Suspense>
                  </CardContent>
                </Card>

                {/* Navbar Logo Management */}
                <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-2xl border-b border-blue-200">
                    <CardTitle className="flex items-center text-blue-800">
                      <div className="bg-blue-500 p-2 rounded-lg mr-3">
                        <Image className="h-6 w-6 text-white" />
                      </div>
                      Gestione Logo Navbar
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      Configura il logo che appare nella barra di navigazione superiore
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Suspense fallback={<LoadingSpinner />}>
                      <NavbarLogoEditor />
                    </Suspense>
                  </CardContent>
                </Card>

                {/* Hero Content Management */}
                <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-t-2xl border-b border-indigo-200">
                    <CardTitle className="flex items-center text-indigo-800">
                      <div className="bg-indigo-500 p-2 rounded-lg mr-3">
                        <Globe className="h-6 w-6 text-white" />
                      </div>
                      Gestione Hero Section
                    </CardTitle>
                    <CardDescription className="text-indigo-600">
                      Modifica il contenuto e l'immagine hero (immagine destra)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Suspense fallback={<LoadingSpinner />}>
                      <HeroContentEditor />
                    </Suspense>
                  </CardContent>
                </Card>

                {/* We Offer Section Management */}
                <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-2xl border-b border-orange-200">
                    <CardTitle className="flex items-center text-orange-800">
                      <div className="bg-orange-500 p-2 rounded-lg mr-3">
                        <Pizza className="h-6 w-6 text-white" />
                      </div>
                      Gestione "We Offer" Section
                    </CardTitle>
                    <CardDescription className="text-orange-600">
                      Modifica la sezione "We Offer" con 3 offerte personalizzabili
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Suspense fallback={<LoadingSpinner />}>
                      <WeOfferManager />
                    </Suspense>
                  </CardContent>
                </Card>

                {/* Why Choose Us Section Management */}
                <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-t-2xl border-b border-yellow-200">
                    <CardTitle className="flex items-center text-yellow-800">
                      <div className="bg-yellow-500 p-2 rounded-lg mr-3">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      Gestione "Perché Sceglierci"
                    </CardTitle>
                    <CardDescription className="text-yellow-600">
                      Personalizza la sezione che spiega perché i clienti dovrebbero scegliere il tuo ristorante
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Suspense fallback={<LoadingSpinner />}>
                      <WhyChooseUsManager />
                    </Suspense>
                  </CardContent>
                </Card>

                {/* Chi Siamo Content Management */}
                <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-2xl border-b border-green-200">
                    <CardTitle className="flex items-center text-green-800">
                      <div className="bg-green-500 p-2 rounded-lg mr-3">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      Gestione Contenuto "Chi Siamo"
                    </CardTitle>
                    <CardDescription className="text-green-600">
                      Modifica tutti i testi della sezione Chi Siamo (multilingua)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Suspense fallback={<LoadingSpinner />}>
                      <ChiSiamoContentManager />
                    </Suspense>
                  </CardContent>
                </Card>

                {/* Chi Siamo Image Management */}
                <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-2xl border-b border-blue-200">
                    <CardTitle className="flex items-center text-blue-800">
                      <div className="bg-blue-500 p-2 rounded-lg mr-3">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      Gestione Immagine "Chi Siamo"
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      Gestisci l'immagine sul lato destro della sezione Chi Siamo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Suspense fallback={<LoadingSpinner />}>
                      <ChiSiamoImageManager />
                    </Suspense>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Gallery Management */}
            <TabsContent value="gallery">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Image className="mr-2" />
                    Gestione Galleria
                  </CardTitle>
                  <CardDescription>
                    Carica e organizza le immagini del ristorante
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<LoadingSpinner />}>
                    <GalleryManager />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Section Backgrounds Management */}
            <TabsContent value="backgrounds">
              <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-2xl border-b border-purple-200">
                  <CardTitle className="flex items-center text-purple-800">
                    <div className="bg-purple-500 p-2 rounded-lg mr-3">
                      <Image className="h-6 w-6 text-white" />
                    </div>
                    Gestione Sfondi Sezioni
                  </CardTitle>
                  <CardDescription className="text-purple-600">
                    Gestisci le immagini di sfondo per tutte le sezioni del sito web
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Suspense fallback={<LoadingSpinner />}>
                    <SectionBackgroundManager />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Flegrea Section Management */}
            <TabsContent value="flegrea-section">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Image className="mr-2" />
                    Gestione Sezione Flegrea
                  </CardTitle>
                  <CardDescription>
                    Gestisci contenuti e immagini della sezione Flegrea che ha sostituito la sezione video
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<LoadingSpinner />}>
                    <FlegreaSectionManager />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {/* YouTube Management */}
            <TabsContent value="youtube">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="mr-2" />
                    Gestione Video YouTube
                  </CardTitle>
                  <CardDescription>
                    Gestisci i video YouTube mostrati sul sito
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<LoadingSpinner />}>
                    <YouTubeManager />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Comments Management */}
            <TabsContent value="comments">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2" />
                    Gestione Commenti
                  </CardTitle>
                  <CardDescription>
                    Modera commenti e recensioni dei clienti
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<LoadingSpinner />}>
                    <CommentsManager />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Popup Management */}
            <TabsContent value="popups">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2" />
                    Gestione Popup e Annunci
                  </CardTitle>
                  <CardDescription>
                    Crea e gestisci popup per occasioni speciali
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<LoadingSpinner />}>
                    <PopupManager />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings">
              <div className="space-y-8">
                {/* General Settings */}
                <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-2xl border-b border-gray-200">
                    <CardTitle className="flex items-center text-gray-800">
                      <div className="bg-gray-500 p-2 rounded-lg mr-3">
                        <Settings className="h-6 w-6 text-white" />
                      </div>
                      Impostazioni Generali
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Configura le impostazioni principali del ristorante
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Suspense fallback={<LoadingSpinner />}>
                      <SettingsManager />
                    </Suspense>
                  </CardContent>
                </Card>



                {/* Opening Hours Settings (Display) */}
                <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-2xl border-b border-purple-200">
                    <CardTitle className="flex items-center text-purple-800">
                      <div className="bg-purple-500 p-2 rounded-lg mr-3">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      Apertura Orari (Display)
                    </CardTitle>
                    <CardDescription className="text-purple-600">
                      Gestisci gli orari mostrati nel footer e contatti (diversi dagli orari business)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Suspense fallback={<LoadingSpinner />}>
                      <OpeningHoursManager />
                    </Suspense>
                  </CardContent>
                </Card>

                {/* Delivery & Payment Settings */}
                <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-2xl border-b border-green-200">
                    <CardTitle className="flex items-center text-green-800">
                      <div className="bg-green-500 p-2 rounded-lg mr-3">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      Consegne e Pagamenti
                    </CardTitle>
                    <CardDescription className="text-green-600">
                      Configura zone di consegna, tariffe e metodi di pagamento
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Suspense fallback={<LoadingSpinner />}>
                      <ShippingZoneManager />
                    </Suspense>
                  </CardContent>
                </Card>

                {/* Stripe Payment Settings */}
                <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-2xl border-b border-purple-200">
                    <CardTitle className="flex items-center text-purple-800">
                      <div className="bg-purple-500 p-2 rounded-lg mr-3">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      Configurazione Stripe
                    </CardTitle>
                    <CardDescription className="text-purple-600">
                      Gestisci le impostazioni di pagamento Stripe
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Suspense fallback={<LoadingSpinner />}>
                      <StripeSettings />
                    </Suspense>
                  </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-2xl border-b border-orange-200">
                    <CardTitle className="flex items-center text-orange-800">
                      <div className="bg-orange-500 p-2 rounded-lg mr-3">
                        <Bell className="h-6 w-6 text-white" />
                      </div>
                      Impostazioni Notifiche
                    </CardTitle>
                    <CardDescription className="text-orange-600">
                      Configura impostazioni generali di notifica (ordini gestiti in sezione separata)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Suspense fallback={<LoadingSpinner />}>
                      <NotificationSettings />
                    </Suspense>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Business Hours Management */}
            <TabsContent value="business-hours">
              <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-2xl border-b border-orange-200">
                  <CardTitle className="flex items-center text-orange-800">
                    <div className="bg-orange-500 p-2 rounded-lg mr-3">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    Orari Business (Ordini)
                  </CardTitle>
                  <CardDescription className="text-orange-600">
                    Gestisci quando i clienti possono effettuare ordini online
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <BusinessHoursManager />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Shipping Zones Management */}
            <TabsContent value="shipping-zones">
              <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-2xl border-b border-green-200">
                  <CardTitle className="flex items-center text-green-800">
                    <div className="bg-green-500 p-2 rounded-lg mr-3">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    Zone di Consegna
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Configura zone di consegna, tariffe e metodi di pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ShippingZoneManager />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stripe Settings */}
            <TabsContent value="stripe-settings">
              <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-2xl border-b border-purple-200">
                  <CardTitle className="flex items-center text-purple-800">
                    <div className="bg-purple-500 p-2 rounded-lg mr-3">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    Configurazione Stripe
                  </CardTitle>
                  <CardDescription className="text-purple-600">
                    Gestisci le impostazioni di pagamento Stripe
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Suspense fallback={<LoadingSpinner />}>
                    <StripeSettings />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications">
              <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-2xl border-b border-blue-200">
                  <CardTitle className="flex items-center text-blue-800">
                    <div className="bg-blue-500 p-2 rounded-lg mr-3">
                      <Bell className="h-6 w-6 text-white" />
                    </div>
                    Impostazioni Notifiche
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    Configura impostazioni generali di notifica
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Suspense fallback={<LoadingSpinner />}>
                    <NotificationSettings />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Info Management */}
            <TabsContent value="contact-info">
              <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-2xl border-b border-blue-200">
                  <CardTitle className="flex items-center text-blue-800">
                    <div className="bg-blue-500 p-2 rounded-lg mr-3">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    Gestione Informazioni di Contatto
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    Gestisci tutte le informazioni di contatto visualizzate nel footer e nelle sezioni contatti
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Suspense fallback={<LoadingSpinner />}>
                    <ContactInfoManager />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Category Extras Management */}
            <TabsContent value="category-extras">
              <Card className="bg-white rounded-2xl shadow-xl border border-gray-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-t-2xl border-b border-blue-200">
                  <CardTitle className="flex items-center text-blue-800">
                    <div className="bg-blue-500 p-2 rounded-lg mr-3">
                      <Settings className="h-6 w-6 text-white" />
                    </div>
                    Gestione Extra per Categorie
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    Controlla quali categorie possono avere extra aggiunti durante l'ordine
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Suspense fallback={<LoadingSpinner />}>
                    <CategoryExtrasManager />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>


            {/* Database Test */}
            <TabsContent value="database-test">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2" />
                    Database Connection Test
                  </CardTitle>
                  <CardDescription>
                    Test database connectivity and gallery data loading
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<LoadingSpinner />}>
                    <DatabaseTest />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Connection Test */}
            <TabsContent value="system-test">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2" />
                    System Connection Test
                  </CardTitle>
                  <CardDescription>
                    Test complete system: Products ↔ Admin, Content Management, Real-time Updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<LoadingSpinner />}>
                    <SystemConnectionTest />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Debugger */}
            <TabsContent value="products-debug">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Pizza className="mr-2" />
                    Products Database Debugger
                  </CardTitle>
                  <CardDescription>
                    Debug products database, check data, and create sample products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProductsDebugger />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Menu Products Connection Test */}
            <TabsContent value="menu-products-test">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MenuIcon className="mr-2" />
                    Menu & Products Connection Test
                  </CardTitle>
                  <CardDescription>
                    Test how menu and products sections connect to the database
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<LoadingSpinner />}>
                    <MenuProductsConnectionTest />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schema Fixer */}
            <TabsContent value="schema-fixer">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wrench className="mr-2" />
                    Products Schema Fixer
                  </CardTitle>
                  <CardDescription>
                    Fix database schema issues and missing columns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProductsSchemaFixer />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schema Updater */}
            <TabsContent value="schema-updater">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wrench className="mr-2" />
                    Database Schema Updater
                  </CardTitle>
                  <CardDescription>
                    Add advanced features to products table including stock management, SEO fields, and more
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<LoadingSpinner />}>
                    <DatabaseSchemaUpdater />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schema Migrator */}
            <TabsContent value="schema-migrator">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="mr-2" />
                    Content Sections Schema Migrator
                  </CardTitle>
                  <CardDescription>
                    Fix content_sections table schema and RLS policies for image uploads
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<LoadingSpinner />}>
                    <DatabaseSchemaMigrator />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schema Test */}
            <TabsContent value="schema-test">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2" />
                    Database Schema Test
                  </CardTitle>
                  <CardDescription>
                    Test database schema and RLS policies for content_sections table
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<LoadingSpinner />}>
                    <DatabaseSchemaTest />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>



            {/* Frontend Connection Tester */}
            <TabsContent value="frontend-test">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2" />
                    Frontend Database Connection Tester
                  </CardTitle>
                  <CardDescription>
                    Test how frontend components connect to the database
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<LoadingSpinner />}>
                    <FrontendConnectionTester />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {/* iOS Audio Test */}
            <TabsContent value="ios-audio-test">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Volume2 className="mr-2" />
                    iOS Audio Notification Test
                  </CardTitle>
                  <CardDescription>
                    Test and debug audio notifications on iOS devices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<LoadingSpinner />}>
                    <IOSAudioTest />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            {/* YouTube Connection Test */}
            <TabsContent value="youtube-test">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="mr-2" />
                    Test Connessione YouTube
                  </CardTitle>
                  <CardDescription>
                    Verifica la connessione tra admin panel e frontend per i video YouTube
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<LoadingSpinner />}>
                    <YouTubeConnectionTest />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Notification System removed from admin panel to prevent conflicts */}
      {/* UnifiedNotificationSystem now only runs in the ordini page */}
    </div>
  );
};

export default PizzeriaAdminPanel;
