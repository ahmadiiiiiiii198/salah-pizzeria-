// Insert correct WeOffer content structure
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://htdgoceqepvrffblfvns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function insertWeOfferContent() {
  console.log('🔧 Inserting correct WeOffer content...');
  
  const newWeOfferContent = {
    heading: "Offriamo",
    subheading: "Scopri le nostre autentiche specialità italiane",
    offers: [
      {
        id: 1,
        title: "Pizza Metro Finchi 5 Gusti",
        description: "Prova la nostra pizza metro caratteristica con fino a 5 gusti diversi in un'unica creazione straordinaria. Perfetta da condividere con famiglia e amici.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        badge: "Specialità"
      },
      {
        id: 2,
        title: "Usiamo la Farina 5 Stagioni Gusti, Alta Qualità",
        description: "Utilizziamo farina premium 5 Stagioni, ingredienti della migliore qualità che rendono il nostro impasto per pizza leggero, digeribile e incredibilmente saporito.",
        image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        badge: "Qualità"
      },
      {
        id: 3,
        title: "Creiamo Tutti i Tipi di Pizza Italiana di Alta Qualità",
        description: "Dalla classica Margherita alle specialità gourmet, prepariamo ogni pizza con passione, utilizzando tecniche tradizionali e i migliori ingredienti per un'autentica esperienza italiana.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        badge: "Autentica"
      }
    ]
  };
  
  try {
    const { error } = await supabase
      .from('settings')
      .insert({
        key: 'weOfferContent',
        value: newWeOfferContent,
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('❌ Error inserting content:', error);
      return false;
    }
    
    console.log('✅ WeOffer content inserted successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

insertWeOfferContent().then(success => {
  if (success) {
    console.log('🎉 Done! WeOffer should now work correctly.');
  } else {
    console.log('❌ Failed to insert content.');
  }
}).catch(console.error);
