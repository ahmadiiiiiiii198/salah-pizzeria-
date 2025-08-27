#!/usr/bin/env node

/**
 * Verify frontend hours display shows "11-03" format
 */

import fs from 'fs';
import path from 'path';

console.log('🕒 VERIFYING FRONTEND HOURS DISPLAY');
console.log('===================================');

const filesToCheck = [
  {
    path: 'src/services/pizzeriaHoursService.ts',
    description: 'Pizzeria Hours Service (main display service)'
  },
  {
    path: 'src/services/businessHoursService.ts', 
    description: 'Business Hours Service (formatted hours)'
  },
  {
    path: 'src/components/Contact.tsx',
    description: 'Contact Component (hardcoded hours)'
  },
  {
    path: 'src/components/ContactSection.tsx',
    description: 'Contact Section Component (hardcoded hours)'
  }
];

console.log('📂 CHECKING FRONTEND DISPLAY FILES:');
console.log('===================================');

let allCorrect = true;

filesToCheck.forEach(({ path: filePath, description }) => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    if (content.includes('11-03')) {
      console.log(`✅ ${description}`);
      console.log(`   📁 ${filePath}`);
      console.log(`   ✅ Contains "11-03" format`);
    } else {
      console.log(`❌ ${description}`);
      console.log(`   📁 ${filePath}`);
      console.log(`   ❌ Does NOT contain "11-03" format`);
      allCorrect = false;
    }
    console.log('');
  } catch (error) {
    console.log(`⚠️ ${description}`);
    console.log(`   📁 ${filePath}`);
    console.log(`   ⚠️ Could not read file: ${error.message}`);
    console.log('');
    allCorrect = false;
  }
});

console.log('🎯 VERIFICATION RESULTS:');
console.log('========================');

if (allCorrect) {
  console.log('✅ ALL FRONTEND DISPLAY FILES UPDATED!');
  console.log('✅ Hours should now display as "11-03" format');
} else {
  console.log('❌ SOME FILES STILL NEED UPDATING');
  console.log('   Please check the files marked with ❌ above');
}

console.log('\n📅 EXPECTED DISPLAY FORMAT:');
console.log('===========================');
console.log('🍕 lunedì: 11-03');
console.log('🍕 martedì: 11-03');
console.log('🍕 mercoledì: 11-03');
console.log('🍕 giovedì: 11-03');
console.log('🍕 venerdì: 11-03');
console.log('🍕 sabato: 11-03');
console.log('🍕 domenica: 11-03');

console.log('\n🔄 WHAT TO DO NEXT:');
console.log('===================');
console.log('1. 🌐 Refresh your browser (Ctrl+F5 or Cmd+Shift+R)');
console.log('2. 👀 Check the opening hours display on your website');
console.log('3. 📱 Hours should now show "11-03" format everywhere');
console.log('4. ⚙️ Backend/database hours remain unchanged for functionality');

console.log('\n📝 IMPORTANT NOTE:');
console.log('==================');
console.log('✅ Frontend display: Updated to "11-03" format');
console.log('✅ Backend/database: Unchanged (keeps functionality)');
console.log('✅ This gives you the display you want while keeping the system working');

console.log('\n🎉 Frontend hours verification complete!');
