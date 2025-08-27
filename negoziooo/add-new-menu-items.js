import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://htdgoceqepvrffblfvns.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8'
);

async function addNewMenuItems() {
  console.log('🍕 Adding new menu items to Pizzeria Senza Cipolla...');

  try {
    // First, let's create the new categories
    const categories = [
      { name: 'Panini & Piadine', slug: 'panini-piadine', sort_order: 10 },
      { name: 'Menu Combos', slug: 'menu-combos', sort_order: 20 },
      { name: 'Tacos', slug: 'tacos', sort_order: 30 },
      { name: 'Piatti', slug: 'piatti', sort_order: 40 },
      { name: 'Pizze', slug: 'pizze', sort_order: 50 }
    ];

    console.log('📂 Creating categories...');
    const categoryResults = {};

    for (const category of categories) {
      // Check if category already exists
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category.slug)
        .single();

      if (existingCategory) {
        console.log(`✅ Category "${category.name}" already exists`);
        categoryResults[category.slug] = existingCategory.id;
      } else {
        const { data: newCategory, error } = await supabase
          .from('categories')
          .insert([category])
          .select('id')
          .single();

        if (error) {
          console.error(`❌ Error creating category "${category.name}":`, error);
          continue;
        }

        console.log(`✅ Created category: ${category.name}`);
        categoryResults[category.slug] = newCategory.id;
      }
    }

    // Now let's add all the products
    const products = [
      // Panini & Piadine
      {
        name: 'Panino Kebab',
        description: 'Delizioso panino con kebab di carne',
        price: 5.00,
        category_slug: 'panini-piadine',
        sort_order: 1
      },
      {
        name: 'Panino Kofta',
        description: 'Panino con kofta speziata',
        price: 5.50,
        category_slug: 'panini-piadine',
        sort_order: 2
      },
      {
        name: 'Panino Hot Dog',
        description: 'Classico hot dog americano',
        price: 4.00,
        category_slug: 'panini-piadine',
        sort_order: 3
      },
      {
        name: 'Panino Falafel',
        description: 'Panino vegetariano con falafel',
        price: 5.00,
        category_slug: 'panini-piadine',
        sort_order: 4,
        is_vegetarian: true
      },
      {
        name: 'Panino Burger',
        description: 'Burger classico con carne',
        price: 5.00,
        category_slug: 'panini-piadine',
        sort_order: 5
      },
      {
        name: 'Chicken Burger',
        description: 'Burger con pollo croccante',
        price: 5.00,
        category_slug: 'panini-piadine',
        sort_order: 6
      },
      {
        name: 'Piadina Kebab',
        description: 'Piadina romagnola con kebab',
        price: 5.00,
        category_slug: 'panini-piadine',
        sort_order: 7
      },
      {
        name: 'Piadina Nutella',
        description: 'Piadina dolce con Nutella',
        price: 5.00,
        category_slug: 'panini-piadine',
        sort_order: 8,
        is_vegetarian: true
      },

      // Menu Combos
      {
        name: 'Margherita Menu',
        description: 'Pizza Margherita servita con patatine fritte e bibita',
        price: 7.50,
        category_slug: 'menu-combos',
        sort_order: 1
      },
      {
        name: 'Piadina Kebab Menu',
        description: 'Piadina Kebab servita con patatine fritte e bibita',
        price: 8.00,
        category_slug: 'menu-combos',
        sort_order: 2
      },
      {
        name: 'Panino Kebab Menu',
        description: 'Panino Kebab servito con patatine fritte e bibita',
        price: 8.00,
        category_slug: 'menu-combos',
        sort_order: 3
      },

      // Tacos
      {
        name: 'Tacos di Kebab',
        description: 'Tacos messicani con kebab di carne',
        price: 5.00,
        category_slug: 'tacos',
        sort_order: 1
      },
      {
        name: 'Tacos di Pollo',
        description: 'Tacos con pollo marinato',
        price: 5.00,
        category_slug: 'tacos',
        sort_order: 2
      },
      {
        name: 'Tacos con Carne Tritata',
        description: 'Tacos con carne tritata speziata',
        price: 5.00,
        category_slug: 'tacos',
        sort_order: 3
      }
    ];

    console.log('🍽️ Adding products...');

    for (const product of products) {
      const categoryId = categoryResults[product.category_slug];
      if (!categoryId) {
        console.error(`❌ Category not found for ${product.name}`);
        continue;
      }

      // Check if product already exists
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('name', product.name)
        .single();

      if (existingProduct) {
        console.log(`⚠️ Product "${product.name}" already exists, skipping...`);
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
        stock_quantity: 100,
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

    // Add Piatti (Plates)
    const piattiProducts = [
      {
        name: 'Piatto Kebab',
        description: 'Piatto completo con kebab di carne',
        price: 8.00,
        category_slug: 'piatti',
        sort_order: 1
      },
      {
        name: 'Piatto Alette di Pollo',
        description: 'Piatto con alette di pollo croccanti',
        price: 8.00,
        category_slug: 'piatti',
        sort_order: 2
      },
      {
        name: 'Piatto Nuggets & Alette di Pollo',
        description: 'Mix di nuggets e alette di pollo',
        price: 8.00,
        category_slug: 'piatti',
        sort_order: 3
      },
      {
        name: 'Piatto Falafel',
        description: 'Piatto vegetariano con falafel',
        price: 7.00,
        category_slug: 'piatti',
        sort_order: 4,
        is_vegetarian: true
      },
      {
        name: 'Piatto Kofta',
        description: 'Piatto con kofta speziata',
        price: 9.00,
        category_slug: 'piatti',
        sort_order: 5
      },
      {
        name: 'Piatto Bistecca di Pollo',
        description: 'Bistecca di pollo grigliata',
        price: 9.00,
        category_slug: 'piatti',
        sort_order: 6
      }
    ];

    // Add Pizze
    const pizzeProducts = [
      {
        name: 'Capricciosa',
        description: 'Pomodoro, mozzarella, prosciutto, funghi, carciofi, olive',
        price: 7.50,
        category_slug: 'pizze',
        sort_order: 1
      },
      {
        name: 'Margherita',
        description: 'Pomodoro, mozzarella, basilico',
        price: 5.00,
        category_slug: 'pizze',
        sort_order: 2,
        is_vegetarian: true
      },
      {
        name: 'Kebab',
        description: 'Pomodoro, mozzarella, kebab di carne',
        price: 8.00,
        category_slug: 'pizze',
        sort_order: 3
      },
      {
        name: 'Americana',
        description: 'Pomodoro, mozzarella, wurstel, patatine fritte',
        price: 7.00,
        category_slug: 'pizze',
        sort_order: 4
      },
      {
        name: '4 Formaggi',
        description: 'Mozzarella, gorgonzola, parmigiano, fontina',
        price: 7.00,
        category_slug: 'pizze',
        sort_order: 5,
        is_vegetarian: true
      },
      {
        name: '4 Stagioni',
        description: 'Pomodoro, mozzarella, prosciutto, funghi, carciofi, olive',
        price: 7.00,
        category_slug: 'pizze',
        sort_order: 6
      },
      {
        name: 'Cotto',
        description: 'Pomodoro, mozzarella, prosciutto cotto',
        price: 7.00,
        category_slug: 'pizze',
        sort_order: 7
      },
      {
        name: 'Diavola',
        description: 'Pomodoro, mozzarella, salame piccante',
        price: 7.00,
        category_slug: 'pizze',
        sort_order: 8
      },
      {
        name: 'Tonno & Cipolla',
        description: 'Pomodoro, mozzarella, tonno, cipolla',
        price: 7.00,
        category_slug: 'pizze',
        sort_order: 9
      }
    ];

    // Add all remaining products
    const allRemainingProducts = [...piattiProducts, ...pizzeProducts];

    for (const product of allRemainingProducts) {
      const categoryId = categoryResults[product.category_slug];
      if (!categoryId) {
        console.error(`❌ Category not found for ${product.name}`);
        continue;
      }

      // Check if product already exists
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('name', product.name)
        .single();

      if (existingProduct) {
        console.log(`⚠️ Product "${product.name}" already exists, skipping...`);
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
        stock_quantity: 100,
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

    console.log('\n🎉 Menu update completed!');
    console.log('📋 Summary of new categories:');
    console.log('   • Panini & Piadine (8 items)');
    console.log('   • Menu Combos (3 items)');
    console.log('   • Tacos (3 items)');
    console.log('   • Piatti (6 items)');
    console.log('   • Pizze (9 items)');
    console.log('\n🔄 Please refresh your website to see the new menu items!');

  } catch (error) {
    console.error('❌ Error in addNewMenuItems:', error);
  }
}

addNewMenuItems();