// =====================================================
// ADD EFES KEBAP PIZZA MENU ITEMS TO PIZZERIA SYSTEM
// =====================================================
// This script adds the pizza products from the Efes Kebap menu
// including pizzas numbered 220-232 from the menu image
// =====================================================

import { createClient } from '@supabase/supabase-js';

// Use the current Supabase configuration
const supabase = createClient(
  'https://yliofvqfyimlbxjmsuow.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaW9mdnFmeWltbGJ4am1zdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDQzNjEsImV4cCI6MjA3MTI4MDM2MX0.5s5cxf9YHHQJMHPHxFxxzdkb01J2XbZAExa5POxJ6QY'
);

// Efes Kebap Pizza Menu from the image
const efesKebapPizzas = [
  {
    name: 'STRACCHINO',
    number: '220',
    description: 'pomodoro, mozzarella, stracchino',
    price: 6.00,
    sort_order: 1
  },
  {
    name: 'CALZONE KEBAP',
    number: '221',
    description: 'pomodoro, mozzarella, carne di kebap',
    price: 8.50,
    sort_order: 2
  },
  {
    name: 'VEGETARIANA',
    number: '222',
    description: 'pom., mozz., zucchine, melanzane, peperoni',
    price: 6.50,
    sort_order: 3,
    is_vegetarian: true
  },
  {
    name: 'FRESCA',
    number: '223',
    description: 'pom., mozz., prosciutto crudo',
    price: 6.50,
    sort_order: 4
  },
  {
    name: 'AMERICANA',
    number: '224',
    description: 'pomodoro, mozzarella, patatine fritte',
    price: 6.00,
    sort_order: 5
  },
  {
    name: 'CALZONE',
    number: '225',
    description: 'pomodoro, mozzarella, prosciutto cotto',
    price: 7.00,
    sort_order: 6
  },
  {
    name: 'VIENNESE',
    number: '226',
    description: 'pomodoro, mozzarella, wurstel, olive, origano',
    price: 6.50,
    sort_order: 7
  },
  {
    name: 'SPECK',
    number: '227',
    description: 'pomodoro, mozzarella, speck',
    price: 6.00,
    sort_order: 8
  },
  {
    name: 'TONNO E CARCIOFINI',
    number: '228',
    description: 'pom., mozz., tonno, carciofini',
    price: 7.50,
    sort_order: 9
  },
  {
    name: 'BUFALA',
    number: '229',
    description: 'pomodoro, mozzarella di bufala',
    price: 6.00,
    sort_order: 10
  },
  {
    name: 'VULCANO',
    number: '230',
    description: 'pom., mozz., peperoni, melanzane, salamino, uovo fresco',
    price: 8.00,
    sort_order: 11
  },
  {
    name: 'GORGO E SALAMINO',
    number: '231',
    description: 'pom., mozz., gorgonzola, salamino',
    price: 7.50,
    sort_order: 12
  },
  {
    name: 'EFES',
    number: '232',
    description: 'pom., mozz., wurstel, mais, olive, peperoni',
    price: 7.00,
    sort_order: 13
  }
];

async function addEfesKebapPizzas() {
  try {
    console.log('🍕 Starting Efes Kebap Pizza Menu Addition...');
    console.log('📋 Adding', efesKebapPizzas.length, 'pizza items from Efes Kebap menu');

    // Step 1: Check if PIZZE category exists, if not create it
    console.log('📂 Checking for PIZZE category...');

    let { data: pizzeCategory, error: categoryError } = await supabase
      .from('categories')
      .select('id, name')
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

    const categoryId = pizzeCategory.id;

    // Step 2: Add each pizza product
    console.log('🍕 Adding pizza products...');

    for (const pizza of efesKebapPizzas) {
      // Check if product already exists
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id, name')
        .eq('name', pizza.name)
        .single();

      if (existingProduct) {
        console.log(`⚠️  Pizza "${pizza.name}" already exists, skipping...`);
        continue;
      }

      // Create slug from name
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

    console.log('\n🎉 Efes Kebap Pizza Menu Addition Complete!');
    console.log(`✅ Successfully processed ${efesKebapPizzas.length} pizza items`);
    console.log('\n📝 Summary:');
    console.log('- All pizzas added to PIZZE category');
    console.log('- Prices range from €6.00 to €8.50');
    console.log('- Products numbered 220-232 as per menu');
    console.log('- Vegetarian option marked for VEGETARIANA');
    console.log('\n🔗 Next steps:');
    console.log('1. Check the admin panel to verify products were added');
    console.log('2. Update product images if needed');
    console.log('3. Test the menu display on the website');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

// Run the script
addEfesKebapPizzas().catch(console.error);