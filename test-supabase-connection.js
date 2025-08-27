import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yliofvqfyimlbxjmsuow.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaW9mdnFmeWltbGJ4am1zdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDQzNjEsImV4cCI6MjA3MTI4MDM2MX0.5s5cxf9YHHQJMHPHxFxxzdkb01J2XbZAExa5POxJ6QY'
);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .limit(1);
    
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Success! Found categories:', data);
    }
  } catch (err) {
    console.error('Caught error:', err);
  }
}

testConnection();
