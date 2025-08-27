#!/usr/bin/env node

// Script to trigger hero content refresh
console.log('🔄 Triggering hero content refresh...');

// This script can be run to force refresh the hero content
// It simulates the event that the admin panel would trigger

const heroContent = {
  heading: "Pizzeria Regina 2000",
  subheading: "Autentica pizza italiana nel cuore di Torino",
  backgroundImage: "https://yliofvqfyimlbxjmsuow.supabase.co/storage/v1/object/public/uploads/hero-backgrounds/1755820475277-ayowibsh74a.jpg"
};

console.log('📡 Dispatching heroContentUpdated event...');
console.log('🖼️ New background image:', heroContent.backgroundImage);

// In a browser environment, this would trigger the refresh
if (typeof window !== 'undefined') {
  window.dispatchEvent(new CustomEvent('heroContentUpdated', {
    detail: heroContent
  }));
  console.log('✅ Event dispatched successfully');
} else {
  console.log('ℹ️ This script should be run in a browser console or embedded in a webpage');
  console.log('📋 Copy this code and run it in your browser console:');
  console.log(`
window.dispatchEvent(new CustomEvent('heroContentUpdated', {
  detail: ${JSON.stringify(heroContent, null, 2)}
}));
  `);
}

console.log('🏠 The homepage should refresh automatically to show the new background image');
