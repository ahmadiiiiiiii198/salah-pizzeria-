import { createClient } from '@supabase/supabase-js';

// Correct Supabase configuration
const CORRECT_DB_URL = 'https://yliofvqfyimlbxjmsuow.supabase.co';
const CORRECT_DB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaW9mdnFmeWltbGJ4am1zdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDQzNjEsImV4cCI6MjA3MTI4MDM2MX0.5s5cxf9YHHQJMHPHxFxxzdkb01J2XbZAExa5POxJ6QY';

const supabase = createClient(CORRECT_DB_URL, CORRECT_DB_KEY);

console.log('🎯 FINAL CHI SIAMO CONTENT VERIFICATION');
console.log('=======================================');

async function finalChiSiamoVerification() {
  try {
    // 1. Check database content
    console.log('1. 📊 Checking database Chi Siamo content...');
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

    // 2. Verify all content matches the new text
    console.log('\n2. ✅ VERIFYING NEW CONTENT STRUCTURE');
    console.log('=====================================');

    // Check Italian content
    console.log('\n🇮🇹 Italian Content:');
    console.log(`   Title: ${content.it.title}`);
    console.log(`   Story Title: ${content.it.storyTitle}`);
    console.log(`   Quote: ${content.it.quote}`);
    console.log(`   Services Title: ${content.it.servicesTitle}`);
    console.log(`   Closing Message: ${content.it.closingMessage}`);

    // Check English content
    console.log('\n🇬🇧 English Content:');
    console.log(`   Title: ${content.en.title}`);
    console.log(`   Story Title: ${content.en.storyTitle}`);
    console.log(`   Quote: ${content.en.quote}`);
    console.log(`   Services Title: ${content.en.servicesTitle}`);
    console.log(`   Closing Message: ${content.en.closingMessage}`);

    // 3. Verify the exact content matches what was requested
    console.log('\n3. 🎯 CONTENT VERIFICATION');
    console.log('==========================');

    const expectedItalianTitle = '👨‍🍳 Chi Siamo - Pizzeria Senza Cipolla';
    const expectedItalianStoryTitle = '🍕 La Nostra Storia';
    const expectedItalianQuote = '🏪 Nella nostra pizzeria puoi trovare:';

    const italianTitleMatch = content.it.title === expectedItalianTitle;
    const italianStoryTitleMatch = content.it.storyTitle === expectedItalianStoryTitle;
    const italianQuoteMatch = content.it.quote === expectedItalianQuote;

    console.log(`✅ Italian title matches: ${italianTitleMatch ? 'YES' : 'NO'}`);
    console.log(`✅ Italian story title matches: ${italianStoryTitleMatch ? 'YES' : 'NO'}`);
    console.log(`✅ Italian quote matches: ${italianQuoteMatch ? 'YES' : 'NO'}`);

    // Check for correct branding throughout
    const italianParagraph1HasCorrectBranding = content.it.paragraph1.includes('Pizzeria Senza Cipolla');
    const italianClosingHasCorrectBranding = content.it.closingMessage.includes('Pizzeria Senza Cipolla');
    const englishParagraph1HasCorrectBranding = content.en.paragraph1.includes('Pizzeria Senza Cipolla');
    const englishClosingHasCorrectBranding = content.en.closingMessage.includes('Pizzeria Senza Cipolla');

    console.log(`✅ Italian paragraph has correct branding: ${italianParagraph1HasCorrectBranding ? 'YES' : 'NO'}`);
    console.log(`✅ Italian closing has correct branding: ${italianClosingHasCorrectBranding ? 'YES' : 'NO'}`);
    console.log(`✅ English paragraph has correct branding: ${englishParagraph1HasCorrectBranding ? 'YES' : 'NO'}`);
    console.log(`✅ English closing has correct branding: ${englishClosingHasCorrectBranding ? 'YES' : 'NO'}`);

    // 4. Check services list
    console.log('\n4. 🍕 SERVICES LIST VERIFICATION');
    console.log('================================');

    const expectedServices = [
      'Pizza italiana cotta nel forno a legna',
      'Ingredienti freschi e di prima qualità',
      'Impasto preparato quotidianamente con lievitazione naturale',
      'Servizio per eventi e feste personalizzato'
    ];

    const servicesMatch = JSON.stringify(content.it.services) === JSON.stringify(expectedServices);
    console.log(`✅ Services list matches: ${servicesMatch ? 'YES' : 'NO'}`);

    if (servicesMatch) {
      console.log('   All 4 services are correctly listed');
    } else {
      console.log('   ❌ Services list does not match expected content');
      console.log('   Expected:', expectedServices);
      console.log('   Actual:', content.it.services);
    }

    // 5. Final summary
    console.log('\n🎉 FINAL VERIFICATION SUMMARY');
    console.log('=============================');

    const allChecks = [
      italianTitleMatch,
      italianStoryTitleMatch,
      italianQuoteMatch,
      italianParagraph1HasCorrectBranding,
      italianClosingHasCorrectBranding,
      englishParagraph1HasCorrectBranding,
      englishClosingHasCorrectBranding,
      servicesMatch
    ];

    const passedChecks = allChecks.filter(check => check).length;
    const totalChecks = allChecks.length;

    console.log(`✅ Passed: ${passedChecks}/${totalChecks} verification checks`);
    console.log(`📊 Success Rate: ${((passedChecks / totalChecks) * 100).toFixed(1)}%`);

    if (passedChecks === totalChecks) {
      console.log('\n🎉 PERFECT! All Chi Siamo content updated successfully!');
      console.log('\n📋 WHAT YOU SHOULD SEE ON YOUR WEBSITE:');
      console.log('=======================================');
      console.log('👨‍🍳 Title: "Chi Siamo - Pizzeria Senza Cipolla"');
      console.log('🍕 Story Title: "La Nostra Storia"');
      console.log('📝 Content: Updated with new Pizzeria Senza Cipolla branding');
      console.log('🏪 Quote: "Nella nostra pizzeria puoi trovare:"');
      console.log('📋 Services: All 4 services listed correctly');
      console.log('\n🔄 NEXT STEPS:');
      console.log('==============');
      console.log('1. 🌐 Refresh your website (Ctrl+F5 or Cmd+Shift+R)');
      console.log('2. 👀 Navigate to the Chi Siamo section');
      console.log('3. ✅ Verify the new content appears correctly');
      console.log('4. 🌍 Test both Italian and English versions');
    } else {
      console.log('\n⚠️ Some verification checks failed. Please review the issues above.');
    }

  } catch (error) {
    console.error('❌ Unexpected error during verification:', error);
  }
}

// Run the verification
finalChiSiamoVerification();
