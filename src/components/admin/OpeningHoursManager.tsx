import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Clock, Save, RefreshCw, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { restaurantHoursService } from '@/services/pizzeriaHoursService';
import { adminUpsertSetting } from '@/utils/adminDatabaseUtils';

interface DayOpeningHours {
  open: string;
  close: string;
  closed: boolean;
}

interface WeeklyOpeningHours {
  monday: DayOpeningHours;
  tuesday: DayOpeningHours;
  wednesday: DayOpeningHours;
  thursday: DayOpeningHours;
  friday: DayOpeningHours;
  saturday: DayOpeningHours;
  sunday: DayOpeningHours;
}

const OpeningHoursManager = () => {
  const { toast } = useToast();
  const [hours, setHours] = useState<WeeklyOpeningHours>({
    monday: { open: '18:00', close: '23:00', closed: false },
    tuesday: { open: '18:00', close: '23:00', closed: false },
    wednesday: { open: '18:00', close: '23:00', closed: false },
    thursday: { open: '18:00', close: '23:00', closed: false },
    friday: { open: '18:00', close: '24:00', closed: false },
    saturday: { open: '18:00', close: '24:00', closed: false },
    sunday: { open: '18:00', close: '23:00', closed: false }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadOpeningHours();
  }, []);

  const loadOpeningHours = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'opening_hours')
        .single();

      if (data?.value) {
        setHours(data.value as WeeklyOpeningHours);
        console.log('✅ Opening hours loaded:', data.value);
      }
    } catch (error) {
      console.error('❌ Error loading opening hours:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare gli orari di apertura",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateDayHours = (day: keyof WeeklyOpeningHours, field: keyof DayOpeningHours, value: any) => {
    setHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  // Helper function to format opening_hours for display
  const formatOpeningHoursForDisplay = (hours: WeeklyOpeningHours): string => {
    // Check if all days have the same hours
    const days = Object.values(hours);
    const firstDay = days[0];

    const allSame = days.every((day) =>
      day.closed === firstDay.closed &&
      day.open === firstDay.open &&
      day.close === firstDay.close
    );

    if (allSame && !firstDay.closed) {
      return `APERTO 7 SU 7 DALLE ${firstDay.open} ALLE ${firstDay.close}`;
    }

    // If not all same, show most common hours
    const openDays = days.filter((day) => !day.closed);
    if (openDays.length === 0) {
      return 'CHIUSO';
    }

    const mostCommon = openDays[0];
    return `APERTO 7 SU 7 DALLE ${mostCommon.open} ALLE ${mostCommon.close}`;
  };

  const saveOpeningHours = async () => {
    try {
      setIsSaving(true);
      console.log('💾 [OpeningHoursManager] Saving opening hours:', hours);

      // Save detailed hours to opening_hours setting
      await adminUpsertSetting('opening_hours', hours);

      // Format and save display string to heroContent.openingHours
      const formattedHours = formatOpeningHoursForDisplay(hours);

      // Get current heroContent and update only the openingHours field
      const { data: heroData } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'heroContent')
        .single();

      if (heroData?.value) {
        const updatedHeroContent = {
          ...heroData.value,
          openingHours: formattedHours
        };
        await adminUpsertSetting('heroContent', updatedHeroContent);
        console.log('✅ [OpeningHoursManager] Updated heroContent.openingHours:', formattedHours);
      }

      // Force refresh the restaurant hours service cache
      restaurantHoursService.forceRefresh();
      console.log('🔄 [OpeningHoursManager] Restaurant hours cache refreshed');

      toast({
        title: "Successo",
        description: "Orari di apertura salvati con successo",
      });

      console.log('✅ [OpeningHoursManager] Opening hours saved successfully');
    } catch (error) {
      console.error('❌ [OpeningHoursManager] Error saving opening hours:', error);
      toast({
        title: "Errore",
        description: "Errore nel salvare gli orari di apertura",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const dayNames = {
    monday: 'Lunedì',
    tuesday: 'Martedì',
    wednesday: 'Mercoledì',
    thursday: 'Giovedì',
    friday: 'Venerdì',
    saturday: 'Sabato',
    sunday: 'Domenica'
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Orari di Apertura (Display)
        </CardTitle>
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Questi sono gli orari di apertura del ristorante per la visualizzazione.</p>
            <p>Vengono mostrati nel footer, nella sezione contatti e nell'hero. Sono diversi dagli "Orari Business" che limitano quando i clienti possono ordinare.</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Caricamento orari...</span>
          </div>
        ) : (
          <>
            {Object.entries(dayNames).map(([day, displayName]) => {
              const dayHours = hours[day as keyof WeeklyOpeningHours];
              return (
                <div key={day} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 border rounded-lg">
                  <div className="font-medium">{displayName}</div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={!dayHours.closed}
                      onCheckedChange={(checked) => updateDayHours(day as keyof WeeklyOpeningHours, 'closed', !checked)}
                    />
                    <Label className="text-sm">
                      {dayHours.closed ? 'Chiuso' : 'Aperto'}
                    </Label>
                  </div>

                  {!dayHours.closed && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor={`${day}-open`} className="text-sm">Apertura</Label>
                        <Input
                          id={`${day}-open`}
                          type="time"
                          value={dayHours.open}
                          onChange={(e) => updateDayHours(day as keyof WeeklyOpeningHours, 'open', e.target.value)}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`${day}-close`} className="text-sm">Chiusura</Label>
                        <Input
                          id={`${day}-close`}
                          type="time"
                          value={dayHours.close}
                          onChange={(e) => updateDayHours(day as keyof WeeklyOpeningHours, 'close', e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            <div className="flex gap-4 pt-4">
              <Button 
                onClick={saveOpeningHours} 
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving ? 'Salvando...' : 'Salva Orari di Apertura'}
              </Button>

              <Button 
                variant="outline" 
                onClick={loadOpeningHours}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Ricarica
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OpeningHoursManager;
