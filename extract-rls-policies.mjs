import fs from 'fs';
import path from 'path';

console.log('🔍 Extracting RLS Policies from Migration Files...\n');

async function extractRLSPolicies() {
  const migrationsDir = './supabase/migrations';
  const migrationFiles = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.sql'));
  
  let allPolicies = '';
  let allMigrations = '';
  
  console.log('📁 Found migration files:');
  migrationFiles.forEach(file => console.log(`   • ${file}`));
  
  console.log('\n🔍 Extracting RLS policies and table definitions...\n');
  
  migrationFiles.forEach(file => {
    const filePath = path.join(migrationsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`📄 Processing: ${file}`);
    
    // Extract RLS-related content
    const rlsLines = content.split('\n').filter(line => {
      const lowerLine = line.toLowerCase();
      return lowerLine.includes('row level security') ||
             lowerLine.includes('create policy') ||
             lowerLine.includes('drop policy') ||
             lowerLine.includes('alter table') && lowerLine.includes('enable') ||
             lowerLine.includes('grant') ||
             lowerLine.includes('revoke');
    });
    
    if (rlsLines.length > 0) {
      allPolicies += `-- From: ${file}\n`;
      allPolicies += rlsLines.join('\n') + '\n\n';
    }
    
    // Add full migration content
    allMigrations += `-- ============================================\n`;
    allMigrations += `-- Migration: ${file}\n`;
    allMigrations += `-- ============================================\n\n`;
    allMigrations += content + '\n\n';
  });
  
  // Save RLS policies
  fs.writeFileSync('extracted-rls-policies.sql', allPolicies);
  console.log('✅ RLS policies saved to: extracted-rls-policies.sql');
  
  // Save all migrations
  fs.writeFileSync('all-migrations-combined.sql', allMigrations);
  console.log('✅ All migrations saved to: all-migrations-combined.sql');
  
  // Generate setup guide
  const setupGuide = `# Complete Supabase Database Setup Guide

## 🎯 Overview
This guide will help you recreate the exact database structure from project \`yliofvqfyimlbxjmsuow\`.

## 📊 Database Statistics
- **Tables**: 9 main tables
- **Records**: 194 total records
- **Settings**: 46 configuration records
- **Categories**: 17 product categories  
- **Products**: 127 products
- **Content Sections**: 4 sections

## 🚀 Step-by-Step Setup

### 1. Create New Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Choose your organization
4. Set project name: "Pizzeria Regina 2000"
5. Set database password (save it!)
6. Choose region (preferably same as original)
7. Wait for project creation

### 2. Get Project Credentials
After project creation, get these from Settings > API:
- Project URL
- Anon public key
- Service role key (keep secret!)

### 3. Run Database Migrations
Execute the migrations in this exact order:

\`\`\`bash
# In your new Supabase project SQL editor, run these files in order:
\`\`\`

1. **20250115000000_create_settings_table.sql**
2. **20250115000000_create_category_sections.sql** 
3. **20250115000001_create_content_sections.sql**
4. **20250115120000_create_delete_order_function.sql**
5. **20250115121000_fix_order_deletion_policies.sql**
6. **20250115130000_add_payment_fields.sql**
7. **20250116000000_add_performance_indexes.sql**
8. **20250117000000_create_user_profiles_table.sql**
9. **20250117000001_enhance_admin_authentication.sql**
10. **20250514151200_add_settings_rls_policy.sql**
11. **20250627000000_create_storage_buckets.sql**
12. **20250825000000_remove_file_size_limits.sql**
13. **20250828000000_add_content_sections_columns.sql**
14. **20250828000000_add_missing_content_sections_columns.sql**
15. **20250828000001_fix_content_sections_rls.sql**
16. **20250828000002_fix_settings_rls.sql**

### 4. Import Data
Use the generated \`database-export-*.json\` file to import your data.

### 5. Update Your Application
Update these files with your new Supabase credentials:

#### \`src/lib/supabase.ts\`
\`\`\`typescript
const SUPABASE_URL = 'YOUR_NEW_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_NEW_ANON_KEY';
\`\`\`

#### \`src/integrations/supabase/client.ts\`
\`\`\`typescript
const SUPABASE_URL = "YOUR_NEW_PROJECT_URL";
const SUPABASE_PUBLISHABLE_KEY = "YOUR_NEW_ANON_KEY";
\`\`\`

### 6. Test Connection
Run this test script to verify everything works:

\`\`\`bash
node check-supabase.js
\`\`\`

## 🔒 Important RLS Policies

The database uses Row Level Security with these key policies:
- **Public read access** for most content tables
- **Authenticated user access** for user-specific data
- **Admin-only access** for sensitive operations

## 📁 Files Generated

1. **database-export-*.json** - Complete data export
2. **database-recreation-*.sql** - Basic table structure
3. **all-migrations-combined.sql** - Complete migration history
4. **extracted-rls-policies.sql** - All RLS policies
5. **database-documentation-*.md** - Detailed documentation

## ⚠️ Important Notes

1. **Backup First**: Always backup your current database before making changes
2. **Test Environment**: Set up in a test environment first
3. **Environment Variables**: Update all environment variables
4. **Storage Buckets**: Recreate storage buckets if you use file uploads
5. **Functions**: Deploy any Edge Functions you're using

## 🆘 Troubleshooting

If you encounter issues:
1. Check the Supabase logs in your dashboard
2. Verify RLS policies are correctly applied
3. Ensure all migrations ran successfully
4. Test with the provided scripts

## 📞 Support

If you need help:
- Check Supabase documentation
- Use the generated test scripts
- Contact Supabase support with your project details
`;

  fs.writeFileSync('COMPLETE_SETUP_GUIDE.md', setupGuide);
  console.log('✅ Complete setup guide saved to: COMPLETE_SETUP_GUIDE.md');
  
  console.log('\n🎯 Summary of Generated Files:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📄 extracted-rls-policies.sql - All RLS policies');
  console.log('📄 all-migrations-combined.sql - Complete migration history');
  console.log('📄 COMPLETE_SETUP_GUIDE.md - Step-by-step setup guide');
  console.log('📄 database-export-*.json - Complete data export');
  console.log('📄 database-recreation-*.sql - Basic table structure');
  console.log('📄 database-documentation-*.md - Detailed documentation');
}

extractRLSPolicies().then(() => {
  console.log('\n🏁 RLS extraction completed!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
