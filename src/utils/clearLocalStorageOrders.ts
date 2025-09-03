// Utility to clear all localStorage and cookie-based order tracking data
// This ensures a clean transition to database-only order tracking

export const clearAllLocalStorageOrders = (): boolean => {
  try {
    console.log('🧹 Clearing all localStorage order tracking data...');
    
    // Clear only OLD order tracking localStorage keys (NOT client identity)
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key === 'pizzeria_order_tracking' ||
        key === 'pizzeria_last_order' ||
        key === 'pizzeria_active_order'
        // DO NOT REMOVE: pizzeria_client_identity, pizzeria_client_ip, pizzeria_migration_to_database_complete
      )) {
        keysToRemove.push(key);
      }
    }
    
    // Remove all identified keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log('🗑️ Removed localStorage key:', key);
    });
    
    console.log(`✅ Cleared ${keysToRemove.length} localStorage keys`);
    return true;
  } catch (error) {
    console.error('❌ Error clearing localStorage:', error);
    return false;
  }
};

export const clearAllOrderCookies = (): boolean => {
  try {
    console.log('🧹 Clearing all order tracking cookies...');
    
    // Get all cookies
    const cookies = document.cookie.split(';');
    let clearedCount = 0;
    
    for (const cookie of cookies) {
      const [name] = cookie.trim().split('=');
      if (name && (
        name === 'pizzeria_order_tracking' ||
        name === 'pizzeria_last_order' ||
        name === 'pizzeria_active_order'
        // DO NOT REMOVE: pizzeria_client_id (needed for client identity)
      )) {
        // Delete the cookie by setting it to expire in the past
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        console.log('🗑️ Removed cookie:', name);
        clearedCount++;
      }
    }
    
    console.log(`✅ Cleared ${clearedCount} cookies`);
    return true;
  } catch (error) {
    console.error('❌ Error clearing cookies:', error);
    return false;
  }
};

export const clearAllOrderTrackingData = (): boolean => {
  console.log('🧹 Starting complete order tracking data cleanup...');
  
  const localStorageCleared = clearAllLocalStorageOrders();
  const cookiesCleared = clearAllOrderCookies();
  
  if (localStorageCleared && cookiesCleared) {
    console.log('✅ All order tracking data cleared successfully');
    console.log('🔄 Order tracking now uses database-only approach');
    return true;
  } else {
    console.warn('⚠️ Some data may not have been cleared properly');
    return false;
  }
};

// Auto-clear on import (run once when the app starts)
export const initializeDatabaseOnlyTracking = (): void => {
  // Check if migration was already completed
  const migrationKey = 'pizzeria_migration_to_database_complete';
  if (localStorage.getItem(migrationKey)) {
    console.log('✅ Migration already completed - skipping cleanup');
    return;
  }

  // Only clear if there's actually OLD data to clear (not client identity)
  const hasOldLocalStorageData = localStorage.getItem('pizzeria_order_tracking') ||
                                 localStorage.getItem('pizzeria_last_order') ||
                                 localStorage.getItem('pizzeria_active_order');

  const hasOldCookieData = document.cookie.includes('pizzeria_order_tracking') ||
                           document.cookie.includes('pizzeria_last_order') ||
                           document.cookie.includes('pizzeria_active_order');

  if (hasOldLocalStorageData || hasOldCookieData) {
    console.log('🔄 Migrating from localStorage/cookie tracking to database-only tracking...');
    clearAllOrderTrackingData();

    // Mark migration as complete
    localStorage.setItem(migrationKey, 'true');
    console.log('✅ Migration to database-only order tracking complete');
  } else {
    // No old data found, just mark migration as complete
    localStorage.setItem(migrationKey, 'true');
    console.log('✅ No old tracking data found - migration marked complete');
  }
};
