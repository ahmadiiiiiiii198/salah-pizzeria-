// =====================================================
// ADD EFES KEBAP PRIMI MENU ITEMS TO PIZZERIA SYSTEM
// =====================================================
// This script adds the primi piatti products from the Efes Kebap menu
// including items numbered 241-254 from the menu image
// =====================================================

const { createClient } = require('@supabase/supabase-js');

// Use the current Supabase configuration
const supabase = createClient(
  'https://yliofvqfyimlbxjmsuow.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaW9mdnFmeWltbGJ4am1zdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDQzNjEsImV4cCI6MjA3MTI4MDM2MX0.5s5cxf9YHHQJMHPHxFxxzdkb01J2XbZAExa5POxJ6QY'
);

// Efes Kebap Primi Menu from the image
const efesKebapPrimi = [
  {
    name: 'CACIO E PEPE',
    number: '241',
    description: 'pecorino romano dop, pepe',
    price: 7.00,
    sort_order: 1,
    is_vegetarian: true
  },
  {
    name: 'GNOCCHI ALLA SORRENTINA',
    number: '242',
    description: 'gnocchi di patate, pomodoro italiano',
    price: 7.00,
    sort_order: 2,
    is_vegetarian: true
  },
  {
    name: 'TROFIE AL PESTO',
    number: '243',
    description: 'pesto alla genovese, pecorino romano dop, pinoli e basilico',
    price: 7.00,
    sort_order: 3,
    is_vegetarian: true
  },
  {
    name: 'SPAGHETTI CARBONARA',
    number: '244',
    description: 'pasta fresca all\'uovo, pecorino romano dop',
    price: 6.50,
    sort_order: 4
  },
  {
    name: 'TAGLIOLINI VERDI SPECK E GORGONZOLA',
    number: '245',
    description: 'pasta fresca all\'uovo e gorgonzola dop',
    price: 7.00,
    sort_order: 5
  },
  {
    name: 'TAGLIATELLE AI FUNGHI',
    number: '246',
    description: 'pasta fresca all\'uovo, champignon, funghi porcini',
    price: 7.00,
    sort_order: 6,
    is_vegetarian: true
  },
  {
    name: 'TORTELLINI PANNA E PROSCIUTTO',
    number: '247',
    description: 'pasta fresca all\'uovo, panna fresca italiana e prosciutto italiano',
    price: 7.00,
    sort_order: 7
  },
  {
    name: 'RAVIOLI AL POMODORO',
    number: '248',
    description: 'pasta fresca all\'uovo, pomodoro italiano, panna fresca',
    price: 7.00,
    sort_order: 8,
    is_vegetarian: true
  },
  {
    name: 'PENNE POMODORO E MOZZARELLA',
    number: '249',
    description: 'pasta fresca all\'uovo, pomodoro italiano e mozzarella italiana',
    price: 6.00,
    sort_order: 9,
    is_vegetarian: true
  },
  {
    name: 'ORECCHIETTE CIME DI RAPA',
    number: '250',
    description: 'pasta fresca all\'uovo, cime di rapa italiane',
    price: 7.00,
    sort_order: 10,
    is_vegetarian: true
  },
  {
    name: 'BUCATINI AMATRICIANA',
    number: '251',
    description: 'bucatini, pomodoro, guanciale e pecorino',
    price: 7.00,
    sort_order: 11
  },
  {
    name: 'LASAGNA',
    number: '252',
    description: 'pasta fresca all\'uovo, pomodoro italiano, ragù di vitella',
    price: 5.00,
    sort_order: 12
  },
  {
    name: 'RISOTTO ALLA PESCATORA',
    number: '253',
    description: 'riso italiano, senza glutine, calamari, gamberi, polpo e vongole',
    price: 8.00,
    sort_order: 13,
    is_gluten_free: true
  },
  {
    name: 'FETTUCCINE ALFREDO',
    number: '254',
    description: 'pasta fresca all\'uovo, pomodoro italiano, alla bolognese',
    price: 7.00,
    sort_order: 14
  }
];

async function addEfesKebapPrimi() {
  try {
    console.log('🍝 Starting Efes Kebap Primi Menu Addition...');
    console.log('📋 Adding', efesKebapPrimi.length, 'primi piatti items from Efes Kebap menu');

    // Step 1: Check if PRIMI category exists, if not create it
    console.log('📂 Checking for PRIMI category...');

    let { data: primiCategory, error: categoryError } = await supabase
      .from('categories')
      .select('id, name')
      .eq('slug', 'primi')
      .single();

    if (categoryError || !primiCategory) {
      console.log('📂 PRIMI category not found, creating it...');

      const { data: newCategory, error: createError } = await supabase
        .from('categories')
        .insert([{
          name: 'PRIMI',
          slug: 'primi',
          description: 'Primi Piatti - Efes Kebap Ristorante Pizzeria',
          sort_order: 2,
          is_active: true,
          image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        }])
        .select()
        .single();

      if (createError) {
        console.error('❌ Error creating PRIMI category:', createError);
        return;
      }

      primiCategory = newCategory;
      console.log('✅ PRIMI category created successfully');
    } else {
      console.log('✅ PRIMI category found:', primiCategory.name);
    }

    const categoryId = primiCategory.id;

    // Step 2: Add each primi product
    console.log('🍝 Adding primi products...');

    for (const primo of efesKebapPrimi) {
      // Check if product already exists
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id, name')
        .eq('name', `${primo.number} - ${primo.name}`)
        .single();

      if (existingProduct) {
        console.log(`⚠️  Primo "${primo.name}" already exists, skipping...`);
        continue;
      }

      // Create slug from name
      const slug = primo.name.toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const productData = {
        name: `${primo.number} - ${primo.name}`,
        description: primo.description,
        price: primo.price,
        category_id: categoryId,
        sort_order: primo.sort_order,
        is_active: true,
        is_vegetarian: primo.is_vegetarian || false,
        is_vegan: false,
        is_gluten_free: primo.is_gluten_free || false,
        stock_quantity: 100,
        preparation_time: 20,
        slug: `${primo.number}-${slug}`,
        image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        labels: ['Efes Kebap', 'Primi Piatti']
      };

      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) {
        console.error(`❌ Error adding primo "${primo.name}":`, error);
      } else {
        console.log(`✅ Added: ${primo.number} - ${primo.name} - €${primo.price.toFixed(2)}`);
      }
    }

    console.log('\n🎉 Efes Kebap Primi Menu Addition Complete!');
    console.log(`✅ Successfully processed ${efesKebapPrimi.length} primi piatti items`);
    console.log('\n📝 Summary:');
    console.log('- All primi added to PRIMI category');
    console.log('- Prices range from €5.00 to €8.00');
    console.log('- Products numbered 241-254 as per menu');
    console.log('- Vegetarian options marked appropriately');
    console.log('- Gluten-free option marked for Risotto alla Pescatora');
    console.log('\n🔗 Next steps:');
    console.log('1. Check the admin panel to verify products were added');
    console.log('2. Update product images if needed');
    console.log('3. Test the menu display on the website');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

// Run the script
addEfesKebapPrimi().catch(console.error);
