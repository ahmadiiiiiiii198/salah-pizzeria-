import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Phone, Mail, MapPin, Clock, Save, RefreshCw, Loader2, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ContactInfo {
  // Basic contact information
  phone: string;
  email: string;
  address: string;
  website?: string;
  
  // Hours information
  hours: string;
  mapUrl?: string;
  
  // Restaurant info
  restaurant_name?: string;
  description?: string;
}

interface RestaurantInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  description: string;
}

const ContactInfoManager = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Contact content (used by Contact section and Footer)
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: '',
    email: '',
    address: '',
    website: '',
    hours: '',
    mapUrl: 'https://maps.google.com',
    restaurant_name: '',
    description: ''
  });

  // Restaurant info (used by Footer and other components)
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: ''
  });

  // Load all contact-related data
  const loadContactData = async () => {
    try {
      setIsLoading(true);
      console.log('📞 Loading contact information...');

      // Load contactContent
      const { data: contactData, error: contactError } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'contactContent')
        .single();

      if (contactData?.value) {
        setContactInfo({
          phone: contactData.value.phone || '',
          email: contactData.value.email || '',
          address: contactData.value.address || '',
          website: contactData.value.website || '',
          hours: contactData.value.hours || '',
          mapUrl: contactData.value.mapUrl || 'https://maps.google.com',
          restaurant_name: contactData.value.restaurant_name || '',
          description: contactData.value.description || ''
        });
      }

      // Load restaurantInfo
      const { data: restaurantData, error: restaurantError } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'restaurantInfo')
        .single();

      if (restaurantData?.value) {
        setRestaurantInfo({
          name: restaurantData.value.name || '',
          email: restaurantData.value.email || '',
          phone: restaurantData.value.phone || '',
          address: restaurantData.value.address || '',
          website: restaurantData.value.website || '',
          description: restaurantData.value.description || ''
        });
      }

      console.log('✅ Contact data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading contact data:', error);
      toast({
        title: 'Errore Caricamento',
        description: 'Impossibile caricare le informazioni di contatto',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContactData();
  }, []);

  // Handle input changes for contact info
  const handleContactChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Handle input changes for restaurant info
  const handleRestaurantChange = (field: keyof RestaurantInfo, value: string) => {
    setRestaurantInfo(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Save all contact information
  const saveContactData = async () => {
    try {
      setIsSaving(true);
      console.log('💾 Saving contact information...');

      // Update contactContent
      const { error: contactError } = await supabase
        .from('settings')
        .upsert({
          key: 'contactContent',
          value: contactInfo,
          updated_at: new Date().toISOString()
        });

      if (contactError) throw contactError;

      // Update restaurantInfo
      const { error: restaurantError } = await supabase
        .from('settings')
        .upsert({
          key: 'restaurantInfo',
          value: restaurantInfo,
          updated_at: new Date().toISOString()
        });

      if (restaurantError) throw restaurantError;

      // Also update individual settings for backward compatibility
      const updates = [
        { key: 'phone', value: contactInfo.phone },
        { key: 'email', value: contactInfo.email },
        { key: 'address', value: contactInfo.address },
        { key: 'website', value: contactInfo.website || restaurantInfo.website },
        { key: 'restaurant_name', value: restaurantInfo.name }
      ];

      for (const update of updates) {
        await supabase
          .from('settings')
          .upsert({
            key: update.key,
            value: update.value,
            updated_at: new Date().toISOString()
          });
      }

      setHasChanges(false);
      console.log('✅ Contact info saved successfully');
      
      toast({
        title: 'Informazioni Salvate',
        description: 'Le informazioni di contatto sono state aggiornate con successo',
      });

    } catch (error) {
      console.error('❌ Failed to save contact info:', error);
      toast({
        title: 'Errore Salvataggio',
        description: 'Impossibile salvare le informazioni di contatto',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Caricamento informazioni di contatto...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            onClick={saveContactData}
            disabled={!hasChanges || isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Salva Modifiche
          </Button>
          
          <Button
            variant="outline"
            onClick={loadContactData}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Ricarica
          </Button>
        </div>
        
        {hasChanges && (
          <span className="text-orange-600 text-sm font-medium">
            Modifiche non salvate
          </span>
        )}
      </div>

      {/* Contact Information Card */}
      <Card className="bg-white/95 backdrop-blur-sm border border-blue-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
          <CardTitle className="flex items-center gap-3 text-blue-800">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            Informazioni di Contatto (Footer & Sezione Contatti)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact-phone" className="text-gray-700 font-medium">
                Numero di Telefono
              </Label>
              <Input
                id="contact-phone"
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                placeholder="+39 123 456 7890"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="contact-email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                id="contact-email"
                type="email"
                value={contactInfo.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                placeholder="info@efespizzakebap.it"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contact-address" className="text-gray-700 font-medium">
              Indirizzo
            </Label>
            <Input
              id="contact-address"
              value={contactInfo.address}
              onChange={(e) => handleContactChange('address', e.target.value)}
              placeholder="Corso Palermo, 34/B, 10152 Torino TO"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="contact-hours" className="text-gray-700 font-medium">
              Orari di Apertura (Footer e Contatti)
            </Label>
            <Textarea
              id="contact-hours"
              value={contactInfo.hours}
              onChange={(e) => handleContactChange('hours', e.target.value)}
              placeholder="Lun-Dom: 11:00-03:00"
              className="mt-1"
              rows={3}
            />
            <p className="text-sm text-gray-500 mt-1">
              ✅ Questi orari vengono mostrati sia nel footer che nella sezione contatti. Per modificare gli orari che limitano gli ordini, usa la sezione "Orari Apertura" del pannello admin.
            </p>
          </div>

          <div>
            <Label htmlFor="contact-map" className="text-gray-700 font-medium">
              URL Mappa Google
            </Label>
            <Input
              id="contact-map"
              value={contactInfo.mapUrl}
              onChange={(e) => handleContactChange('mapUrl', e.target.value)}
              placeholder="https://maps.google.com/..."
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Restaurant Information Card */}
      <Card className="bg-white/95 backdrop-blur-sm border border-green-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <CardTitle className="flex items-center gap-3 text-green-800">
            <div className="p-2 bg-green-100 rounded-lg">
              <Globe className="w-5 h-5 text-green-600" />
            </div>
            Informazioni Ristorante (Footer & SEO)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="restaurant-name" className="text-gray-700 font-medium">
                Nome Ristorante
              </Label>
              <Input
                id="restaurant-name"
                value={restaurantInfo.name}
                onChange={(e) => handleRestaurantChange('name', e.target.value)}
                placeholder="Efes Pizza Kebap Torino"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="restaurant-website" className="text-gray-700 font-medium">
                Sito Web
              </Label>
              <Input
                id="restaurant-website"
                value={restaurantInfo.website}
                onChange={(e) => handleRestaurantChange('website', e.target.value)}
                placeholder="www.efespizzakebap.it"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="restaurant-email" className="text-gray-700 font-medium">
                Email Ristorante
              </Label>
              <Input
                id="restaurant-email"
                type="email"
                value={restaurantInfo.email}
                onChange={(e) => handleRestaurantChange('email', e.target.value)}
                placeholder="info@efespizzakebap.it"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="restaurant-phone" className="text-gray-700 font-medium">
                Telefono Ristorante
              </Label>
              <Input
                id="restaurant-phone"
                type="tel"
                value={restaurantInfo.phone}
                onChange={(e) => handleRestaurantChange('phone', e.target.value)}
                placeholder="+39 123 456 7890"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="restaurant-address" className="text-gray-700 font-medium">
              Indirizzo Ristorante
            </Label>
            <Input
              id="restaurant-address"
              value={restaurantInfo.address}
              onChange={(e) => handleRestaurantChange('address', e.target.value)}
              placeholder="Via Roma 123, 10123 Torino, Italia"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="restaurant-description" className="text-gray-700 font-medium">
              Descrizione Ristorante
            </Label>
            <Textarea
              id="restaurant-description"
              value={restaurantInfo.description}
              onChange={(e) => handleRestaurantChange('description', e.target.value)}
              placeholder="Autentico ristorante di pizza italiana e kebap turco nel cuore di Torino"
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Hours Information Card */}
      <Card className="bg-white/95 backdrop-blur-sm border border-green-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <CardTitle className="flex items-center gap-3 text-green-800">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            Gestione Orari - Semplificato!
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-green-50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-green-800 mb-2">Sistema Unificato:</h4>

            <div className="bg-white p-3 rounded border-l-4 border-green-400">
              <h5 className="font-medium text-green-800">📱 Orari di Apertura (Visualizzazione)</h5>
              <p className="text-sm text-green-700">Un solo campo che controlla gli orari mostrati sia nel footer che nella sezione contatti.</p>
              <p className="text-xs text-green-600 mt-1">Modificabile nel campo "Orari di Apertura" qui sopra.</p>
            </div>

            <div className="bg-white p-3 rounded border-l-4 border-blue-400">
              <h5 className="font-medium text-blue-800">🛒 Orari per Ordini (Funzionalità)</h5>
              <p className="text-sm text-blue-700">Orari che controllano quando i clienti possono effettuare ordini (separati dalla visualizzazione).</p>
              <p className="text-xs text-blue-600 mt-1">Gestiti nella sezione "Orari Apertura" del pannello admin.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Information Card */}
      <Card className="bg-white/95 backdrop-blur-sm border border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
          <CardTitle className="flex items-center gap-3 text-purple-800">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            Informazioni Servizi (Footer)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">Servizi Visualizzati nel Footer:</h4>
            <ul className="text-purple-700 space-y-1">
              <li>🍕 Pizza al Taglio</li>
              <li>🚚 Consegna a Domicilio</li>
              <li>👨‍🍳 Pizza Personalizzata</li>
              <li>🥤 Bevande e Dolci</li>
            </ul>
            <p className="text-sm text-purple-600 mt-3">
              I servizi sono gestiti tramite le traduzioni nel sistema. Per modificarli, usa la sezione "Contenuti" del pannello admin.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-gray-800">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
            Anteprima Informazioni
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div><strong>Nome:</strong> {restaurantInfo.name || 'Non impostato'}</div>
            <div><strong>Telefono:</strong> {contactInfo.phone || 'Non impostato'}</div>
            <div><strong>Email:</strong> {contactInfo.email || 'Non impostato'}</div>
            <div><strong>Indirizzo:</strong> {contactInfo.address || 'Non impostato'}</div>
            <div><strong>Orari:</strong> {contactInfo.hours || 'Non impostato'}</div>
            <div><strong>Descrizione:</strong> {restaurantInfo.description || 'Non impostato'}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactInfoManager;
