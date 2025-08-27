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

async function updateCorrectEfesLogo() {
  try {
    console.log('🥙 Updating navbar with the CORRECT Efes Kebap logo...');
    console.log('🔧 Using Supabase URL:', supabaseUrl);
    
    // Update navbar logo settings with the correct Efes logo
    const correctEfesSettings = {
      logoUrl: "/src/assets/efes-logo.svg",
      altText: "EFES KEBAP - Ristorante Pizzeria Logo",
      showLogo: true,
      logoSize: "medium"
    };

    console.log('📝 Updating navbar logo settings with correct Efes logo...');
    console.log('🖼️  Logo URL:', correctEfesSettings.logoUrl);
    console.log('📝 Alt Text:', correctEfesSettings.altText);

    const { error: updateError } = await supabase
      .from('settings')
      .update({ 
        value: correctEfesSettings,
        updated_at: new Date().toISOString()
      })
      .eq('key', 'navbarLogoSettings');

    if (updateError) {
      console.error('❌ Error updating navbar logo:', updateError.message);
      return;
    }

    console.log('✅ Navbar logo settings updated successfully!');

    // Verify the update
    console.log('\n🔍 Verifying navbar logo settings...');
    const { data: verified, error: verifyError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'navbarLogoSettings')
      .single();

    if (verifyError) {
      console.error('❌ Error verifying settings:', verifyError.message);
      return;
    }

    console.log('✅ Verification successful:');
    console.log(`   🖼️  Logo URL: ${verified.value.logoUrl}`);
    console.log(`   📝 Alt Text: ${verified.value.altText}`);
    console.log(`   👁️  Show Logo: ${verified.value.showLogo}`);
    console.log(`   📏 Logo Size: ${verified.value.logoSize}`);
    console.log(`   🕒 Updated At: ${verified.updated_at}`);

    console.log('\n🎉 CORRECT EFES KEBAP logo update complete!');
    console.log('🔄 The navbar should now display the proper Efes logo with:');
    console.log('   - "EFES" text at the top');
    console.log('   - Circular design with "EFES KEBAP" in center');
    console.log('   - Stylized bull/ox head icon');
    console.log('   - "RISTORANTE - PIZZERIA" text around bottom');
    console.log('🌟 Please refresh your browser to see the changes!');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the update
updateCorrectEfesLogo();
