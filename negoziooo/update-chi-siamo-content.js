import { createClient } from '@supabase/supabase-js';

// Correct Supabase configuration
const CORRECT_DB_URL = 'https://htdgoceqepvrffblfvns.supabase.co';
const CORRECT_DB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8';

const supabase = createClient(CORRECT_DB_URL, CORRECT_DB_KEY);

console.log('🍕 Updating Chi Siamo content for Pizzeria Senza Cipolla...');

const NEW_CHI_SIAMO_CONTENT = {
  it: {
    title: '👨‍🍳 Chi Siamo - Pizzeria Senza Cipolla',
    storyTitle: '🍕 La Nostra Storia',
    paragraph1: 'Pizzeria Senza Cipolla nasce dalla passione per l\'autentica tradizione italiana e dall\'esperienza culinaria tramandata nel tempo. Da 14 anni, offriamo pizza italiana preparata con amore, ingredienti freschi e il nostro forno a legna tradizionale.',
    paragraph2: 'Le nostre pizze nascono da una profonda passione per la tradizione culinaria italiana. Solo ingredienti selezionati, solo autenticità made in Torino. 🍕 Situati nel cuore di Torino, offriamo esperienza artigianale e passione per la vera pizza italiana.',
    quote: '🏪 Nella nostra pizzeria puoi trovare:',
    quoteAuthor: 'Un viaggio tra sapori, tradizione e autenticità',
    servicesTitle: 'Nella nostra pizzeria puoi trovare:',
    services: [
      'Pizza italiana cotta nel forno a legna',
      'Ingredienti freschi e di prima qualità',
      'Impasto preparato quotidianamente con lievitazione naturale',
      'Servizio per eventi e feste personalizzato'
    ],
    stats: {
      years: 'Anni di Esperienza',
      customers: 'Clienti Soddisfatti',
      varieties: 'Varietà di Pizze'
    },
    closingMessage: 'Vieni a trovarci alla Pizzeria Senza Cipolla e scopri il vero sapore della tradizione italiana.',
    tagline: 'Creiamo sapori autentici, una pizza alla volta'
  },
  en: {
    title: '👨‍🍳 About Us - Pizzeria Senza Cipolla',
    storyTitle: '🍕 Our Story',
    paragraph1: 'Pizzeria Senza Cipolla was born from a passion for authentic Italian tradition and culinary experience passed down through time. For 14 years, we offer Italian pizza prepared with love, fresh ingredients and our traditional wood-fired oven.',
    paragraph2: 'Our pizzas are born from a deep passion for Italian culinary tradition. Only selected ingredients, only authenticity made in Turin. 🍕 Located in the heart of Turin, we offer artisanal experience and passion for authentic Italian pizza.',
    quote: '🏪 In our pizzeria you can find:',
    quoteAuthor: 'A journey through flavors, tradition and authenticity',
    servicesTitle: 'In our pizzeria you can find:',
    services: [
      'Italian pizza cooked in a wood-fired oven',
      'Fresh and top quality ingredients',
      'Dough prepared daily with natural leavening',
      'Service for events and personalized parties'
    ],
    stats: {
      years: 'Years of Experience',
      customers: 'Satisfied Customers',
      varieties: 'Pizza Varieties'
    },
    closingMessage: 'Come visit us at Pizzeria Senza Cipolla and discover the true taste of Italian tradition.',
    tagline: 'Creating authentic flavors, one pizza at a time'
  }
};

async function updateChiSiamoContent() {
  try {
    console.log('📝 Updating Chi Siamo content in database...');

    // Update the chiSiamoContent setting
    const { error } = await supabase
      .from('settings')
      .upsert({
        key: 'chiSiamoContent',
        value: NEW_CHI_SIAMO_CONTENT,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });

    if (error) {
      console.error('❌ Error updating Chi Siamo content:', error);
      return;
    }

    console.log('✅ Chi Siamo content updated successfully!');

    // Verify the update
    const { data: verifyData, error: verifyError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'chiSiamoContent')
      .single();

    if (!verifyError && verifyData?.value) {
      console.log('🔍 Verification successful:');
      console.log('   📝 Italian title:', verifyData.value.it.title);
      console.log('   📝 English title:', verifyData.value.en.title);
      console.log('   🍕 Italian story title:', verifyData.value.it.storyTitle);
      console.log('   🏪 Italian quote:', verifyData.value.it.quote);
    }

    console.log('\n🎉 Chi Siamo content update completed!');
    console.log('🔄 Refresh your website to see the new content.');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the update
updateChiSiamoContent();
