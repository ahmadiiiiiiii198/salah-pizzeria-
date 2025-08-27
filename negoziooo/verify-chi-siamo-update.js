import { createClient } from '@supabase/supabase-js';

// Correct Supabase configuration
const CORRECT_DB_URL = 'https://htdgoceqepvrffblfvns.supabase.co';
const CORRECT_DB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8';

const supabase = createClient(CORRECT_DB_URL, CORRECT_DB_KEY);

console.log('🔍 VERIFYING CHI SIAMO CONTENT UPDATE');
console.log('====================================');

async function verifyChiSiamoUpdate() {
  try {
    // 1. Check database content
    console.log('1. 📊 Checking database content...');
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'chiSiamoContent')
      .single();

    if (error) {
      console.error('❌ Error fetching Chi Siamo content:', error);
      return;
    }

    if (!data?.value) {
      console.log('❌ No Chi Siamo content found in database');
      return;
    }

    const content = data.value;

    // 2. Verify Italian content
    console.log('\n2. 🇮🇹 Verifying Italian content...');
    console.log('✅ Title:', content.it.title);
    console.log('✅ Story Title:', content.it.storyTitle);
    console.log('✅ Quote:', content.it.quote);
    console.log('✅ Closing Message:', content.it.closingMessage);

    // Check for correct branding
    const hasCorrectItalianBranding = content.it.title.includes('Pizzeria Senza Cipolla') &&
                                     content.it.paragraph1.includes('Pizzeria Senza Cipolla') &&
                                     content.it.closingMessage.includes('Pizzeria Senza Cipolla');

    if (hasCorrectItalianBranding) {
      console.log('✅ Italian branding updated correctly');
    } else {
      console.log('❌ Italian branding not fully updated');
    }

    // 3. Verify English content
    console.log('\n3. 🇬🇧 Verifying English content...');
    console.log('✅ Title:', content.en.title);
    console.log('✅ Story Title:', content.en.storyTitle);
    console.log('✅ Quote:', content.en.quote);
    console.log('✅ Closing Message:', content.en.closingMessage);

    // Check for correct branding
    const hasCorrectEnglishBranding = content.en.title.includes('Pizzeria Senza Cipolla') &&
                                     content.en.paragraph1.includes('Pizzeria Senza Cipolla') &&
                                     content.en.closingMessage.includes('Pizzeria Senza Cipolla');

    if (hasCorrectEnglishBranding) {
      console.log('✅ English branding updated correctly');
    } else {
      console.log('❌ English branding not fully updated');
    }

    // 4. Verify new content structure
    console.log('\n4. 🏗️ Verifying content structure...');
    
    const expectedFields = ['title', 'storyTitle', 'paragraph1', 'paragraph2', 'quote', 'quoteAuthor', 'servicesTitle', 'services', 'stats', 'closingMessage', 'tagline'];
    
    let italianStructureOk = true;
    let englishStructureOk = true;

    expectedFields.forEach(field => {
      if (!content.it[field]) {
        console.log(`❌ Missing Italian field: ${field}`);
        italianStructureOk = false;
      }
      if (!content.en[field]) {
        console.log(`❌ Missing English field: ${field}`);
        englishStructureOk = false;
      }
    });

    if (italianStructureOk) {
      console.log('✅ Italian content structure complete');
    }
    if (englishStructureOk) {
      console.log('✅ English content structure complete');
    }

    // 5. Verify services list
    console.log('\n5. 🍕 Verifying services list...');
    console.log('Italian services:');
    content.it.services.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service}`);
    });

    console.log('English services:');
    content.en.services.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service}`);
    });

    // 6. Summary
    console.log('\n🎯 VERIFICATION SUMMARY');
    console.log('======================');
    
    const allChecks = [
      hasCorrectItalianBranding,
      hasCorrectEnglishBranding,
      italianStructureOk,
      englishStructureOk
    ];

    const passedChecks = allChecks.filter(check => check).length;
    const totalChecks = allChecks.length;

    console.log(`✅ Passed: ${passedChecks}/${totalChecks} checks`);
    
    if (passedChecks === totalChecks) {
      console.log('🎉 ALL CHECKS PASSED! Chi Siamo content updated successfully.');
      console.log('\n🔄 WHAT TO DO NEXT:');
      console.log('==================');
      console.log('1. 🌐 Refresh your website (Ctrl+F5 or Cmd+Shift+R)');
      console.log('2. 👀 Navigate to the "Chi Siamo" section');
      console.log('3. 📱 Check both Italian and English versions');
      console.log('4. ✅ Verify the new content appears correctly');
    } else {
      console.log('⚠️ Some checks failed. Please review the issues above.');
    }

  } catch (error) {
    console.error('❌ Unexpected error during verification:', error);
  }
}

// Run the verification
verifyChiSiamoUpdate();
