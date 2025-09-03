import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// This script will help you set up a new Supabase database with all your current data
console.log('🚀 Creating New Supabase Setup Package...\n');

async function createSetupPackage() {
  // Read the exported data
  const exportFiles = fs.readdirSync('.').filter(f => f.startsWith('database-export-') && f.endsWith('.json'));
  
  if (exportFiles.length === 0) {
    console.log('❌ No database export file found. Run export-database-schema.mjs first.');
    return;
  }
  
  const exportFile = exportFiles[0];
  const exportData = JSON.parse(fs.readFileSync(exportFile, 'utf8'));
  
  console.log(`📊 Using export file: ${exportFile}`);
  console.log(`📅 Export date: ${exportData.projectInfo.exportDate}`);
  
  // Generate data insertion script
  let insertScript = `-- Data Insertion Script for New Supabase Database
-- Generated from project: ${exportData.projectInfo.projectId}
-- Export date: ${exportData.projectInfo.exportDate}

-- IMPORTANT: Run this AFTER all migrations are complete

`;

  // Generate INSERT statements for each table
  Object.entries(exportData.data).forEach(([tableName, records]) => {
    if (!records || records.length === 0) {
      insertScript += `-- Table ${tableName}: No data to insert\n\n`;
      return;
    }
    
    insertScript += `-- Inserting data for table: ${tableName}\n`;
    insertScript += `-- Records: ${records.length}\n\n`;
    
    records.forEach((record, index) => {
      const columns = Object.keys(record);
      const values = columns.map(col => {
        const value = record[col];
        
        if (value === null) {
          return 'NULL';
        } else if (typeof value === 'string') {
          // Escape single quotes
          return `'${value.replace(/'/g, "''")}'`;
        } else if (typeof value === 'object') {
          return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
        } else if (typeof value === 'boolean') {
          return value ? 'true' : 'false';
        } else {
          return value;
        }
      });
      
      insertScript += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
      
      // Add batch separator every 50 records
      if ((index + 1) % 50 === 0) {
        insertScript += '\n-- Batch separator\n\n';
      }
    });
    
    insertScript += '\n';
  });
  
  fs.writeFileSync('data-insertion-script.sql', insertScript);
  console.log('✅ Data insertion script created: data-insertion-script.sql');
  
  // Create environment template
  const envTemplate = `# New Supabase Environment Variables
# Replace these with your new project credentials

# Get these from your new Supabase project dashboard:
# https://supabase.com/dashboard/project/YOUR_NEW_PROJECT_ID/settings/api

SUPABASE_URL=https://YOUR_NEW_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=YOUR_NEW_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_NEW_SERVICE_ROLE_KEY_HERE

# Original project for reference:
# ORIGINAL_URL=https://yliofvqfyimlbxjmsuow.supabase.co
# ORIGINAL_PROJECT_ID=yliofvqfyimlbxjmsuow
`;
  
  fs.writeFileSync('.env.new-supabase', envTemplate);
  console.log('✅ Environment template created: .env.new-supabase');
  
  // Create update script for code files
  const updateScript = `#!/usr/bin/env node

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
      /https:\/\/yliofvqfyimlbxjmsuow\.supabase\.co/g,
      NEW_URL
    );
    
    // Replace anon key
    content = content.replace(
      /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaW9mdnFmeWltbGJ4am1zdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDQzNjEsImV4cCI6MjA3MTI4MDM2MX0\.5s5cxf9YHHQJMHPHxFxxzdkb01J2XbZAExa5POxJ6QY/g,
      NEW_ANON_KEY
    );
    
    fs.writeFileSync(file, content);
    console.log(\`✅ Updated: \${file}\`);
  } else {
    console.log(\`⚠️  File not found: \${file}\`);
  }
});

console.log('🏁 Credential update completed!');
`;
  
  fs.writeFileSync('update-credentials.mjs', updateScript);
  console.log('✅ Credential update script created: update-credentials.mjs');
  
  // Create final setup checklist
  const checklist = `# 🚀 New Supabase Setup Checklist

## ✅ Pre-Setup
- [ ] Backup current database (if needed)
- [ ] Have all generated files ready
- [ ] Create new Supabase account/project

## ✅ Database Setup
- [ ] Create new Supabase project
- [ ] Note down new project credentials
- [ ] Run all migration files in order (see COMPLETE_SETUP_GUIDE.md)
- [ ] Verify all tables are created
- [ ] Run data-insertion-script.sql
- [ ] Verify data is imported correctly

## ✅ Code Update
- [ ] Update .env.new-supabase with your new credentials
- [ ] Run update-credentials.mjs script
- [ ] Test database connection
- [ ] Update any hardcoded URLs in your code

## ✅ Testing
- [ ] Run check-supabase.js to test connection
- [ ] Test admin panel login
- [ ] Test all major features
- [ ] Verify RLS policies work correctly

## ✅ Deployment
- [ ] Update production environment variables
- [ ] Deploy updated code
- [ ] Test production environment
- [ ] Update DNS/domain settings if needed

## 📁 Generated Files Summary

### Database Structure
- \`all-migrations-combined.sql\` - Complete migration history
- \`extracted-rls-policies.sql\` - All RLS policies
- \`database-recreation-*.sql\` - Basic table structure

### Data
- \`database-export-*.json\` - Complete data export
- \`data-insertion-script.sql\` - Data insertion script

### Setup Helpers
- \`COMPLETE_SETUP_GUIDE.md\` - Detailed setup guide
- \`.env.new-supabase\` - Environment template
- \`update-credentials.mjs\` - Credential update script
- \`database-documentation-*.md\` - Table documentation

## 🔑 Key Information

**Original Project**: yliofvqfyimlbxjmsuow
**Tables**: ${Object.keys(exportData.tables).length}
**Total Records**: ${Object.values(exportData.data).reduce((sum, records) => sum + (records?.length || 0), 0)}

**Important Tables**:
- settings (${exportData.data.settings?.length || 0} records) - All configuration
- categories (${exportData.data.categories?.length || 0} records) - Product categories
- products (${exportData.data.products?.length || 0} records) - All products
- content_sections (${exportData.data.content_sections?.length || 0} records) - Page content

## 🆘 Troubleshooting

If something goes wrong:
1. Check Supabase dashboard logs
2. Verify migration order
3. Check RLS policies
4. Test with provided scripts
5. Refer to COMPLETE_SETUP_GUIDE.md

## 📞 Support

- Supabase Documentation: https://supabase.com/docs
- Supabase Community: https://github.com/supabase/supabase/discussions
`;
  
  fs.writeFileSync('SETUP_CHECKLIST.md', checklist);
  console.log('✅ Setup checklist created: SETUP_CHECKLIST.md');
  
  console.log('\n🎯 Setup Package Complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📦 Package Contents:');
  console.log('   📄 SETUP_CHECKLIST.md - Step-by-step checklist');
  console.log('   📄 data-insertion-script.sql - Insert all your data');
  console.log('   📄 .env.new-supabase - Environment template');
  console.log('   📄 update-credentials.mjs - Update code credentials');
  console.log('   📄 COMPLETE_SETUP_GUIDE.md - Detailed guide');
  console.log('   📄 all-migrations-combined.sql - All migrations');
  console.log('   📄 extracted-rls-policies.sql - RLS policies');
  console.log('   📄 database-export-*.json - Complete data');
  console.log('\n🚀 Next Steps:');
  console.log('   1. Read SETUP_CHECKLIST.md');
  console.log('   2. Create new Supabase project');
  console.log('   3. Follow the checklist step by step');
}

createSetupPackage().then(() => {
  console.log('\n🏁 Setup package creation completed!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
