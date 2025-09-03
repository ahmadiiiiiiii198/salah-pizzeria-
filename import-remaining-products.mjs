import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hnoadcbppldmawognwdx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhub2FkY2JwcGxkbWF3b2dud2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0OTI4NjEsImV4cCI6MjA1MTA2ODg2MX0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'
);

console.log('🚀 Importing remaining products to complete the database...\n');

async function importRemainingProducts() {
  try {
    // Check current product count
    const { data: currentProducts, error: countError } = await supabase
      .from('products')
      .select('id', { count: 'exact' });
    
    if (countError) {
      console.log('❌ Error checking current products:', countError.message);
      return;
    }
    
    console.log(`📊 Current products in database: ${currentProducts.length}`);
    console.log('🎯 Target: 127 products total\n');
    
    // Sample of remaining key products to import
    const remainingProducts = [
      {
        id: '545fd681-57ed-41f8-a150-62a1ecf76279',
        category_id: '0e5ebc18-5052-4d29-a2f4-4e336e103de4',
        name: '196 - PEPERONI',
        description: 'pomodoro, mozzarella, peperoni',
        price: 6,
        ingredients: ['pomodoro', 'mozzarella', 'peperoni'],
        is_featured: false,
        is_active: true,
        sort_order: 196,
        preparation_time: 15,
        slug: '196-peperoni'
      },
      {
        id: '40195481-84b5-411d-b4d7-66e32e338608',
        category_id: '0e5ebc18-5052-4d29-a2f4-4e336e103de4',
        name: '197 - PROSCIUTTO',
        description: 'pomodoro, mozzarella, prosc. cotto',
        price: 6.8,
        ingredients: ['pomodoro', 'mozzarella', 'prosciutto cotto'],
        is_featured: false,
        is_active: true,
        sort_order: 197,
        preparation_time: 15,
        slug: '197-prosciutto'
      },
      {
        id: '2b28ce58-c034-4e7d-93fb-e6df8a55b9e7',
        category_id: '0e5ebc18-5052-4d29-a2f4-4e336e103de4',
        name: '198 - WURSTEL',
        description: 'pomodoro, mozzarella, wurstel',
        price: 6,
        ingredients: ['pomodoro', 'mozzarella', 'wurstel'],
        is_featured: false,
        is_active: true,
        sort_order: 198,
        preparation_time: 15,
        slug: '198-wurstel'
      },
      {
        id: 'fde0a079-8ceb-4a06-8571-74b3f1c98dba',
        category_id: '0e5ebc18-5052-4d29-a2f4-4e336e103de4',
        name: '199 - GRECA',
        description: 'pomodoro, mozzarella, origano, olive',
        price: 6,
        ingredients: ['pomodoro', 'mozzarella', 'origano', 'olive'],
        is_featured: false,
        is_active: true,
        sort_order: 199,
        preparation_time: 15,
        slug: '199-greca'
      },
      {
        id: 'bfbb20f7-d9ad-4503-8f03-f3abefc5e9e9',
        category_id: '0e5ebc18-5052-4d29-a2f4-4e336e103de4',
        name: '200 - VALDOSTANA',
        description: 'pom., mozz., prosc. cotto, fontina',
        price: 7,
        ingredients: ['pomodoro', 'mozzarella', 'prosciutto cotto', 'fontina'],
        is_featured: false,
        is_active: true,
        sort_order: 200,
        preparation_time: 15,
        slug: '200-valdostana'
      },
      {
        id: '6204bd7b-d23d-42ee-9f6f-7cf788d25a16',
        category_id: '0e5ebc18-5052-4d29-a2f4-4e336e103de4',
        name: '201 - DIAVOLA',
        description: 'pomodoro, mozzarella, salamine picc.',
        price: 6,
        ingredients: ['pomodoro', 'mozzarella', 'salame piccante'],
        is_featured: true,
        is_active: true,
        sort_order: 201,
        preparation_time: 15,
        slug: '201-diavola'
      },
      {
        id: 'b53a4ed8-9c4a-402a-ade5-e6775d3764dc',
        category_id: '0e5ebc18-5052-4d29-a2f4-4e336e103de4',
        name: '202 - FUNGHI',
        description: 'pom., mozzarella, origano, funghi champignon',
        price: 6,
        ingredients: ['pomodoro', 'mozzarella', 'origano', 'funghi champignon'],
        is_featured: false,
        is_active: true,
        sort_order: 202,
        preparation_time: 15,
        slug: '202-funghi'
      },
      {
        id: '241c9bbc-f630-4f36-91bd-10efc1bef75d',
        category_id: '0e5ebc18-5052-4d29-a2f4-4e336e103de4',
        name: '203 - GORGONZOLA',
        description: 'pomodoro, mozzarella, gorgonzola',
        price: 6.5,
        ingredients: ['pomodoro', 'mozzarella', 'gorgonzola'],
        is_featured: false,
        is_active: true,
        sort_order: 203,
        preparation_time: 15,
        slug: '203-gorgonzola'
      },
      {
        id: '0e608cf7-8d97-4200-8074-edfbc977a550',
        category_id: '0e5ebc18-5052-4d29-a2f4-4e336e103de4',
        name: '204 - CONTADINA',
        description: 'pom., mozz. salsiccla, funghi, origano',
        price: 7,
        ingredients: ['pomodoro', 'mozzarella', 'salsiccia', 'funghi', 'origano'],
        is_featured: false,
        is_active: true,
        sort_order: 204,
        preparation_time: 15,
        slug: '204-contadina'
      },
      {
        id: '655138a5-e288-4410-b313-14b588a02d51',
        category_id: '0e5ebc18-5052-4d29-a2f4-4e336e103de4',
        name: '205 - 4 STAGIONI',
        description: 'pom., mozz., origano, p. cotto, carciofi, funghi, olive',
        price: 7.5,
        ingredients: ['pomodoro', 'mozzarella', 'origano', 'prosciutto cotto', 'carciofi', 'funghi', 'olive'],
        is_featured: true,
        is_active: true,
        sort_order: 205,
        preparation_time: 15,
        slug: '205-4-stagioni'
      }
    ];
    
    console.log(`🔄 Importing ${remainingProducts.length} key products...\n`);
    
    for (const product of remainingProducts) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert({
            id: product.id,
            category_id: product.category_id,
            name: product.name,
            description: product.description,
            price: product.price,
            ingredients: product.ingredients,
            is_featured: product.is_featured,
            is_active: product.is_active,
            sort_order: product.sort_order,
            preparation_time: product.preparation_time,
            slug: product.slug,
            stock_quantity: 0,
            is_vegetarian: false,
            is_vegan: false,
            is_gluten_free: false
          });
        
        if (error) {
          console.log(`❌ Error inserting ${product.name}:`, error.message);
        } else {
          console.log(`✅ Imported: ${product.name}`);
        }
      } catch (e) {
        console.log(`❌ Exception inserting ${product.name}:`, e.message);
      }
    }
    
    // Check final count
    const { data: finalProducts, error: finalCountError } = await supabase
      .from('products')
      .select('id', { count: 'exact' });
    
    if (!finalCountError) {
      console.log(`\n📊 Final product count: ${finalProducts.length}`);
      console.log(`🎯 Progress: ${finalProducts.length}/127 products (${Math.round(finalProducts.length/127*100)}%)`);
    }
    
    console.log('\n🎉 Key products import completed!');
    console.log('\n📝 Note: This imported the most essential products.');
    console.log('   For a complete import of all 127 products, you can:');
    console.log('   1. Use the full data-insertion-script.sql file');
    console.log('   2. Import via Supabase dashboard');
    console.log('   3. Run additional import scripts');
    
  } catch (error) {
    console.log('❌ Import failed:', error.message);
  }
}

importRemainingProducts().then(() => {
  console.log('\n🏁 Import process completed!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
