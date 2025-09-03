import { useState, useEffect } from 'react';
import { restaurantHoursService } from '@/services/pizzeriaHoursService';

interface UseRestaurantHoursResult {
  isOpen: boolean;
  displayText: string;
  isLoading: boolean;
  allHours: string;
  refreshHours: () => void;
}

/**
 * Hook for restaurant display hours (different from order hours)
 * This shows the actual opening/closing times of the restaurant for display purposes
 */
export const useRestaurantHours = (): UseRestaurantHoursResult => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayText, setDisplayText] = useState('12:00 - 24:00');
  const [allHours, setAllHours] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadRestaurantHours = async () => {
    try {
      setIsLoading(true);

      // Get current status and display text
      const status = await restaurantHoursService.getRestaurantStatus();
      setIsOpen(status.isOpen);
      setDisplayText(status.displayText);

      // Get all formatted hours
      const formatted = await restaurantHoursService.getAllFormattedHours();
      setAllHours(formatted);

      console.log('📅 [useRestaurantHours] Loaded:', {
        isOpen: status.isOpen,
        displayText: status.displayText
      });
    } catch (error) {
      console.error('❌ [useRestaurantHours] Error loading hours:', error);
      // Keep default values on error
    } finally {
      setIsLoading(false);
    }
  };

  const refreshHours = () => {
    loadRestaurantHours();
  };

  useEffect(() => {
    loadRestaurantHours();

    // Refresh every 5 minutes
    const interval = setInterval(loadRestaurantHours, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    isOpen,
    displayText,
    isLoading,
    allHours,
    refreshHours
  };
};

// Backward compatibility export
export const usePizzeriaHours = useRestaurantHours;
