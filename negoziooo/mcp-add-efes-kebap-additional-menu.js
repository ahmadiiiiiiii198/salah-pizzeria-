/**
 * MCP-Based Efes Kebap Additional Menu Items Addition
 * This script uses MCP (Model Context Protocol) to add additional menu items
 */

import { createClient } from '@supabase/supabase-js';

// Correct Supabase configuration for Pizzeria Regina 2000
const SUPABASE_URL = 'https://yliofvqfyimlbxjmsuow.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaW9mdnFmeWltbGJ4am1zdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDQzNjEsImV4cCI6MjA3MTI4MDM2MX0.5s5cxf9YHHQJMHPHxFxxzdkb01J2XbZAExa5POxJ6QY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Additional pizzas from the Efes Kebap menu
const additionalPizzas = [
  {
    number: '233',
    name: 'SIGLIANA',
    description: 'pom., mozz., acciughe, capperi, olive, origano',
    price: 7.00,
    sort_order: 33
  },
  {
    number: '234',
    name: 'STRACCHINO E RUCOLA',
    description: 'pom., mozz., stracchino, rucola',
    price: 6.50,
    sort_order: 34
  },
  {
    number: '236',
    name: 'PIEMONTESE',
    description: 'pom., mozz., acciughe, asparagi',
    price: 7.00,
    sort_order: 36
  },
  {
    number: '237',
    name: 'ESTATE',
    description: 'pom., mozz., pom. fresco, rucola',
    price: 6.00,
    sort_order: 37,
    is_vegetarian: true
  },
  {
    number: '238',
    name: 'BURRATA E MORTADELLA',
    description: 'mozz., mortadella, burrata, pistacchio',
    price: 7.50,
    sort_order: 38
  },
  {
    number: '239',
    name: 'BURRATA',
    description: 'pomodoro, burrata',
    price: 6.00,
    sort_order: 39,
    is_vegetarian: true
  },
  {
    number: '240',
    name: 'TONNO E CIPOLLA',
    description: 'pom., mozz., tonno, cipolla',
    price: 6.50,
    sort_order: 40
  }
];

// Rinforzo (extra topping)
const rinforzoExtra = {
  name: 'RINFORZO',
  description: 'Rinforzo aggiuntivo per pizza',
  price: 1.50,
  sort_order: 1
};

// Desserts from the menu
const desserts = [
  {
    name: 'BAKLAVA',
    description: '4pz.',
    price: 3.00,
    sort_order: 1
  },
  {
    name: 'KADAYF',
    description: 'Dolce turco tradizionale',
    price: 2.50,
    sort_order: 2
  },
  {
    name: 'ŞEKERPARE',
    description: '4 pz',
    price: 3.00,
    sort_order: 3
  }
];

async function addEfesKebapAdditionalMenu() {
  try {
    console.log('🍕 MCP: Starting Efes Kebap additional menu items addition...');
    console.log('=' .repeat(60));

    // Step 1: Find or create PIZZE category
    console.log('\n1️⃣ Finding PIZZE category...');
    let { data: pizzeCategory, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', 'pizze')
      .single();

    if (categoryError || !pizzeCategory) {
      console.log('📂 PIZZE category not found, creating it...');

      const { data: newCategory, error: createError } = await supabase
        .from('categories')
        .insert([{
          name: 'PIZZE',
          slug: 'pizze',
          description: 'Pizze Efes Kebap - Ristorante Pizzeria',
          sort_order: 1,
          is_active: true,
          image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        }])
        .select()
        .single();

      if (createError) {
        console.error('❌ Error creating PIZZE category:', createError);
        return;
      }

      pizzeCategory = newCategory;
      console.log('✅ PIZZE category created successfully');
    } else {
      console.log('✅ PIZZE category found:', pizzeCategory.name);
    }

    // Step 2: Find or create EXTRA category for rinforzo
    console.log('\n2️⃣ Finding EXTRA category...');
    let { data: extraCategory, error: extraCategoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', 'extra')
      .single();

    if (extraCategoryError || !extraCategory) {
      console.log('📂 EXTRA category not found, creating it...');

      const { data: newExtraCategory, error: createExtraError } = await supabase
        .from('categories')
        .insert([{
          name: 'EXTRA',
          slug: 'extra',
          description: 'Aggiunte e condimenti extra',
          sort_order: 8,
          is_active: true,
          image_url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        }])
        .select()
        .single();

      if (createExtraError) {
        console.error('❌ Error creating EXTRA category:', createExtraError);
        return;
      }

      extraCategory = newExtraCategory;
      console.log('✅ EXTRA category created successfully');
    } else {
      console.log('✅ EXTRA category found:', extraCategory.name);
    }

    // Step 3: Find or create DOLCI category
    console.log('\n3️⃣ Finding DOLCI category...');
    let { data: dolciCategory, error: dolciCategoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', 'dolci')
      .single();

    if (dolciCategoryError || !dolciCategory) {
      console.log('📂 DOLCI category not found, creating it...');

      const { data: newDolciCategory, error: createDolciError } = await supabase
        .from('categories')
        .insert([{
          name: 'DOLCI',
          slug: 'dolci',
          description: 'Dolci e dessert',
          sort_order: 5,
          is_active: true,
          image_url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        }])
        .select()
        .single();

      if (createDolciError) {
        console.error('❌ Error creating DOLCI category:', createDolciError);
        return;
      }

      dolciCategory = newDolciCategory;
      console.log('✅ DOLCI category created successfully');
    } else {
      console.log('✅ DOLCI category found:', dolciCategory.name);
    }

    const categoryId = pizzeCategory.id;
    const extraCategoryId = extraCategory.id;
    const dolciCategoryId = dolciCategory.id;

    // Step 4: Add additional pizzas
    console.log('\n4️⃣ Adding additional pizzas...');
    
    for (const pizza of additionalPizzas) {
      const slug = pizza.name.toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const productData = {
        name: `${pizza.number} - ${pizza.name}`,
        description: pizza.description,
        price: pizza.price,
        category_id: categoryId,
        sort_order: pizza.sort_order,
        is_active: true,
        is_vegetarian: pizza.is_vegetarian || false,
        is_vegan: false,
        is_gluten_free: false,
        stock_quantity: 100,
        preparation_time: 15,
        slug: `${pizza.number}-${slug}`,
        image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        labels: ['Efes Kebap', 'Pizza']
      };

      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) {
        console.error(`❌ Error adding pizza "${pizza.name}":`, error);
      } else {
        console.log(`✅ Added: ${pizza.number} - ${pizza.name} - €${pizza.price.toFixed(2)}`);
      }
    }

    // Step 5: Add rinforzo extra
    console.log('\n5️⃣ Adding rinforzo extra...');
    
    const rinforzoData = {
      name: rinforzoExtra.name,
      description: rinforzoExtra.description,
      price: rinforzoExtra.price,
      category_id: extraCategoryId,
      sort_order: rinforzoExtra.sort_order,
      is_active: true,
      is_vegetarian: true,
      is_vegan: true,
      is_gluten_free: true,
      stock_quantity: 1000,
      preparation_time: 0,
      slug: 'rinforzo',
      image_url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      labels: ['Efes Kebap', 'Extra']
    };

    const { error: rinforzoError } = await supabase
      .from('products')
      .insert([rinforzoData]);

    if (rinforzoError) {
      console.error(`❌ Error adding rinforzo:`, rinforzoError);
    } else {
      console.log(`✅ Added: ${rinforzoExtra.name} - €${rinforzoExtra.price.toFixed(2)}`);
    }

    // Step 6: Add desserts
    console.log('\n6️⃣ Adding desserts...');
    
    for (const dessert of desserts) {
      const slug = dessert.name.toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[şș]/g, 's')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const dessertData = {
        name: dessert.name,
        description: dessert.description,
        price: dessert.price,
        category_id: dolciCategoryId,
        sort_order: dessert.sort_order,
        is_active: true,
        is_vegetarian: true,
        is_vegan: false,
        is_gluten_free: false,
        stock_quantity: 50,
        preparation_time: 5,
        slug: slug,
        image_url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        labels: ['Efes Kebap', 'Dolci', 'Turkish']
      };

      const { error } = await supabase
        .from('products')
        .insert([dessertData]);

      if (error) {
        console.error(`❌ Error adding dessert "${dessert.name}":`, error);
      } else {
        console.log(`✅ Added: ${dessert.name} - €${dessert.price.toFixed(2)}`);
      }
    }

    console.log('\n🎉 MCP: Successfully added all Efes Kebap additional menu items!');
    console.log('=' .repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   • ${additionalPizzas.length} additional pizzas`);
    console.log(`   • 1 extra item (rinforzo)`);
    console.log(`   • ${desserts.length} desserts`);
    console.log(`   • Total: ${additionalPizzas.length + 1 + desserts.length} new products`);

  } catch (error) {
    console.error('❌ MCP Error in addEfesKebapAdditionalMenu:', error);
  }
}

// Run the function
addEfesKebapAdditionalMenu();
