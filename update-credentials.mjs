#!/usr/bin/env node

// Script to update Supabase credentials in your codebase
// Run this after setting up your new Supabase project

import fs from 'fs';

const NEW_URL = 'https://YOUR_NEW_PROJECT_ID.supabase.co';
const NEW_ANON_KEY = 'YOUR_NEW_ANON_KEY_HERE';

const filesToUpdate = [
  'src/lib/supabase.ts',
  'src/integrations/supabase/client.ts',
  'scripts/check-database.js',
  'src/scripts/testBusinessHours.js',
  'src/scripts/testBusinessHoursFix.js',
  'src/scripts/testHeroImage.js',
  'check-supabase.js',
  'find-creds.mjs'
];

console.log('🔄 Updating Supabase credentials in codebase...');

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace URL
    content = content.replace(
      /https://yliofvqfyimlbxjmsuow.supabase.co/g,
      NEW_URL
    );
    
    // Replace anon key
    content = content.replace(
      /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaW9mdnFmeWltbGJ4am1zdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDQzNjEsImV4cCI6MjA3MTI4MDM2MX0.5s5cxf9YHHQJMHPHxFxxzdkb01J2XbZAExa5POxJ6QY/g,
      NEW_ANON_KEY
    );
    
    fs.writeFileSync(file, content);
    console.log(`✅ Updated: ${file}`);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('🏁 Credential update completed!');
