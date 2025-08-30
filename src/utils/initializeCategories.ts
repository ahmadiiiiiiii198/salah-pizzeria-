import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types/category';

// Default categories to initialize the database
const defaultCategories: Omit<Category, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: "Fiori & Piante",
    slug: "fiori-piante",
    description: "Fiori freschi e piante di qualità premium",
    image_url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    is_active: true,
    sort_order: 1,
    extras_enabled: true
  },
  {
    name: "Fiori Finti",
    slug: "fiori-finti",
    description: "Eleganti composizioni artificiali",
    image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    is_active: true,
    sort_order: 2,
    extras_enabled: true
  },
  {
    name: "Matrimoni",
    slug: "matrimoni",
    description: "Allestimenti floreali per il giorno speciale",
    image_url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    is_active: true,
    sort_order: 3,
    extras_enabled: true
  },
  {
    name: "Funerali",
    slug: "funerali",
    description: "Composizioni di cordoglio e commemorazione",
    image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    is_active: true,
    sort_order: 4,
    extras_enabled: true
  }
];

export async function initializeCategories(): Promise<boolean> {
  try {
    console.log('[InitCategories] Checking if categories need to be initialized...');

    // Check if categories already exist - be VERY conservative to avoid false negatives
    const { data: existingCategories, error: fetchError } = await supabase
      .from('categories')
      .select('id, name, extras_enabled')
      .limit(10);

    if (fetchError) {
      console.error('[InitCategories] Error checking existing categories:', fetchError);
      console.error('[InitCategories] Error details:', fetchError.message, fetchError.details);
      console.log('[InitCategories] ⚠️  CRITICAL: Database error detected, but NOT recreating categories to preserve data');
      console.log('[InitCategories] ⚠️  Manual intervention may be required if categories table truly does not exist');
      return false;
    }

    if (existingCategories && existingCategories.length > 0) {
      console.log('[InitCategories] Categories already exist, skipping initialization');
      console.log('[InitCategories] Found', existingCategories.length, 'existing categories:', existingCategories.map(c => c.name));
      console.log('[InitCategories] ⚠️  IMPORTANT: Skipping category recreation to preserve extras_enabled settings');
      console.log('[InitCategories] ⚠️  Current extras_enabled values:', existingCategories.map(c => ({ name: c.name, extras_enabled: c.extras_enabled })));
      return true;
    }

    console.log('[InitCategories] No categories found, initializing default categories...');
    console.log('[InitCategories] Default categories to insert:', defaultCategories);

    // Insert default categories
    const { data: insertData, error: insertError } = await supabase
      .from('categories')
      .insert(defaultCategories)
      .select();

    if (insertError) {
      console.error('[InitCategories] Error inserting default categories:', insertError);
      console.error('[InitCategories] Error details:', insertError.message, insertError.details);
      return false;
    }

    console.log('[InitCategories] Default categories initialized successfully');
    console.log('[InitCategories] Inserted categories:', insertData);
    return true;
  } catch (error) {
    console.error('[InitCategories] Error in initializeCategories:', error);
    return false;
  }
}

export async function initializeCategoriesContent(): Promise<boolean> {
  try {
    console.log('[InitCategories] Checking if categories content needs to be initialized...');

    // Check if content already exists
    const { data: existingContent, error: fetchError } = await supabase
      .from('site_content')
      .select('id')
      .eq('section', 'categories')
      .single();

    if (!fetchError && existingContent) {
      console.log('[InitCategories] Categories content already exists, skipping initialization');
      return true;
    }

    console.log('[InitCategories] Initializing default categories content...');

    // Insert default content
    const { error: insertError } = await supabase
      .from('site_content')
      .upsert({
        section: 'categories',
        title: "Esplora per Categoria",
        subtitle: "Le nostre collezioni accuratamente curate",
        is_active: true,
        updated_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('[InitCategories] Error inserting default categories content:', insertError);
      return false;
    }

    console.log('[InitCategories] Default categories content initialized successfully');
    return true;
  } catch (error) {
    console.error('[InitCategories] Error in initializeCategoriesContent:', error);
    return false;
  }
}

// Initialize both categories and content
export async function initializeAllCategories(): Promise<boolean> {
  const categoriesSuccess = await initializeCategories();
  const contentSuccess = await initializeCategoriesContent();
  
  return categoriesSuccess && contentSuccess;
}
