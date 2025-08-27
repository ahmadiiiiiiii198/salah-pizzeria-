// Fix Logo Settings Database Issue
import { createClient } from '@supabase/supabase-js';

// Use the same configuration as the main app
const SUPABASE_URL = "https://yliofvqfyimlbxjmsuow.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaW9mdnFmeWltbGJ4am1zdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDQzNjEsImV4cCI6MjA3MTI4MDM2MX0.5s5cxf9YHHQJMHPHxFxxzdkb01J2XbZAExa5POxJ6QY";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function fixLogoSettingsDatabase() {
  console.log('🍕 FIXING LOGO SETTINGS DATABASE ISSUE');
  console.log('=====================================');
  console.log('');

  try {
    // First, check the actual schema of the settings table
    console.log('1. 🔍 Checking settings table schema...');
    const { data: existingSettings, error: schemaError } = await supabase
      .from('settings')
      .select('*')
      .limit(1);
    
    if (schemaError) {
      console.error('❌ Error checking schema:', schemaError);
      return;
    }
    
    if (existingSettings && existingSettings.length > 0) {
      console.log('✅ Settings table schema:');
      console.log('   Columns:', Object.keys(existingSettings[0]));
    }
    console.log('');

    // Check if logoSettings already exists
    console.log('2. 🖼️ Checking for existing logoSettings...');
    const { data: existingLogo, error: logoCheckError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'logoSettings');
    
    if (logoCheckError) {
      console.error('❌ Error checking logoSettings:', logoCheckError);
      return;
    }
    
    if (existingLogo && existingLogo.length > 0) {
      console.log('✅ logoSettings already exists:');
      console.log('   Data:', JSON.stringify(existingLogo[0], null, 2));
      console.log('');
    } else {
      console.log('⚠️ logoSettings not found, creating...');
      
      // Create logoSettings without value_type column
      const defaultLogoSettings = {
        logoUrl: "/pizzeria-regina-logo.png",
        altText: "Pizzeria Regina 2000 Torino Logo",
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('settings')
        .insert({
          key: 'logoSettings',
          value: defaultLogoSettings
        })
        .select();
      
      if (insertError) {
        console.error('❌ Failed to create logoSettings:', insertError);
        return;
      }
      
      console.log('✅ logoSettings created successfully!');
      console.log('   Data:', JSON.stringify(insertData, null, 2));
      console.log('');
    }

    // Check if heroContent exists
    console.log('3. 🌟 Checking for existing heroContent...');
    const { data: existingHero, error: heroCheckError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'heroContent');
    
    if (heroCheckError) {
      console.error('❌ Error checking heroContent:', heroCheckError);
      return;
    }
    
    if (existingHero && existingHero.length > 0) {
      console.log('✅ heroContent already exists:');
      console.log('   Data:', JSON.stringify(existingHero[0], null, 2));
      console.log('');
    } else {
      console.log('⚠️ heroContent not found, creating...');
      
      // Create heroContent without value_type column
      const defaultHeroContent = {
        heading: "🍕 PIZZERIA Regina 2000",
        subheading: "Autentica pizza napoletana preparata con ingredienti freschi e forno a legna tradizionale nel cuore di Torino",
        backgroundImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
      };
      
      const { data: insertHeroData, error: insertHeroError } = await supabase
        .from('settings')
        .insert({
          key: 'heroContent',
          value: defaultHeroContent
        })
        .select();
      
      if (insertHeroError) {
        console.error('❌ Failed to create heroContent:', insertHeroError);
        return;
      }
      
      console.log('✅ heroContent created successfully!');
      console.log('   Data:', JSON.stringify(insertHeroData, null, 2));
      console.log('');
    }

    // Test the exact queries that the hooks use
    console.log('4. 🧪 Testing hook queries...');
    
    // Test logoSettings query
    const { data: logoTest, error: logoTestError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'logoSettings')
      .single();
    
    if (logoTestError) {
      console.error('❌ logoSettings query test failed:', logoTestError);
    } else {
      console.log('✅ logoSettings query test successful!');
      console.log('   Value:', logoTest.value);
    }
    
    // Test heroContent query
    const { data: heroTest, error: heroTestError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'heroContent')
      .single();
    
    if (heroTestError) {
      console.error('❌ heroContent query test failed:', heroTestError);
    } else {
      console.log('✅ heroContent query test successful!');
      console.log('   Value:', heroTest.value);
    }
    console.log('');

    // List all settings
    console.log('5. 📋 All settings in database:');
    const { data: allSettings, error: allError } = await supabase
      .from('settings')
      .select('*');
    
    if (allError) {
      console.error('❌ Error fetching all settings:', allError);
    } else {
      allSettings?.forEach((setting, index) => {
        console.log(`   ${index + 1}. ${setting.key}`);
        console.log(`      Value: ${JSON.stringify(setting.value)}`);
      });
    }
    console.log('');

    console.log('🎉 DATABASE FIX COMPLETED!');
    console.log('');
    console.log('📋 SUMMARY:');
    console.log('✅ Database connection: Working');
    console.log('✅ Settings table: Accessible');
    console.log('✅ logoSettings: Created/Verified');
    console.log('✅ heroContent: Created/Verified');
    console.log('✅ Hook queries: Tested');
    console.log('');
    console.log('🚀 The logo editor should now work!');
    console.log('   Try refreshing: http://localhost:3000/admin');
    console.log('   Go to: "Gestione Contenuti" tab');

  } catch (error) {
    console.error('💥 Unexpected error during database fix:', error);
  }
}

// Run the fix
fixLogoSettingsDatabase().catch(console.error);
