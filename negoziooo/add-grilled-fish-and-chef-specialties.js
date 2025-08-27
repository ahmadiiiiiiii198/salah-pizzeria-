import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please check your .env file for:');
  console.log('- VITE_SUPABASE_URL or SUPABASE_URL');
  console.log('- VITE_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// New categories to add
const newCategories = [
  {
    name: 'Pesce alla Griglia',
    slug: 'pesce-alla-griglia',
    description: 'Pesce fresco grigliato con contorni',
    sort_order: 10,
    is_active: true
  },
  {
    name: 'Specialità dello Chef',
    slug: 'specialita-dello-chef',
    description: 'Piatti speciali preparati dal nostro chef',
    sort_order: 11,
    is_active: true
  }
];

// New products to add
const newProducts = [
  // PESCE ALLA GRIGLIA (Grilled Fish)
  {
    name: 'Orata alla Griglia',
    description: 'Orata fresca grigliata con insalata, pomodoro, patatine fritte, cipolla e salse',
    price: 12.00,
    category_slug: 'pesce-alla-griglia',
    ingredients: ['orata', 'insalata', 'pomodoro', 'patatine fritte', 'cipolla', 'salse'],
    sort_order: 126,
    preparation_time: 20,
    is_active: true,
    stock_quantity: 50
  },
  {
    name: 'Salmone alla Griglia',
    description: 'Salmone fresco grigliato con insalata, pomodoro, patatine fritte, cipolla e salse',
    price: 12.00,
    category_slug: 'pesce-alla-griglia',
    ingredients: ['salmone', 'insalata', 'pomodoro', 'patatine fritte', 'cipolla', 'salse'],
    sort_order: 127,
    preparation_time: 20,
    is_active: true,
    stock_quantity: 50
  },
  {
    name: 'Branzino alla Griglia',
    description: 'Branzino fresco grigliato con pomodoro, insalata e patatine fritte',
    price: 12.00,
    category_slug: 'pesce-alla-griglia',
    ingredients: ['branzino', 'pomodoro', 'insalata', 'patatine fritte'],
    sort_order: 128,
    preparation_time: 20,
    is_active: true,
    stock_quantity: 50
  },
  {
    name: 'Orata alla Ligure',
    description: 'Orata preparata alla ligure con pomodoro, olive, salvia, pepe e capperi',
    price: 12.00,
    category_slug: 'pesce-alla-griglia',
    ingredients: ['orata', 'pomodoro', 'olive', 'salvia', 'pepe', 'capperi'],
    sort_order: 129,
    preparation_time: 25,
    is_active: true,
    stock_quantity: 50
  },
  
  // SPECIALITÀ DELLO CHEF (Chef's Specialties)
  {
    name: 'Et Sot',
    description: 'Carne di vitello con peperoni, cipolla, funghi, pomodoro e spezie',
    price: 10.00,
    category_slug: 'specialita-dello-chef',
    ingredients: ['carne di vitello', 'peperoni', 'cipolla', 'funghi', 'pomodoro', 'spezie'],
    sort_order: 140,
    preparation_time: 25,
    is_active: true,
    stock_quantity: 50
  },
  {
    name: 'Tavuk Sote',
    description: 'Carne di pollo con peperoni, cipolla, funghi, pomodoro, spezie e aglio',
    price: 10.00,
    category_slug: 'specialita-dello-chef',
    ingredients: ['carne di pollo', 'peperoni', 'cipolla', 'funghi', 'pomodoro', 'spezie', 'aglio'],
    sort_order: 141,
    preparation_time: 25,
    is_active: true,
    stock_quantity: 50
  }
];

async function addGrilledFishAndChefSpecialties() {
  try {
    console.log('🐟 Adding Grilled Fish and Chef Specialties to EFES KEBAP menu...');
    console.log('🔧 Using Supabase URL:', supabaseUrl);
    
    // Step 1: Add new categories
    console.log('\n📂 Step 1: Adding new categories...');
    
    for (const category of newCategories) {
      console.log(`\n📁 Adding category: ${category.name}`);
      
      // Check if category already exists
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id, name')
        .eq('slug', category.slug)
        .single();
      
      if (existingCategory) {
        console.log(`   ⚠️  Category "${category.name}" already exists, skipping...`);
        continue;
      }
      
      const { error: categoryError } = await supabase
        .from('categories')
        .insert([category]);
      
      if (categoryError) {
        console.error(`   ❌ Error adding category "${category.name}":`, categoryError.message);
        continue;
      }
      
      console.log(`   ✅ Added category: ${category.name}`);
    }
    
    // Step 2: Get category IDs
    console.log('\n🔍 Step 2: Getting category IDs...');
    
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name, slug')
      .in('slug', newCategories.map(cat => cat.slug));
    
    if (categoriesError) {
      console.error('❌ Error fetching categories:', categoriesError.message);
      return;
    }
    
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
      console.log(`   📁 ${cat.name}: ${cat.id}`);
    });
    
    // Step 3: Add products
    console.log('\n🍽️  Step 3: Adding products...');
    
    for (const product of newProducts) {
      console.log(`\n🥘 Adding product: ${product.name} - €${product.price}`);
      
      const categoryId = categoryMap[product.category_slug];
      if (!categoryId) {
        console.error(`   ❌ Category not found for slug: ${product.category_slug}`);
        continue;
      }
      
      // Check if product already exists
      const productSlug = product.name.toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id, name')
        .eq('slug', productSlug)
        .single();
      
      if (existingProduct) {
        console.log(`   ⚠️  Product "${product.name}" already exists, skipping...`);
        continue;
      }
      
      const productData = {
        name: product.name,
        description: product.description,
        price: product.price,
        category_id: categoryId,
        ingredients: product.ingredients,
        sort_order: product.sort_order,
        preparation_time: product.preparation_time,
        is_active: product.is_active,
        stock_quantity: product.stock_quantity,
        slug: productSlug
      };
      
      const { error: productError } = await supabase
        .from('products')
        .insert([productData]);
      
      if (productError) {
        console.error(`   ❌ Error adding product "${product.name}":`, productError.message);
        continue;
      }
      
      console.log(`   ✅ Added: ${product.name} - €${product.price}`);
      console.log(`      📝 Description: ${product.description}`);
      console.log(`      🥄 Ingredients: ${product.ingredients.join(', ')}`);
    }
    
    // Step 4: Verification
    console.log('\n🔍 Step 4: Verification...');
    
    const { data: allProducts, error: verifyError } = await supabase
      .from('products')
      .select(`
        name,
        price,
        categories (name)
      `)
      .in('category_id', Object.values(categoryMap))
      .order('sort_order', { ascending: true });
    
    if (verifyError) {
      console.error('❌ Error during verification:', verifyError.message);
      return;
    }
    
    console.log('\n✅ Successfully added products:');
    allProducts.forEach(product => {
      console.log(`   🍽️  ${product.name} (${product.categories?.name}) - €${product.price}`);
    });
    
    console.log('\n🎉 EFES KEBAP menu update complete!');
    console.log('🔄 New menu items added:');
    console.log('   🐟 Pesce alla Griglia (4 items)');
    console.log('   👨‍🍳 Specialità dello Chef (2 items)');
    console.log('🌟 Please refresh your website to see the new menu items!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the script
addGrilledFishAndChefSpecialties();
