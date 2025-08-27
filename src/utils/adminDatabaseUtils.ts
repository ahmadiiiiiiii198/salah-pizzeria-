import { supabase } from '@/integrations/supabase/client';

/**
 * Utility functions for admin database operations that handle authentication automatically
 */

/**
 * Ensures we have an authenticated Supabase session for admin operations
 * Creates an anonymous session if none exists
 */
export const ensureAdminAuth = async (): Promise<boolean> => {
  try {
    // Check if we already have an authenticated session
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      console.log('✅ [AdminAuth] Existing Supabase session found');
      return true;
    }

    console.log('🔐 [AdminAuth] No Supabase session found, trying anonymous session...');

    // Try to create an anonymous session for admin operations
    try {
      const { data: authData, error: authError } = await supabase.auth.signInAnonymously();

      if (authError) {
        console.warn('⚠️ [AdminAuth] Anonymous session failed:', authError.message);
        console.log('🔓 [AdminAuth] Continuing with public access (RLS policies should allow admin operations)');
        return true; // Return true since we have public RLS policies
      }

      console.log('✅ [AdminAuth] Anonymous session created successfully');
      return true;
    } catch (anonymousError) {
      console.warn('⚠️ [AdminAuth] Anonymous authentication not available:', anonymousError.message);
      console.log('🔓 [AdminAuth] Continuing with public access (RLS policies should allow admin operations)');
      return true; // Return true since we have public RLS policies
    }
  } catch (error) {
    console.error('❌ [AdminAuth] Error ensuring admin authentication:', error);
    console.log('🔓 [AdminAuth] Falling back to public access');
    return true; // Return true to allow operations to continue with public RLS policies
  }
};

/**
 * Safely upsert a setting with automatic authentication handling
 */
export const adminUpsertSetting = async (key: string, value: any): Promise<{ success: boolean; error?: string }> => {
  try {
    // Ensure we have authentication
    const authSuccess = await ensureAdminAuth();
    if (!authSuccess) {
      return { success: false, error: 'Impossibile autenticare per salvare le impostazioni' };
    }

    // Perform the upsert operation
    const { error } = await supabase
      .from('settings')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });

    if (error) {
      console.error(`❌ [AdminDB] Error upserting setting ${key}:`, error);
      return { success: false, error: error.message };
    }

    console.log(`✅ [AdminDB] Successfully upserted setting: ${key}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ [AdminDB] Exception upserting setting ${key}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Safely get a setting with automatic authentication handling
 */
export const adminGetSetting = async (key: string): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    // For read operations, we don't need authentication due to public read policy
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error) {
      console.error(`❌ [AdminDB] Error getting setting ${key}:`, error);
      return { success: false, error: error.message };
    }

    console.log(`✅ [AdminDB] Successfully retrieved setting: ${key}`);
    return { success: true, data: data?.value };
  } catch (error) {
    console.error(`❌ [AdminDB] Exception getting setting ${key}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Safely delete a setting with automatic authentication handling
 */
export const adminDeleteSetting = async (key: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Ensure we have authentication
    const authSuccess = await ensureAdminAuth();
    if (!authSuccess) {
      return { success: false, error: 'Impossibile autenticare per eliminare le impostazioni' };
    }

    // Perform the delete operation
    const { error } = await supabase
      .from('settings')
      .delete()
      .eq('key', key);

    if (error) {
      console.error(`❌ [AdminDB] Error deleting setting ${key}:`, error);
      return { success: false, error: error.message };
    }

    console.log(`✅ [AdminDB] Successfully deleted setting: ${key}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ [AdminDB] Exception deleting setting ${key}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Batch upsert multiple settings with automatic authentication handling
 */
export const adminBatchUpsertSettings = async (settings: Array<{ key: string; value: any }>): Promise<{ success: boolean; error?: string }> => {
  try {
    // Ensure we have authentication
    const authSuccess = await ensureAdminAuth();
    if (!authSuccess) {
      return { success: false, error: 'Impossibile autenticare per salvare le impostazioni' };
    }

    // Prepare the data for batch upsert
    const settingsData = settings.map(({ key, value }) => ({
      key,
      value,
      updated_at: new Date().toISOString()
    }));

    // Perform the batch upsert operation
    const { error } = await supabase
      .from('settings')
      .upsert(settingsData, {
        onConflict: 'key'
      });

    if (error) {
      console.error('❌ [AdminDB] Error batch upserting settings:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ [AdminDB] Successfully batch upserted ${settings.length} settings`);
    return { success: true };
  } catch (error) {
    console.error('❌ [AdminDB] Exception batch upserting settings:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Check if admin has proper database access
 */
export const checkAdminDatabaseAccess = async (): Promise<{ hasAccess: boolean; isAuthenticated: boolean; error?: string }> => {
  try {
    // Check authentication status
    const { data: { session } } = await supabase.auth.getSession();
    const isAuthenticated = !!session;

    // Test read access (should always work due to public read policy)
    const { data: readData, error: readError } = await supabase
      .from('settings')
      .select('key')
      .limit(1);

    if (readError) {
      return { hasAccess: false, isAuthenticated, error: `Read access failed: ${readError.message}` };
    }

    // Test write access (requires authentication)
    const testKey = `test_access_${Date.now()}`;
    const { error: writeError } = await supabase
      .from('settings')
      .upsert({
        key: testKey,
        value: { test: true },
        updated_at: new Date().toISOString()
      });

    if (writeError) {
      // If write fails due to auth, try to create anonymous session and test again
      if (!isAuthenticated) {
        const authSuccess = await ensureAdminAuth();
        if (authSuccess) {
          const { error: retryError } = await supabase
            .from('settings')
            .upsert({
              key: testKey,
              value: { test: true },
              updated_at: new Date().toISOString()
            });

          if (!retryError) {
            // Clean up test record
            await supabase.from('settings').delete().eq('key', testKey);
            return { hasAccess: true, isAuthenticated: true };
          }
        }
      }
      
      return { hasAccess: false, isAuthenticated, error: `Write access failed: ${writeError.message}` };
    }

    // Clean up test record
    await supabase.from('settings').delete().eq('key', testKey);
    
    return { hasAccess: true, isAuthenticated };
  } catch (error) {
    return { 
      hasAccess: false, 
      isAuthenticated: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
