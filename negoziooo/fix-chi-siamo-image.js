// Script to fix the empty chiSiamoImage in the database
// This script should be run in Node.js environment with Supabase access

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://yliofvqfyimlbxjmsuow.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaW9mdnFmeWltbGJ4am1zdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NTU0NzQsImV4cCI6MjA1MjUzMTQ3NH0.Ej5Ej5qGVJJqKjGqKjGqKjGqKjGqKjGqKjGqKjGqKjG';

const supabase = createClient(supabaseUrl, supabaseKey);

const fixChiSiamoImage = async () => {
  try {
    console.log('🔧 Starting Chi Siamo image fix...');

    // First, check current state
    console.log('📊 Checking current chiSiamoImage state...');
    const { data: currentData, error: fetchError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'chiSiamoImage')
      .single();

    if (fetchError) {
      console.error('❌ Error fetching current data:', fetchError);
      return;
    }

    console.log('📦 Current chiSiamoImage data:', currentData.value);

    // Check if image field is empty
    if (!currentData.value?.image || currentData.value.image === '') {
      console.log('🔄 Image field is empty, setting default image...');

      // Set a default image URL
      const defaultImageUrl = 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';

      const updatedValue = {
        ...currentData.value,
        image: defaultImageUrl
      };

      const { error: updateError } = await supabase
        .from('settings')
        .update({
          value: updatedValue,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'chiSiamoImage');

      if (updateError) {
        console.error('❌ Error updating chiSiamoImage:', updateError);
        return;
      }

      console.log('✅ chiSiamoImage updated with default image');
      console.log('🖼️ New image URL:', defaultImageUrl);
    } else {
      console.log('✅ chiSiamoImage already has an image:', currentData.value.image);
    }

    // Verify the update
    console.log('🔍 Verifying update...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'chiSiamoImage')
      .single();

    if (verifyError) {
      console.error('❌ Error verifying update:', verifyError);
      return;
    }

    console.log('✅ Verification complete. Final chiSiamoImage data:', verifyData.value);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
};

// Run the fix
fixChiSiamoImage();