import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Settings, Save, RefreshCw, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ensureAdminAuth } from '@/utils/adminDatabaseUtils';

interface CategoryExtrasSettings {
  id: string;
  name: string;
  slug: string;
  extras_enabled: boolean;
}

const CategoryExtrasManager = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [categories, setCategories] = useState<CategoryExtrasSettings[]>([]);
  const isMountedRef = useRef(true);

  // Storage key for persisting unsaved changes
  const STORAGE_KEY = 'categoryExtrasManager_unsavedChanges';

  // Save unsaved changes to localStorage
  const saveToLocalStorage = (categoriesData: CategoryExtrasSettings[], hasChangesFlag: boolean) => {
    if (hasChangesFlag) {
      const dataToSave = {
        categories: categoriesData,
        hasChanges: hasChangesFlag,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      console.log('💾 [CategoryExtrasManager] Unsaved changes saved to localStorage');
    } else {
      localStorage.removeItem(STORAGE_KEY);
      console.log('🗑️ [CategoryExtrasManager] Cleared localStorage (no changes)');
    }
  };

  // Load unsaved changes from localStorage
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedData = JSON.parse(saved);
        // Check if data is not too old (max 24 hours)
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        if (Date.now() - parsedData.timestamp < maxAge) {
          console.log('📂 [CategoryExtrasManager] Restored unsaved changes from localStorage');
          return parsedData;
        } else {
          console.log('⏰ [CategoryExtrasManager] Stored data too old, ignoring');
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('❌ [CategoryExtrasManager] Error loading from localStorage:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
    return null;
  };

  // Load categories from database
  const loadCategories = async (forceReload = false) => {
    // Prevent loading if currently saving to avoid conflicts
    if (isSaving) {
      console.log('⚠️ [CategoryExtrasManager] Skipping load - save in progress');
      return;
    }

    // Check for unsaved changes in localStorage first (only on initial load)
    if (!forceReload) {
      const savedData = loadFromLocalStorage();
      if (savedData) {
        setCategories(savedData.categories);
        setHasChanges(savedData.hasChanges);
        setIsLoading(false);
        toast({
          title: "Modifiche Ripristinate",
          description: "Sono state ripristinate delle modifiche non salvate",
          variant: "default",
        });
        return;
      }
    }

    try {
      setIsLoading(true);
      console.log('📋 Loading category extras settings...');

      // Ensure we have proper authentication for admin operations
      await ensureAdminAuth();

      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, extras_enabled')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setCategories(data || []);
        setHasChanges(false);
        // Clear localStorage since we're loading fresh data
        localStorage.removeItem(STORAGE_KEY);
        console.log('✅ Category extras settings loaded:', data?.length);
        console.log('   Loaded categories:', data?.map(c => ({
          id: c.id,
          name: c.name,
          extras_enabled: c.extras_enabled
        })));
      }
    } catch (error) {
      console.error('❌ Error loading categories:', error);
      if (isMountedRef.current) {
        toast({
          title: "Errore Caricamento",
          description: "Impossibile caricare le impostazioni delle categorie",
          variant: "destructive",
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // Load categories on mount
    loadCategories();

    // Add visibility change listener to handle page refresh/navigation
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👁️ [CategoryExtrasManager] Page became visible, checking for updates');
        // Only reload if we don't have unsaved changes
        if (!hasChanges) {
          loadCategories(true);
        } else {
          console.log('⚠️ [CategoryExtrasManager] Skipping reload - unsaved changes present');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMountedRef.current = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Keep empty dependency array to prevent unnecessary reloads

  // Save changes to localStorage whenever categories or hasChanges state changes
  useEffect(() => {
    if (categories.length > 0) {
      saveToLocalStorage(categories, hasChanges);
    }
  }, [categories, hasChanges]);

  // Update category extras setting
  const updateCategoryExtras = (categoryId: string, extrasEnabled: boolean) => {
    console.log(`🔄 [CategoryExtrasManager] Toggle function called!`);
    console.log(`   Category ID: ${categoryId}`);
    console.log(`   New value: ${extrasEnabled}`);
    console.log(`   Current hasChanges: ${hasChanges}`);

    // Find the category being updated
    const categoryToUpdate = categories.find(cat => cat.id === categoryId);
    console.log(`   Category found:`, categoryToUpdate?.name);
    console.log(`   Current extras_enabled:`, categoryToUpdate?.extras_enabled);

    setCategories(prev => {
      const updated = prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, extras_enabled: extrasEnabled }
          : cat
      );
      console.log(`   Updated categories:`, updated.map(c => ({ name: c.name, extras_enabled: c.extras_enabled })));
      return updated;
    });

    setHasChanges(true);
    console.log(`✅ [CategoryExtrasManager] State updated, hasChanges set to true`);
  };

  // Save changes to database
  const saveChanges = async () => {
    console.log('🔘 [CategoryExtrasManager] Save button clicked!');
    console.log('   hasChanges:', hasChanges);
    console.log('   isSaving:', isSaving);
    console.log('   categories count:', categories.length);

    if (!hasChanges) {
      console.log('❌ [CategoryExtrasManager] No changes to save');
      return;
    }

    try {
      setIsSaving(true);
      console.log('💾 [CategoryExtrasManager] Starting save process...');
      console.log('   Categories to update:', categories.map(c => ({
        id: c.id,
        name: c.name,
        extras_enabled: c.extras_enabled
      })));

      // Ensure we have proper authentication for admin operations
      await ensureAdminAuth();

      // Update each category
      for (const category of categories) {
        console.log(`   🔄 Updating ${category.name} (${category.id}) -> extras_enabled: ${category.extras_enabled}`);

        const { data, error } = await supabase
          .from('categories')
          .update({
            extras_enabled: category.extras_enabled,
            updated_at: new Date().toISOString()
          })
          .eq('id', category.id)
          .select();

        if (error) {
          console.error(`   ❌ Error updating ${category.name}:`, error);
          console.error(`   ❌ Error details:`, error.message, error.details, error.hint);
          throw error;
        } else {
          console.log(`   ✅ Successfully updated ${category.name}`, data);
        }
      }

      if (isMountedRef.current) {
        setHasChanges(false);
        // Clear localStorage since changes are now saved
        localStorage.removeItem(STORAGE_KEY);
        console.log('✅ Category extras settings saved successfully');
        console.log('🗑️ [CategoryExtrasManager] Cleared localStorage after successful save');

        // Verification disabled to prevent component remounting issues
        console.log('✅ [CategoryExtrasManager] Save completed successfully - verification skipped to prevent reload');
        console.log('✅ [CategoryExtrasManager] UI state preserved to maintain user changes');

        toast({
          title: "Successo",
          description: "Impostazioni categorie salvate con successo",
        });
      }

    } catch (error) {
      console.error('❌ [CategoryExtrasManager] Error saving category settings:', error);
      console.error('❌ [CategoryExtrasManager] Full error object:', JSON.stringify(error, null, 2));

      if (isMountedRef.current) {
        toast({
          title: "Errore Salvataggio",
          description: `Impossibile salvare: ${error.message || 'Errore sconosciuto'}`,
          variant: "destructive",
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false);
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Caricamento impostazioni categorie...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug Info */}
      <div className="bg-gray-100 p-3 rounded text-xs">
        <strong>Debug Info:</strong> hasChanges: {hasChanges.toString()}, isSaving: {isSaving.toString()}, categories: {categories.length}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            onClick={saveChanges}
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
            onClick={() => {
              if (hasChanges) {
                const confirmed = window.confirm(
                  'Ci sono modifiche non salvate. Ricaricare comunque? Le modifiche andranno perse.'
                );
                if (confirmed) {
                  localStorage.removeItem(STORAGE_KEY);
                  loadCategories(true);
                }
              } else {
                loadCategories(true);
              }
            }}
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

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 text-lg">
            ⚙️ Gestione Extra per Categorie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-blue-700 text-sm">
            <p>
              <strong>Controlla quali categorie possono avere extra aggiunti durante l'ordine:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Abilitato</strong>: I clienti possono aggiungere extra quando ordinano prodotti di questa categoria</li>
              <li><strong>Disabilitato</strong>: Solo le bevande saranno disponibili come aggiunte</li>
              <li><strong>Nota</strong>: Le bevande sono sempre disponibili per tutte le categorie</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <div className="grid gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-sm text-gray-600">Slug: {category.slug}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {category.extras_enabled 
                      ? "✅ Extra abilitati - I clienti possono aggiungere extra e bevande"
                      : "❌ Extra disabilitati - Solo bevande disponibili"
                    }
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    Extra Abilitati
                  </span>
                  <Switch
                    checked={category.extras_enabled}
                    onCheckedChange={(checked) => updateCategoryExtras(category.id, checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-800 text-lg">
            📊 Riepilogo Impostazioni
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Categorie con Extra Abilitati:</span>
              <span className="ml-2 text-green-600 font-bold">
                {categories.filter(cat => cat.extras_enabled).length}
              </span>
            </div>
            <div>
              <span className="font-medium">Categorie con Solo Bevande:</span>
              <span className="ml-2 text-orange-600 font-bold">
                {categories.filter(cat => !cat.extras_enabled).length}
              </span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded border-l-4 border-blue-400">
            <h4 className="font-medium text-blue-800 mb-1">Come Funziona:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• <strong>Extra Abilitati</strong>: Mostra sia extra che bevande nel modal di personalizzazione</li>
              <li>• <strong>Extra Disabilitati</strong>: Mostra solo bevande nel modal di personalizzazione</li>
              <li>• Le categorie "EXTRAS", "EXTRA", "BEVANDE", "VINI" sono automaticamente escluse dal menu principale</li>
              <li>• Tutti i prodotti aprono il modal di personalizzazione per permettere l'aggiunta di bevande</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryExtrasManager;
