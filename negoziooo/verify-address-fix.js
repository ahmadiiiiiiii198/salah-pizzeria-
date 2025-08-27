#!/usr/bin/env node

/**
 * Verify address is correctly updated everywhere
 */

import fs from 'fs';
import path from 'path';

console.log('📍 VERIFYING ADDRESS UPDATE');
console.log('============================');

const oldAddress = "Corso Regina Margherita, 53/b, 10124, Torino TO, Italia";
const newAddress = "C.so Giulio Cesare, 36, 10152 Torino TO";

console.log(`🔍 Searching for old address: "${oldAddress}"`);
console.log(`✅ Expected new address: "${newAddress}"`);

// Files to check
const filesToCheck = [
  'src/hooks/use-language.tsx',
  'src/components/Hero.tsx',
  'src/components/Contact.tsx',
  'src/services/settingsService.ts'
];

let foundOldAddress = false;

console.log('\n📂 CHECKING FILES:');
console.log('==================');

filesToCheck.forEach(filePath => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    if (content.includes(oldAddress)) {
      console.log(`❌ ${filePath}: Still contains old address!`);
      foundOldAddress = true;
    } else if (content.includes(newAddress)) {
      console.log(`✅ ${filePath}: Contains new address`);
    } else {
      console.log(`ℹ️ ${filePath}: No address found (may be dynamic)`);
    }
  } catch (error) {
    console.log(`⚠️ ${filePath}: Could not read file`);
  }
});

console.log('\n🎯 VERIFICATION RESULTS:');
console.log('========================');

if (foundOldAddress) {
  console.log('❌ OLD ADDRESS STILL FOUND IN SOME FILES!');
  console.log('   Please check the files marked with ❌ above');
} else {
  console.log('✅ NO OLD ADDRESSES FOUND!');
  console.log('✅ Address update appears successful');
}

console.log('\n🔄 WHAT TO DO NEXT:');
console.log('===================');
console.log('1. 🌐 Refresh your browser (Ctrl+F5 or Cmd+Shift+R)');
console.log('2. 👀 Check the hero section address display');
console.log('3. 📱 The address should now show: "📍 C.so Giulio Cesare, 36, 10152 Torino TO"');

console.log('\n🎉 Address verification complete!');
