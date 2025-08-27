// =====================================================
// ADD EFES KEBAP MENU ITEMS TO PIZZERIA SYSTEM
// =====================================================
// This script adds the products from the Efes Kebap menu
// including Pide, Lahmacum, Farinata, and Hot Dog items
// =====================================================

import { createClient } from '@supabase/supabase-js';

// Use the current Supabase configuration
const supabase = createClient(
  'https://yliofvqfyimlbxjmsuow.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaW9mdnFmeWltbGJ4am1zdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDQzNjEsImV4cCI6MjA3MTI4MDM2MX0.5s5cxf9YHHQJMHPHxFxxzdkb01J2XbZAExa5POxJ6QY'
);

// New categories to add
const newCategories = [
  {
    name: 'PIDE',
    slug: 'pide',
    description: 'Pide turche tradizionali con ingredienti freschi',
    sort_order: 9,
    is_active: true
  },
  {
    name: 'LAHMACUM',
    slug: 'lahmacum',
    description: 'Pizza turca sottile con carne tritata e spezie',
    sort_order: 10,
    is_active: true
  }
];

// Products to add organized by category
const pideProducts = [
  {
    name: '163 - SUCUK',
    description: 'salame turco, mozzarella, uova',
    price: 8.00,
    category_slug: 'pide',
    sort_order: 1
  },
  {
    name: '164 - WURSTEL',
    description: 'wurstel, pepperoni, uova',
    price: 7.50,
    category_slug: 'pide',
    sort_order: 2
  },
  {
    name: '165 - UOVA E MOZZARELLA',
    description: 'uova fresche e mozzarella',
    price: 7.00,
    category_slug: 'pide',
    sort_order: 3,
    is_vegetarian: true
  },
  {
    name: '166 - VEGETARIANO',
    description: 'peperoni, funghi, mozzarella, uova',
    price: 7.50,
    category_slug: 'pide',
    sort_order: 4,
    is_vegetarian: true
  },
  {
    name: '167 - SPINACI',
    description: 'mozzarella, spinaci, uova',
    price: 7.50,
    category_slug: 'pide',
    sort_order: 5,
    is_vegetarian: true
  },
  {
    name: '168 - FETA GRECA',
    description: 'mozzarella, feta, prezzemolo, uova',
    price: 7.50,
    category_slug: 'pide',
    sort_order: 6,
    is_vegetarian: true
  },
  {
    name: '168 - KIYMALI',
    description: 'mozzarella, uovo, carne tritata di manzo',
    price: 8.00,
    category_slug: 'pide',
    sort_order: 7
  }
];

const lahmacumProducts = [
  {
    name: '153 - PIZZA TURCA',
    description: 'carne trita, prezzemolo, pom., cipolla, insalata, spezie',
    price: 4.50,
    category_slug: 'lahmacum',
    sort_order: 1
  }
];

const farinataProducts = [
  {
    name: '178 - FARINATA A PORZIONE',
    description: 'Farinata tradizionale ligure a porzione',
    price: 2.00,
    category_slug: 'farinate',
    sort_order: 1,
    is_vegetarian: true,
    is_vegan: true,
    is_gluten_free: true
  },
  {
    name: '181 - HOT DOG',
    description: 'Hot dog classico con wurstel',
    price: 2.50,
    category_slug: 'farinate',
    sort_order: 2
  }
];

async function addEfesKebapMenu() {
  try {
    console.log('🚀 Starting Efes Kebap menu addition...');
    console.log('📡 Connecting to Supabase...');

    // Test connection
    const { data: testConnection, error: connectionError } = await supabase
      .from('categories')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.error('❌ Failed to connect to Supabase:', connectionError.message);
      return;
    }

    console.log('✅ Connected to Supabase successfully!');

    // 1. Add new categories
    console.log('📂 Adding new categories...');
    for (const category of newCategories) {
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category.slug)
        .single();

      if (existingCategory) {
        console.log(`⚠️  Category "${category.name}" already exists, skipping...`);
        continue;
      }

      const { error } = await supabase
        .from('categories')
        .insert([category]);

      if (error) {
        console.error(`❌ Error adding category "${category.name}":`, error);
      } else {
        console.log(`✅ Added category: ${category.name}`);
      }
    }

    // 2. Helper function to add products
    async function addProducts(products, categoryName) {
      console.log(`\n🍕 Adding ${categoryName} products...`);
      
      for (const product of products) {
        // Get category ID
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', product.category_slug)
          .single();

        if (!category) {
          console.error(`❌ Category "${product.category_slug}" not found for product "${product.name}"`);
          continue;
        }

        const categoryId = category.id;

        // Check if product already exists
        const { data: existingProduct } = await supabase
          .from('products')
          .select('id')
          .eq('name', product.name)
          .single();

        if (existingProduct) {
          console.log(`⚠️  Product "${product.name}" already exists, skipping...`);
          continue;
        }

        const productData = {
          name: product.name,
          description: product.description,
          price: product.price,
          category_id: categoryId,
          sort_order: product.sort_order,
          is_active: true,
          is_vegetarian: product.is_vegetarian || false,
          is_vegan: product.is_vegan || false,
          is_gluten_free: product.is_gluten_free || false,
          stock_quantity: 100,
          preparation_time: 15,
          slug: product.name.toLowerCase()
            .replace(/[àáâãäå]/g, 'a')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/[òóôõö]/g, 'o')
            .replace(/[ùúûü]/g, 'u')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
        };

        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) {
          console.error(`❌ Error adding product "${product.name}":`, error);
        } else {
          console.log(`✅ Added: ${product.name} - €${product.price}`);
        }
      }
    }

    // 3. Add all products
    await addProducts(pideProducts, 'Pide');
    await addProducts(lahmacumProducts, 'Lahmacum');
    await addProducts(farinataProducts, 'Farinata & Hot Dog');

    // 4. Summary
    console.log('\n📊 Summary:');
    const { data: totalCategories } = await supabase
      .from('categories')
      .select('id')
      .eq('is_active', true);
    
    const { data: totalProducts } = await supabase
      .from('products')
      .select('id')
      .eq('is_active', true);

    console.log(`✅ Total active categories: ${totalCategories?.length || 0}`);
    console.log(`✅ Total active products: ${totalProducts?.length || 0}`);
    
    console.log('\n🎉 Efes Kebap menu addition completed successfully!');
    console.log('\n📋 Added items:');
    console.log('• 2 new categories (PIDE, LAHMACUM)');
    console.log('• 7 Pide varieties');
    console.log('• 1 Lahmacum (Pizza Turca)');
    console.log('• 2 Farinata items (including Hot Dog)');
    console.log('\n💡 Note: Items were added to existing FARINATE category for Farinata products');

  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
addEfesKebapMenu();
