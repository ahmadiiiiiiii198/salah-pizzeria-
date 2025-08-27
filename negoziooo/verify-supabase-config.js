// Verify All Supabase Configurations
// This script checks that all files are using the correct Supabase database
import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// The CORRECT database configuration
const CORRECT_DB_URL = 'https://yliofvqfyimlbxjmsuow.supabase.co';
const CORRECT_DB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaW9mdnFmeWltbGJ4am1zdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDQzNjEsImV4cCI6MjA3MTI4MDM2MX0.5s5cxf9YHHQJMHPHxFxxzdkb01J2XbZAExa5POxJ6QY';
const CORRECT_PROJECT_ID = 'yliofvqfyimlbxjmsuow';

// OLD/WRONG database configurations to check for
const WRONG_DATABASES = [
  'htdgoceqepvrffblfvns',
  'ijhuoolcnxbdvpqmqofo',
  'yytnyqsfofivcxbsexvs',
  'despodpgvkszyexvcbft',
  'sixnfemtvmighstbgrbd'
];

const supabase = createClient(CORRECT_DB_URL, CORRECT_DB_KEY);

// Critical files to check
const CRITICAL_FILES = [
  'src/integrations/supabase/client.ts',
  'src/lib/supabase.ts',
  '.env',
  '.env.example',
  'supabase/config.toml',
  '.circleci/config.yml'
];

// Database scripts to check
const DB_SCRIPTS = [
  'setup-new-supabase.js',
  'test-new-supabase.js',
  'fix-database-schema.js',
  'quick-db-init.js',
  'setup-stripe.js',
  'save-api-key-correct-db.js',
  'add-efes-kebap-menu.js'
];

function scanDirectory(dir, results = []) {
  try {
    const files = readdirSync(dir);
    
    for (const file of files) {
      const fullPath = join(dir, file);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!['node_modules', '.git', '.next', 'dist', 'build'].includes(file)) {
          scanDirectory(fullPath, results);
        }
      } else if (file.match(/\.(js|ts|tsx|jsx|toml|yml|env)$/)) {
        results.push(fullPath);
      }
    }
  } catch (error) {
    // Skip directories we can't read
  }
  
  return results;
}

function checkFileForWrongDB(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Check for wrong database URLs
    for (const wrongDB of WRONG_DATABASES) {
      if (content.includes(wrongDB)) {
        issues.push(`Contains old database ID: ${wrongDB}`);
      }
    }
    
    // Check if it has correct database
    const hasCorrectDB = content.includes(CORRECT_PROJECT_ID);
    
    return { issues, hasCorrectDB };
  } catch (error) {
    return { issues: [`Error reading file: ${error.message}`], hasCorrectDB: false };
  }
}

async function verifySupabaseConfig() {
  console.log('🔍 SUPABASE CONFIGURATION VERIFICATION');
  console.log('=====================================');
  console.log(`✅ Correct Database: ${CORRECT_PROJECT_ID}`);
  console.log(`❌ Wrong Databases: ${WRONG_DATABASES.join(', ')}`);
  console.log('');

  // 1. Test database connection
  console.log('1. 🔌 Testing Database Connection...');
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Database connection failed:', error.message);
      return;
    } else {
      console.log('✅ Database connection successful!');
    }
  } catch (error) {
    console.log('❌ Database connection error:', error.message);
    return;
  }

  // 2. Check critical files
  console.log('\n2. 📁 Checking Critical Files...');
  let criticalIssues = 0;
  
  for (const file of CRITICAL_FILES) {
    if (readFileSync) {
      try {
        const { issues, hasCorrectDB } = checkFileForWrongDB(file);
        
        if (issues.length > 0) {
          console.log(`❌ ${file}:`);
          issues.forEach(issue => console.log(`   - ${issue}`));
          criticalIssues++;
        } else if (hasCorrectDB) {
          console.log(`✅ ${file}: Using correct database`);
        } else {
          console.log(`⚠️  ${file}: No database configuration found`);
        }
      } catch (error) {
        console.log(`⚠️  ${file}: File not found or unreadable`);
      }
    }
  }

  // 3. Check database scripts
  console.log('\n3. 🗄️ Checking Database Scripts...');
  let scriptIssues = 0;
  
  for (const script of DB_SCRIPTS) {
    try {
      const { issues, hasCorrectDB } = checkFileForWrongDB(script);
      
      if (issues.length > 0) {
        console.log(`❌ ${script}:`);
        issues.forEach(issue => console.log(`   - ${issue}`));
        scriptIssues++;
      } else if (hasCorrectDB) {
        console.log(`✅ ${script}: Using correct database`);
      } else {
        console.log(`⚠️  ${script}: No database configuration found`);
      }
    } catch (error) {
      console.log(`⚠️  ${script}: File not found`);
    }
  }

  // 4. Scan all files for any remaining issues
  console.log('\n4. 🔍 Scanning All Files...');
  const allFiles = scanDirectory('.');
  let totalIssues = 0;
  
  for (const file of allFiles) {
    const { issues } = checkFileForWrongDB(file);
    if (issues.length > 0) {
      totalIssues++;
    }
  }

  // 5. Summary
  console.log('\n📊 VERIFICATION SUMMARY');
  console.log('======================');
  console.log(`Critical Files Issues: ${criticalIssues}`);
  console.log(`Database Scripts Issues: ${scriptIssues}`);
  console.log(`Total Files with Issues: ${totalIssues}`);
  
  if (criticalIssues === 0 && scriptIssues === 0 && totalIssues === 0) {
    console.log('\n🎉 ALL CONFIGURATIONS CORRECT!');
    console.log('✅ All files are using the correct Supabase database');
    console.log('✅ No old database references found');
    console.log('✅ System is ready for production');
  } else {
    console.log('\n⚠️  ISSUES FOUND - Please fix the files listed above');
  }
}

// Run verification
verifySupabaseConfig().catch(console.error);
