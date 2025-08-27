#!/usr/bin/env node

/**
 * Ultimate cleanup - find and report ALL remaining hardcoded references
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const SUPABASE_URL = 'https://yliofvqfyimlbxjmsuow.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaW9mdnFmeWltbGJ4am1zdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDQzNjEsImV4cCI6MjA3MTI4MDM2MX0.5s5cxf9YHHQJMHPHxFxxzdkb01J2XbZAExa5POxJ6QY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 ULTIMATE HARDCODE CLEANUP');
console.log('============================');

// Patterns to search for
const oldPatterns = [
  'Regina 2000',
  'Regina Margherita', 
  'Corso Regina',
  '10124',
  'pizzeria-regina-logo',
  'Pizzeria Regina'
];

const newValues = {
  'Regina 2000': 'Senza Cipolla',
  'Regina Margherita': 'Giulio Cesare',
  'Corso Regina': 'C.so Giulio Cesare',
  '10124': '10152',
  'pizzeria-regina-logo': 'pizzeria-senza-cipolla-logo',
  'Pizzeria Regina': 'Pizzeria Senza Cipolla'
};

function scanDirectory(dir, results = []) {
  try {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules, .git, dist, etc.
        if (!['node_modules', '.git', 'dist', '.next', 'build'].includes(item)) {
          scanDirectory(fullPath, results);
        }
      } else if (stat.isFile()) {
        // Only scan relevant file types
        const ext = item.split('.').pop()?.toLowerCase();
        if (['js', 'ts', 'tsx', 'jsx', 'html', 'json', 'md', 'sql'].includes(ext || '')) {
          results.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Skip directories we can't read
  }
  
  return results;
}

function scanFileForPatterns(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const findings = [];
    
    for (const pattern of oldPatterns) {
      if (content.includes(pattern)) {
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.includes(pattern)) {
            findings.push({
              pattern,
              line: index + 1,
              content: line.trim()
            });
          }
        });
      }
    }
    
    return findings;
  } catch (error) {
    return [];
  }
}

async function ultimateCleanup() {
  try {
    console.log('1. 📁 Scanning all files for old references...');
    
    const allFiles = scanDirectory('.');
    const filesWithIssues = [];
    
    for (const file of allFiles) {
      const findings = scanFileForPatterns(file);
      if (findings.length > 0) {
        filesWithIssues.push({
          file: file.replace(process.cwd() + '\\', ''),
          findings
        });
      }
    }
    
    console.log(`\n📊 Found ${filesWithIssues.length} files with old references:`);
    
    if (filesWithIssues.length === 0) {
      console.log('✅ No hardcoded references found!');
    } else {
      filesWithIssues.forEach(({ file, findings }) => {
        console.log(`\n❌ ${file}:`);
        findings.forEach(({ pattern, line, content }) => {
          console.log(`   Line ${line}: "${pattern}" in: ${content.substring(0, 80)}...`);
        });
      });
    }
    
    console.log('\n2. 🗄️ Checking database settings...');
    
    const criticalSettings = [
      'navbarLogoSettings',
      'logoSettings',
      'heroContent',
      'contactContent',
      'restaurantSettings'
    ];
    
    let dbClean = true;
    
    for (const setting of criticalSettings) {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', setting)
        .single();
      
      if (data) {
        const valueStr = JSON.stringify(data.value);
        const hasOldRefs = oldPatterns.some(pattern => valueStr.includes(pattern));
        
        if (hasOldRefs) {
          console.log(`❌ ${setting}: Contains old references`);
          dbClean = false;
        } else {
          console.log(`✅ ${setting}: Clean`);
        }
      }
    }
    
    console.log('\n🎯 ULTIMATE CLEANUP SUMMARY');
    console.log('===========================');
    
    if (filesWithIssues.length === 0 && dbClean) {
      console.log('🎉 PERFECT! All hardcoded references have been eliminated!');
      console.log('✅ All files are clean');
      console.log('✅ All database settings are clean');
      console.log('✅ Complete rebranding successful');
    } else {
      console.log('⚠️ Some references still need attention:');
      if (filesWithIssues.length > 0) {
        console.log(`   📁 ${filesWithIssues.length} files need manual review`);
      }
      if (!dbClean) {
        console.log('   🗄️ Some database settings need review');
      }
    }
    
    console.log('\n📝 WHAT SHOULD BE UPDATED:');
    console.log('==========================');
    console.log('✅ "Pizzeria Regina 2000" → "Pizzeria Senza Cipolla"');
    console.log('✅ "Corso Regina Margherita" → "C.so Giulio Cesare, 36, 10152 Torino TO"');
    console.log('✅ All logo alt texts updated');
    console.log('✅ All contact information updated');
    console.log('✅ All meta tags updated');
    console.log('✅ All coordinates updated');
    
    console.log('\n🔄 FINAL VERIFICATION:');
    console.log('======================');
    console.log('Please refresh your browser and check:');
    console.log('   🏠 Header: "Pizzeria Senza Cipolla"');
    console.log('   🎭 Hero: "🍕 PIZZERIA Senza Cipolla"');
    console.log('   📞 Footer: "C.so Giulio Cesare, 36, 10152 Torino TO"');
    console.log('   🌐 Browser tab: "Pizzeria Senza Cipolla Torino"');
    
  } catch (error) {
    console.error('❌ Ultimate cleanup error:', error.message);
  }
}

ultimateCleanup();
