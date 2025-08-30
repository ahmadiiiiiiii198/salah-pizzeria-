import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: string;
  backgroundImage?: string;
}

const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backgroundRefreshKey, setBackgroundRefreshKey] = useState(Date.now());
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: 'Corso Palermo, 34/B, 10152 Torino TO',
    phone: '+393285673396',
    email: '',
    hours: 'lunedì: 11-03\nmartedì: 11-03\nmercoledì: 11-03\ngiovedì: 11-03\nvenerdì: 11-03\nsabato: 11-03\ndomenica: 11-03'
  });

  // Load contact information from database
  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'contactContent')
          .single();

        if (data?.value) {
          setContactInfo({
            address: data.value.address || contactInfo.address,
            phone: data.value.phone || contactInfo.phone,
            email: data.value.email || '',
            hours: data.value.hours || contactInfo.hours
          });
        }
      } catch (error) {
        console.error('Failed to load contact info:', error);
      }
    };

    loadContactInfo();
  }, []);

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const subjectOptions = [
    { value: 'reservation', label: '🥙 Prenotazione Tavolo' },
    { value: 'order', label: '📞 Ordine Telefonico' },
    { value: 'kebab', label: '🥙 Kebab e Specialità Turche' },
    { value: 'pizza', label: '🍕 Pizza Italiana' },
    { value: 'catering', label: '🎉 Catering/Eventi' },
    { value: 'complaint', label: '😔 Reclamo' },
    { value: 'compliment', label: '😊 Complimento' },
    { value: 'info', label: 'ℹ️ Informazioni Generali' },
    { value: 'other', label: '💬 Altro' }
  ];

  // Load contact info from database
  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'contactContent')
          .single();

        if (data?.value) {
          const value = data.value as any;
          setContactInfo(prevInfo => ({
            address: value.address || prevInfo.address,
            phone: value.phone || prevInfo.phone,
            email: value.email || prevInfo.email,
            hours: value.hours || prevInfo.hours,
            backgroundImage: value.backgroundImage || prevInfo.backgroundImage
          }));
        }
      } catch (error) {
        console.error('Error loading contact info:', error);
      }
    };

    loadContactInfo();
  }, []);

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: 'Campi Obbligatori',
        description: 'Per favore compila tutti i campi obbligatori.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      // Create order from contact form
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone || null,
          customer_address: null,
          total_amount: 0,
          status: 'pending',
          payment_status: 'pending',
          notes: `Contact Form Request - Subject: ${subjectOptions.find(opt => opt.value === formData.subject)?.label}\nMessage: ${formData.message}`,
          metadata: {
            source: 'contact_form',
            subject: formData.subject,
            original_message: formData.message
          }
        })
        .select()
        .single();

      if (orderError) throw orderError;

      toast({
        title: 'Messaggio Inviato!',
        description: `Grazie ${formData.name}! Abbiamo ricevuto il tuo messaggio e ti risponderemo presto.`,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore durante l\'invio del messaggio. Riprova.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Background image with cache busting
  const backgroundImageUrl = contactInfo.backgroundImage 
    ? `${contactInfo.backgroundImage}?v=${backgroundRefreshKey}`
    : null;

  const sectionStyle = backgroundImageUrl ? {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${backgroundImageUrl}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : {};

  return (
    <section
      id="contact"
      className="py-20 relative bg-gradient-to-br from-efes-cream to-efes-warm-white"
      style={sectionStyle}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-efes-gold rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-efes-bronze rounded-full blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-efes-light-gold rounded-full blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating kebab and food icons */}
      <div className="absolute top-20 right-20 text-efes-gold/30 animate-float">
        <span className="text-5xl">🥙</span>
      </div>
      <div className="absolute bottom-20 left-20 text-efes-bronze/30 animate-float animation-delay-2000">
        <span className="text-4xl">🍕</span>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6 space-x-4">
            <div className="bg-efes-gold/10 p-4 rounded-full border-2 border-efes-gold/20">
              <span className="text-4xl">🥙</span>
            </div>
            <div className="bg-efes-bronze/10 p-4 rounded-full border-2 border-efes-bronze/20">
              <span className="text-4xl">🍕</span>
            </div>
            <div className="bg-efes-light-gold/10 p-4 rounded-full border-2 border-efes-light-gold/20">
              <Phone className="h-12 w-12 text-efes-gold" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-efes-dark-navy mb-6 efes-heading drop-shadow-lg">
            📞 Contattaci
          </h2>
          <p className="text-xl text-efes-charcoal max-w-3xl mx-auto leading-relaxed font-raleway">
            Siamo qui per soddisfare la tua voglia di autentico kebap turco e deliziosa pizza italiana!
            Contattaci per prenotazioni, eventi speciali e per scoprire i nostri piatti da EFES KEBAP.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Contact Form */}
          <Card className="shadow-2xl border-2 border-efes-gold/30 bg-efes-warm-white/95 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-efes-gold to-efes-bronze text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold flex items-center gap-3 efes-heading text-white">
                <span className="text-2xl">🥙</span>
                Ordina o Scrivi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Nome Completo *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Il tuo nome"
                      required
                      className="border-efes-gold/30 focus:border-efes-gold focus:ring-efes-gold/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="la-tua-email@esempio.com"
                      required
                      className="border-efes-gold/30 focus:border-efes-gold focus:ring-efes-gold/20"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      Telefono
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+39 123 456 7890"
                      className="border-efes-gold/30 focus:border-efes-gold focus:ring-efes-gold/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-700 font-medium">
                      Oggetto *
                    </Label>
                    <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                      <SelectTrigger className="border-efes-gold/30 focus:border-efes-gold focus:ring-efes-gold/20">
                        <SelectValue placeholder="Seleziona un oggetto" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjectOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-700 font-medium">
                    Messaggio *
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Scrivi il tuo messaggio qui..."
                    rows={6}
                    required
                    className="border-efes-gold/30 focus:border-efes-gold focus:ring-efes-gold/20 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full efes-btn-primary transform hover:scale-105 shadow-lg font-montserrat"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Invio in corso...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Invia Messaggio
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="shadow-2xl border-2 border-efes-bronze/30 bg-efes-warm-white/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-efes-bronze to-efes-dark-gold text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold flex items-center gap-3 efes-heading text-white">
                  <MapPin className="h-6 w-6" />
                  📍 Informazioni di Contatto
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-efes-gold/10 p-3 rounded-full border border-efes-gold/20">
                    <MapPin className="h-6 w-6 text-efes-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-efes-dark-navy mb-1 efes-heading">Indirizzo</h3>
                    <p className="text-efes-charcoal font-raleway">{contactInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-efes-bronze/10 p-3 rounded-full border border-efes-bronze/20">
                    <Phone className="h-6 w-6 text-efes-bronze" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-efes-dark-navy mb-1 efes-heading">Telefono</h3>
                    <a href={`tel:${contactInfo.phone}`} className="text-efes-gold hover:text-efes-dark-gold font-medium font-raleway transition-colors">
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                {contactInfo.email && (
                  <div className="flex items-start space-x-4">
                    <div className="bg-efes-light-gold/10 p-3 rounded-full border border-efes-light-gold/20">
                      <Mail className="h-6 w-6 text-efes-light-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-efes-dark-navy mb-1 efes-heading">Email</h3>
                      <a href={`mailto:${contactInfo.email}`} className="text-efes-gold hover:text-efes-dark-gold font-medium font-raleway transition-colors">
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-4">
                  <div className="bg-efes-gold/10 p-3 rounded-full border border-efes-gold/20">
                    <Clock className="h-6 w-6 text-efes-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-efes-dark-navy mb-1 efes-heading">Orari di Apertura</h3>
                    <div className="text-efes-charcoal font-raleway whitespace-pre-line">
                      {contactInfo.hours || 'Lun-Dom: 11:00-03:00'}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-efes-gold/20">
                  <div className="flex items-center justify-center">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(contactInfo.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="efes-btn-primary inline-flex items-center transform hover:scale-105 shadow-lg"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Indicazioni
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
