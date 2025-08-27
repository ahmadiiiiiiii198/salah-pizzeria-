#!/usr/bin/env node

/**
 * Update Product Images with High-Quality Food Photography
 * This script updates all products with appropriate images from Unsplash
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://htdgoceqepvrffblfvns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// High-quality food images from Unsplash (free to use)
const productImages = {
  // PIZZE
  'Margherita': 'https://images.unsplash.com/photo-1598023696416-0193a0bcd302?w=800&h=600&fit=crop&crop=center',
  '4 Formaggi': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&crop=center',
  '4 Stagioni': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&crop=center',
  'Americana': 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=600&fit=crop&crop=center',
  'Capricciosa': 'https://images.unsplash.com/photo-1579751626657-72bc17010498?w=800&h=600&fit=crop&crop=center',
  'Cotto': 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=800&h=600&fit=crop&crop=center',
  'Diavola': 'https://images.unsplash.com/photo-1552539618-7eec9b4d1796?w=800&h=600&fit=crop&crop=center',
  'Kebab': 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&h=600&fit=crop&crop=center',
  'Tonno & Cipolla': 'https://images.unsplash.com/photo-1589187151053-5ec8818e661b?w=800&h=600&fit=crop&crop=center',

  // PANINI & PIADINE
  'Chicken Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&crop=center',
  'Panino Burger': 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop&crop=center',
  'Panino Falafel': 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&h=600&fit=crop&crop=center',
  'Panino Hot Dog': 'https://images.unsplash.com/photo-1612392062798-2dd1e1842c5d?w=800&h=600&fit=crop&crop=center',
  'Panino Kebab': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop&crop=center',
  'Panino Kofta': 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&h=600&fit=crop&crop=center',
  'Piadina Kebab': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&h=600&fit=crop&crop=center',
  'Piadina Nutella': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop&crop=center',

  // PIATTI
  'Piatto Alette di Pollo': 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&h=600&fit=crop&crop=center',
  'Piatto Bistecca di Pollo': 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&h=600&fit=crop&crop=center',
  'Piatto Falafel': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop&crop=center',
  'Piatto Kebab': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop&crop=center',
  'Piatto Kofta': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&crop=center',
  'Piatto Nuggets & Alette di Pollo': 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&h=600&fit=crop&crop=center',

  // TACOS
  'Tacos con Carne Tritata': 'https://images.unsplash.com/photo-1565299585323-38174c4a6471?w=800&h=600&fit=crop&crop=center',
  'Tacos di Kebab': 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&h=600&fit=crop&crop=center',
  'Tacos di Pollo': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&crop=center',

  // MENU COMBOS
  'Margherita Menu': 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=600&fit=crop&crop=center',
  'Panino Kebab Menu': 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&h=600&fit=crop&crop=center',
  'Piadina Kebab Menu': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&h=600&fit=crop&crop=center'
};

async function updateProductImages() {
  console.log('🍕 UPDATING PRODUCT IMAGES WITH HIGH-QUALITY FOOD PHOTOGRAPHY');
  console.log('=============================================================');
  console.log('');

  let successCount = 0;
  let errorCount = 0;

  try {
    // Get all products
    console.log('📋 Fetching all products...');
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name, image_url')
      .eq('is_active', true);

    if (fetchError) {
      throw new Error(`Failed to fetch products: ${fetchError.message}`);
    }

    console.log(`✅ Found ${products.length} active products`);
    console.log('');

    // Update each product with appropriate image
    for (const product of products) {
      const productName = product.name;
      const imageUrl = productImages[productName];

      console.log(`🔄 Processing: ${productName}`);

      if (imageUrl) {
        try {
          // Update product image
          const { error: updateError } = await supabase
            .from('products')
            .update({ image_url: imageUrl })
            .eq('id', product.id);

          if (updateError) {
            console.log(`   ❌ Failed to update: ${updateError.message}`);
            errorCount++;
          } else {
            console.log(`   ✅ Updated with: ${imageUrl}`);
            successCount++;
          }
        } catch (error) {
          console.log(`   ❌ Error updating: ${error.message}`);
          errorCount++;
        }
      } else {
        console.log(`   ⚠️ No image mapping found for: ${productName}`);
        console.log(`   💡 Using default pizza image...`);
        
        // Use default pizza image for unmapped products
        const defaultImage = 'https://images.unsplash.com/photo-1598023696416-0193a0bcd302?w=800&h=600&fit=crop&crop=center';
        
        try {
          const { error: updateError } = await supabase
            .from('products')
            .update({ image_url: defaultImage })
            .eq('id', product.id);

          if (updateError) {
            console.log(`   ❌ Failed to update with default: ${updateError.message}`);
            errorCount++;
          } else {
            console.log(`   ✅ Updated with default image`);
            successCount++;
          }
        } catch (error) {
          console.log(`   ❌ Error updating with default: ${error.message}`);
          errorCount++;
        }
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('');
    console.log('=============================================================');
    console.log('📊 UPDATE SUMMARY');
    console.log('=============================================================');
    console.log(`✅ Successfully updated: ${successCount} products`);
    console.log(`❌ Failed to update: ${errorCount} products`);
    console.log(`📊 Total processed: ${products.length} products`);
    console.log('');

    if (successCount > 0) {
      console.log('🎉 PRODUCT IMAGES UPDATED SUCCESSFULLY!');
      console.log('');
      console.log('📸 Image Sources:');
      console.log('• All images are from Unsplash (free to use)');
      console.log('• High-quality food photography');
      console.log('• Optimized for web (800x600, cropped)');
      console.log('• Professional restaurant-quality images');
      console.log('');
      console.log('🔗 Test the results:');
      console.log('• Visit: http://localhost:3000/');
      console.log('• Check the products section');
      console.log('• All products should now have beautiful images!');
    }

    if (errorCount > 0) {
      console.log('⚠️ Some products failed to update. Check the logs above for details.');
    }

  } catch (error) {
    console.error('💥 Script failed:', error.message);
    process.exit(1);
  }
}

// Run the update
updateProductImages().then(() => {
  console.log('');
  console.log('🏁 Script completed successfully!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
