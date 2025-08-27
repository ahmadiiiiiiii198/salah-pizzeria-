#!/usr/bin/env node

/**
 * Update all pizzeria branding from "Pizzeria Regina 2000" to "Pizzeria Senza Cipolla"
 * and update address from "Corso Regina Margherita" to "C.so Giulio Cesare, 36, 10152 Torino TO"
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://htdgoceqepvrffblfvns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🍕 UPDATING PIZZERIA BRANDING');
console.log('=============================');
console.log('📝 Changing: "Pizzeria Regina 2000" → "Pizzeria Senza Cipolla"');
console.log('📍 Changing: "Corso Regina Margherita" → "C.so Giulio Cesare, 36, 10152 Torino TO"');
console.log('');

async function updatePizzeriaBranding() {
  try {
    // 1. Update navbar logo settings
    console.log('1. 🖼️ Updating navbar logo settings...');
    const { data: currentNavbarLogo, error: fetchNavbarError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'navbarLogoSettings')
      .single();

    if (currentNavbarLogo) {
      const updatedNavbarLogo = {
        ...currentNavbarLogo.value,
        altText: "Pizzeria Senza Cipolla Navbar Logo"
      };

      const { error: updateNavbarError } = await supabase
        .from('settings')
        .update({ 
          value: updatedNavbarLogo,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'navbarLogoSettings');

      if (updateNavbarError) {
        console.error('❌ Error updating navbar logo:', updateNavbarError.message);
      } else {
        console.log('✅ Navbar logo alt text updated');
      }
    }

    // 2. Update logo settings
    console.log('2. 🖼️ Updating logo settings...');
    const { data: currentLogo, error: fetchLogoError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'logoSettings')
      .single();

    if (currentLogo) {
      const updatedLogo = {
        ...currentLogo.value,
        altText: "Pizzeria Senza Cipolla Torino Logo"
      };

      const { error: updateLogoError } = await supabase
        .from('settings')
        .update({ 
          value: updatedLogo,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'logoSettings');

      if (updateLogoError) {
        console.error('❌ Error updating logo settings:', updateLogoError.message);
      } else {
        console.log('✅ Logo settings updated');
      }
    }

    // 3. Update hero content
    console.log('3. 🏠 Updating hero content...');
    const { data: currentHero, error: fetchHeroError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'heroContent')
      .single();

    if (currentHero) {
      const updatedHero = {
        ...currentHero.value,
        heading: "🍕 PIZZERIA Senza Cipolla",
        subheading: "Autentica pizza napoletana preparata con ingredienti freschi e forno a legna tradizionale nel cuore di Torino"
      };

      const { error: updateHeroError } = await supabase
        .from('settings')
        .update({ 
          value: updatedHero,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'heroContent');

      if (updateHeroError) {
        console.error('❌ Error updating hero content:', updateHeroError.message);
      } else {
        console.log('✅ Hero content updated');
      }
    }

    // 4. Update contact content
    console.log('4. 📞 Updating contact content...');
    const { data: currentContact, error: fetchContactError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'contactContent')
      .single();

    if (currentContact) {
      const updatedContact = {
        ...currentContact.value,
        address: "C.so Giulio Cesare, 36, 10152 Torino TO"
      };

      const { error: updateContactError } = await supabase
        .from('settings')
        .update({ 
          value: updatedContact,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'contactContent');

      if (updateContactError) {
        console.error('❌ Error updating contact content:', updateContactError.message);
      } else {
        console.log('✅ Contact content updated');
      }
    }

    // 5. Update restaurant settings
    console.log('5. 🏪 Updating restaurant settings...');
    const { data: currentRestaurant, error: fetchRestaurantError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'restaurantSettings')
      .single();

    if (currentRestaurant) {
      const updatedRestaurant = {
        ...currentRestaurant.value,
        restaurant_name: "Pizzeria Senza Cipolla Torino"
      };

      const { error: updateRestaurantError } = await supabase
        .from('settings')
        .update({ 
          value: updatedRestaurant,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'restaurantSettings');

      if (updateRestaurantError) {
        console.error('❌ Error updating restaurant settings:', updateRestaurantError.message);
      } else {
        console.log('✅ Restaurant settings updated');
      }
    }

    // 6. Update meta settings if they exist
    console.log('6. 🔍 Updating meta settings...');
    const metaUpdates = [
      {
        key: 'meta_title',
        value: 'Pizzeria Senza Cipolla Torino - Autentica Pizza Italiana'
      },
      {
        key: 'meta_description', 
        value: 'Pizzeria Senza Cipolla a Torino offre autentica pizza italiana. Ordina online per consegna a domicilio o ritiro.'
      },
      {
        key: 'email',
        value: 'info@pizzeriasenzacipolla.it'
      },
      {
        key: 'website',
        value: 'https://pizzeriasenzacipolla.it'
      }
    ];

    for (const meta of metaUpdates) {
      const { error: metaError } = await supabase
        .from('settings')
        .upsert({
          key: meta.key,
          value: meta.value,
          updated_at: new Date().toISOString()
        });

      if (metaError) {
        console.log(`⚠️ Could not update ${meta.key}:`, metaError.message);
      } else {
        console.log(`✅ Updated ${meta.key}`);
      }
    }

    console.log('');
    console.log('🎉 BRANDING UPDATE COMPLETED!');
    console.log('============================');
    console.log('✅ Pizzeria name changed to "Pizzeria Senza Cipolla"');
    console.log('✅ Address changed to "C.so Giulio Cesare, 36, 10152 Torino TO"');
    console.log('✅ All logo alt texts updated');
    console.log('✅ Hero content updated');
    console.log('✅ Contact information updated');
    console.log('✅ Meta information updated');
    console.log('');
    console.log('🔄 Please refresh your browser to see the changes!');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

updatePizzeriaBranding();
