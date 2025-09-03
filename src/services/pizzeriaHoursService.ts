import { supabase } from '@/integrations/supabase/client';

interface RestaurantHours {
  isOpen: boolean;
  periods: {
    openTime: string;
    closeTime: string;
  }[];
}

interface WeeklyRestaurantHours {
  monday: RestaurantHours;
  tuesday: RestaurantHours;
  wednesday: RestaurantHours;
  thursday: RestaurantHours;
  friday: RestaurantHours;
  saturday: RestaurantHours;
  sunday: RestaurantHours;
}

interface RestaurantHoursResult {
  isOpen: boolean;
  displayText: string;
  todayHours?: RestaurantHours;
}

class RestaurantHoursService {
  private static instance: RestaurantHoursService;
  private cachedHours: WeeklyRestaurantHours | null = null;
  private lastFetch = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): RestaurantHoursService {
    if (!RestaurantHoursService.instance) {
      RestaurantHoursService.instance = new RestaurantHoursService();
    }
    return RestaurantHoursService.instance;
  }

  /**
   * Convert opening_hours format to display format
   */
  private convertOpeningHoursToDisplayHours(openingHours: any): WeeklyRestaurantHours {
    const convertDay = (dayHours: any): RestaurantHours => {
      if (dayHours.closed) {
        return { isOpen: false, periods: [] };
      }

      return {
        isOpen: true,
        periods: [{
          openTime: dayHours.open,
          closeTime: dayHours.close
        }]
      };
    };

    return {
      monday: convertDay(openingHours.monday),
      tuesday: convertDay(openingHours.tuesday),
      wednesday: convertDay(openingHours.wednesday),
      thursday: convertDay(openingHours.thursday),
      friday: convertDay(openingHours.friday),
      saturday: convertDay(openingHours.saturday),
      sunday: convertDay(openingHours.sunday)
    };
  }

  /**
   * Get default restaurant hours based on Google Maps information
   */
  private getDefaultHours(): WeeklyRestaurantHours {
    return {
      monday: {
        isOpen: true,
        periods: [
          { openTime: '12:00', closeTime: '14:30' },
          { openTime: '18:00', closeTime: '00:00' }
        ]
      },
      tuesday: {
        isOpen: true,
        periods: [
          { openTime: '12:00', closeTime: '14:30' },
          { openTime: '18:00', closeTime: '00:00' }
        ]
      },
      wednesday: {
        isOpen: true,
        periods: [
          { openTime: '12:00', closeTime: '14:30' },
          { openTime: '18:00', closeTime: '00:00' }
        ]
      },
      thursday: {
        isOpen: true,
        periods: [
          { openTime: '12:00', closeTime: '14:30' },
          { openTime: '18:00', closeTime: '00:00' }
        ]
      },
      friday: {
        isOpen: true,
        periods: [
          { openTime: '12:00', closeTime: '14:30' },
          { openTime: '18:30', closeTime: '02:00' }
        ]
      },
      saturday: {
        isOpen: true,
        periods: [
          { openTime: '18:30', closeTime: '02:00' }
        ]
      },
      sunday: {
        isOpen: true,
        periods: [
          { openTime: '12:00', closeTime: '14:30' },
          { openTime: '18:00', closeTime: '00:00' }
        ]
      }
    };
  }

  /**
   * Get restaurant hours from database with fallback to defaults
   */
  async getRestaurantHours(): Promise<WeeklyRestaurantHours> {
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.cachedHours && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.cachedHours;
    }

    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'opening_hours')
        .single();

      if (error || !data?.value) {
        console.log('📅 [RestaurantHours] Using default hours (no database entry)');
        this.cachedHours = this.getDefaultHours();
      } else {
        // Convert opening_hours format to display format
        const openingHours = data.value;
        this.cachedHours = this.convertOpeningHoursToDisplayHours(openingHours);
        console.log('📅 [RestaurantHours] Loaded from opening_hours and converted');
      }

      this.lastFetch = now;
      return this.cachedHours;
    } catch (error) {
      console.error('❌ [RestaurantHours] Error loading hours:', error);
      return this.getDefaultHours();
    }
  }

  /**
   * Check if restaurant is currently open and get display text
   */
  async getRestaurantStatus(checkTime?: Date): Promise<RestaurantHoursResult> {
    const hours = await this.getRestaurantHours();
    const now = checkTime || new Date();
    
    // Get current day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = now.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[dayOfWeek] as keyof WeeklyRestaurantHours;
    
    const todayHours = hours[currentDay];
    
    if (!todayHours.isOpen) {
      return {
        isOpen: false,
        displayText: 'Chiuso Oggi',
        todayHours
      };
    }

    // Format display text for today's hours
    const periodsText = todayHours.periods.map(period => 
      `${period.openTime}-${period.closeTime}`
    ).join(', ');

    // Check if currently open
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    const isCurrentlyOpen = todayHours.periods.some(period => {
      const openTime = period.openTime;
      const closeTime = period.closeTime;
      
      // Handle overnight periods (e.g., 18:30-02:00)
      if (closeTime < openTime) {
        return currentTime >= openTime || currentTime <= closeTime;
      } else {
        return currentTime >= openTime && currentTime <= closeTime;
      }
    });

    return {
      isOpen: isCurrentlyOpen,
      displayText: periodsText,
      todayHours
    };
  }

  /**
   * Get formatted hours for a specific day
   */
  async getFormattedDayHours(day: keyof WeeklyRestaurantHours): Promise<string> {
    const hours = await this.getRestaurantHours();
    const dayHours = hours[day];
    
    if (!dayHours.isOpen) {
      return 'Chiuso';
    }
    
    return dayHours.periods.map(period => 
      `${period.openTime}-${period.closeTime}`
    ).join(', ');
  }

  /**
   * Get all formatted hours for display
   * Uses actual database values from pizzeriaDisplayHours
   */
  async getAllFormattedHours(): Promise<string> {
    try {
      const hours = await this.getRestaurantHours();
      const dayNames = [
        { key: 'monday', label: 'lunedì' },
        { key: 'tuesday', label: 'martedì' },
        { key: 'wednesday', label: 'mercoledì' },
        { key: 'thursday', label: 'giovedì' },
        { key: 'friday', label: 'venerdì' },
        { key: 'saturday', label: 'sabato' },
        { key: 'sunday', label: 'domenica' }
      ];

      const formattedDays = dayNames.map(({ key, label }) => {
        const dayHours = hours[key as keyof WeeklyRestaurantHours];

        if (!dayHours.isOpen) {
          return `${label}: Chiuso`;
        }

        // Format periods (e.g., "12:00-14:30, 18:00-00:00")
        const periodsText = dayHours.periods.map(period => {
          // Convert 24-hour format to simplified format (remove :00, convert 00:00 to 24:00)
          const formatTime = (time: string) => {
            if (time === '00:00') return '24';
            if (time.endsWith(':00')) return time.slice(0, -3);
            return time.replace(':', '');
          };

          return `${formatTime(period.openTime)}-${formatTime(period.closeTime)}`;
        }).join(', ');

        return `${label}: ${periodsText}`;
      });

      return formattedDays.join('\n');
    } catch (error) {
      console.error('❌ [RestaurantHours] Error formatting hours:', error);
      // Fallback to default format
      const formattedDays = [
        'lunedì: 11-03',
        'martedì: 11-03',
        'mercoledì: 11-03',
        'giovedì: 11-03',
        'venerdì: 11-03',
        'sabato: 11-03',
        'domenica: 11-03'
      ];
      return formattedDays.join('\n');
    }
  }

  /**
   * Get simple formatted hours for display (single line format)
   * NOTE: This returns hardcoded display hours for frontend consistency
   */
  async getSimpleFormattedHours(): Promise<string> {
    // Return hardcoded "11-03" format for all days as requested for display
    const formattedDays = [
      'lun: 11-03',
      'mar: 11-03',
      'mer: 11-03',
      'gio: 11-03',
      'ven: 11-03',
      'sab: 11-03',
      'dom: 11-03'
    ];

    return formattedDays.join(', ');
  }

  /**
   * Force refresh the cached hours (useful when businessHours are updated)
   */
  forceRefresh(): void {
    this.cachedHours = null;
    this.lastFetch = 0;
    console.log('🔄 [RestaurantHours] Cache cleared, will reload on next request');
  }
}

// Create singleton instance
export const restaurantHoursService = RestaurantHoursService.getInstance();
