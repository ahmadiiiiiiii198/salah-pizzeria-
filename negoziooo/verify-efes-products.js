import { createClient } from '@supabase/supabase-js';

// Correct Supabase configuration for Pizzeria Regina 2000
const SUPABASE_URL = 'https://yliofvqfyimlbxjmsuow.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaW9mdnFmeWltbGJ4am1zdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDQzNjEsImV4cCI6MjA3MTI4MDM2MX0.5s5cxf9YHHQJMHPHxFxxzdkb01J2XbZAExa5POxJ6QY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verifyEfesProducts() {
  try {
    console.log('🔍 Verifying Efes Kebap products were added...');

    // Check for the new pizzas
    const { data: pizzas, error: pizzasError } = await supabase
      .from('products')
      .select('name, price, description, categories(name)')
      .ilike('name', '%233%')
      .or('name.ilike.%234%,name.ilike.%236%,name.ilike.%237%,name.ilike.%238%,name.ilike.%239%,name.ilike.%240%');

    if (pizzasError) {
      console.error('❌ Error fetching pizzas:', pizzasError);
    } else {
      console.log(`\n🍕 Found ${pizzas.length} new pizzas:`);
      pizzas.forEach(pizza => {
        console.log(`   • ${pizza.name} - €${pizza.price} (${pizza.categories?.name})`);
      });
    }

    // Check for rinforzo
    const { data: rinforzo, error: rinforzoError } = await supabase
      .from('products')
      .select('name, price, description, categories(name)')
      .eq('name', 'RINFORZO');

    if (rinforzoError) {
      console.error('❌ Error fetching rinforzo:', rinforzoError);
    } else {
      console.log(`\n➕ Found ${rinforzo.length} rinforzo items:`);
      rinforzo.forEach(item => {
        console.log(`   • ${item.name} - €${item.price} (${item.categories?.name})`);
      });
    }

    // Check for desserts
    const { data: desserts, error: dessertsError } = await supabase
      .from('products')
      .select('name, price, description, categories(name)')
      .or('name.ilike.%BAKLAVA%,name.ilike.%KADAYF%,name.ilike.%ŞEKERPARE%');

    if (dessertsError) {
      console.error('❌ Error fetching desserts:', dessertsError);
    } else {
      console.log(`\n🍰 Found ${desserts.length} desserts:`);
      desserts.forEach(dessert => {
        console.log(`   • ${dessert.name} - €${dessert.price} (${dessert.categories?.name})`);
      });
    }

    // Get total count of all products
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error getting total count:', countError);
    } else {
      console.log(`\n📊 Total products in database: ${count}`);
    }

    console.log('\n✅ Verification complete!');

  } catch (error) {
    console.error('❌ Error in verification:', error);
  }
}

// Run the verification
verifyEfesProducts();
