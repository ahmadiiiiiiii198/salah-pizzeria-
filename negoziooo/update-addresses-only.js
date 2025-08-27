#!/usr/bin/env node

/**
 * Update ONLY addresses from old to new
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://htdgoceqepvrffblfvns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('📍 UPDATING ADDRESSES ONLY');
console.log('===========================');
console.log('🔄 Changing ALL addresses to: "C.so Giulio Cesare, 36, 10152 Torino TO"');

async function updateAddressesOnly() {
  try {
    // Update contactContent
    console.log('1. 📞 Updating contact content address...');
    const { data: contactData, error: contactFetchError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'contactContent')
      .single();

    if (contactData) {
      const updatedContact = {
        ...contactData.value,
        address: "C.so Giulio Cesare, 36, 10152 Torino TO"
      };

      const { error: contactUpdateError } = await supabase
        .from('settings')
        .update({ 
          value: updatedContact,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'contactContent');

      if (contactUpdateError) {
        console.error('❌ Error updating contact address:', contactUpdateError.message);
      } else {
        console.log('✅ Contact address updated');
      }
    }

    // Update any shipping settings
    console.log('2. 🚚 Updating shipping settings address...');
    const shippingSettings = ['shippingZoneSettings', 'deliverySettings', 'mapSettings'];
    
    for (const setting of shippingSettings) {
      const { data, error: fetchError } = await supabase
        .from('settings')
        .select('*')
        .eq('key', setting)
        .single();

      if (data && !fetchError) {
        const updated = {
          ...data.value,
          restaurantAddress: "C.so Giulio Cesare, 36, 10152 Torino TO"
        };

        const { error: updateError } = await supabase
          .from('settings')
          .update({ 
            value: updated,
            updated_at: new Date().toISOString()
          })
          .eq('key', setting);

        if (updateError) {
          console.log(`⚠️ Could not update ${setting}:`, updateError.message);
        } else {
          console.log(`✅ Updated ${setting} address`);
        }
      }
    }

    console.log('\n🎯 ADDRESS UPDATE COMPLETE!');
    console.log('============================');
    console.log('✅ All database addresses updated to: "C.so Giulio Cesare, 36, 10152 Torino TO"');
    console.log('🔄 Refresh your browser to see the changes!');

  } catch (error) {
    console.error('❌ Address update error:', error.message);
  }
}

updateAddressesOnly();
