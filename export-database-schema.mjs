import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  'https://yliofvqfyimlbxjmsuow.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaW9mdnFmeWltbGJ4am1zdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDQzNjEsImV4cCI6MjA3MTI4MDM2MX0.5s5cxf9YHHQJMHPHxFxxzdkb01J2XbZAExa5POxJ6QY'
);

console.log('🔍 Exporting Complete Database Schema and Data...\n');

async function exportDatabase() {
  const exportData = {
    projectInfo: {
      projectId: 'yliofvqfyimlbxjmsuow',
      url: 'https://yliofvqfyimlbxjmsuow.supabase.co',
      exportDate: new Date().toISOString()
    },
    tables: {},
    data: {},
    rlsPolicies: {},
    functions: {},
    triggers: {},
    indexes: {}
  };

  try {
    // Get all table names from the database types
    const tableNames = [
      'settings',
      'categories', 
      'products',
      'orders',
      'order_items',
      'comments',
      'user_profiles',
      'admin_sessions',
      'content_sections',
      'profiles'
    ];

    console.log('📊 Exporting table data and structure...\n');

    for (const tableName of tableNames) {
      console.log(`🔍 Processing table: ${tableName}`);
      
      try {
        // Get table data
        const { data, error } = await supabase
          .from(tableName)
          .select('*');

        if (error) {
          console.log(`   ❌ Error accessing ${tableName}: ${error.message}`);
          exportData.tables[tableName] = { error: error.message };
          continue;
        }

        console.log(`   ✅ Found ${data?.length || 0} records`);
        exportData.data[tableName] = data || [];

        // Get table structure by examining the first record
        if (data && data.length > 0) {
          const sampleRecord = data[0];
          const columns = {};
          
          Object.keys(sampleRecord).forEach(key => {
            const value = sampleRecord[key];
            let type = typeof value;
            
            if (value === null) {
              type = 'nullable';
            } else if (value instanceof Date) {
              type = 'timestamp';
            } else if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
              type = 'timestamp';
            } else if (typeof value === 'object') {
              type = 'json';
            } else if (typeof value === 'number' && Number.isInteger(value)) {
              type = 'integer';
            } else if (typeof value === 'number') {
              type = 'numeric';
            } else if (typeof value === 'boolean') {
              type = 'boolean';
            }
            
            columns[key] = {
              type: type,
              sampleValue: value
            };
          });
          
          exportData.tables[tableName] = {
            recordCount: data.length,
            columns: columns
          };
        } else {
          exportData.tables[tableName] = {
            recordCount: 0,
            columns: {}
          };
        }

      } catch (tableError) {
        console.log(`   ❌ Table ${tableName} not accessible: ${tableError.message}`);
        exportData.tables[tableName] = { error: tableError.message };
      }
    }

    // Try to get RLS policies (this might not work with anon key)
    console.log('\n🔒 Attempting to get RLS policies...');
    try {
      // This is a PostgreSQL system query that might not work with anon key
      const { data: policies, error: policiesError } = await supabase
        .rpc('get_policies'); // This function probably doesn't exist
      
      if (policiesError) {
        console.log('   ❌ Cannot access RLS policies with anon key');
        exportData.rlsPolicies = { error: 'Access denied with anon key' };
      } else {
        exportData.rlsPolicies = policies;
      }
    } catch (e) {
      console.log('   ❌ RLS policies not accessible');
      exportData.rlsPolicies = { error: 'Not accessible with current permissions' };
    }

    // Save to file
    const filename = `database-export-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(exportData, null, 2));
    
    console.log(`\n💾 Database export saved to: ${filename}`);
    
    // Generate SQL recreation script
    await generateSQLScript(exportData);
    
    // Generate detailed documentation
    await generateDocumentation(exportData);

  } catch (error) {
    console.log('❌ Export failed:', error.message);
  }
}

async function generateSQLScript(exportData) {
  console.log('\n📝 Generating SQL recreation script...');
  
  let sql = `-- Supabase Database Recreation Script
-- Generated on: ${new Date().toISOString()}
-- Original Project: yliofvqfyimlbxjmsuow

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

`;

  // Generate CREATE TABLE statements
  Object.entries(exportData.tables).forEach(([tableName, tableInfo]) => {
    if (tableInfo.error) return;
    
    sql += `-- Table: ${tableName}\n`;
    sql += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
    
    const columns = [];
    Object.entries(tableInfo.columns || {}).forEach(([colName, colInfo]) => {
      let sqlType = 'TEXT';
      
      switch (colInfo.type) {
        case 'integer':
          sqlType = 'INTEGER';
          break;
        case 'numeric':
          sqlType = 'NUMERIC';
          break;
        case 'boolean':
          sqlType = 'BOOLEAN';
          break;
        case 'timestamp':
          sqlType = 'TIMESTAMP WITH TIME ZONE';
          break;
        case 'json':
          sqlType = 'JSONB';
          break;
        default:
          sqlType = 'TEXT';
      }
      
      if (colName === 'id') {
        columns.push(`  ${colName} UUID PRIMARY KEY DEFAULT uuid_generate_v4()`);
      } else if (colName.includes('created_at')) {
        columns.push(`  ${colName} ${sqlType} DEFAULT NOW()`);
      } else if (colName.includes('updated_at')) {
        columns.push(`  ${colName} ${sqlType} DEFAULT NOW()`);
      } else {
        columns.push(`  ${colName} ${sqlType}`);
      }
    });
    
    sql += columns.join(',\n');
    sql += '\n);\n\n';
  });

  // Add RLS policies template
  sql += `-- Row Level Security Policies
-- Note: These are templates based on common patterns
-- You may need to adjust based on your specific requirements

`;

  Object.keys(exportData.tables).forEach(tableName => {
    if (exportData.tables[tableName].error) return;
    
    sql += `-- Enable RLS for ${tableName}
ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;

-- Public read access policy for ${tableName}
CREATE POLICY "Allow public read access to ${tableName}" ON ${tableName}
  FOR SELECT USING (true);

-- Authenticated users full access policy for ${tableName}
CREATE POLICY "Allow authenticated users full access to ${tableName}" ON ${tableName}
  FOR ALL USING (auth.role() = 'authenticated');

`;
  });

  const sqlFilename = `database-recreation-${Date.now()}.sql`;
  fs.writeFileSync(sqlFilename, sql);
  console.log(`   ✅ SQL script saved to: ${sqlFilename}`);
}

async function generateDocumentation(exportData) {
  console.log('\n📚 Generating detailed documentation...');
  
  let doc = `# Database Documentation
Generated on: ${new Date().toISOString()}
Original Project: yliofvqfyimlbxjmsuow

## Tables Overview

`;

  Object.entries(exportData.tables).forEach(([tableName, tableInfo]) => {
    if (tableInfo.error) {
      doc += `### ${tableName} ❌
Error: ${tableInfo.error}

`;
      return;
    }
    
    doc += `### ${tableName}
Records: ${tableInfo.recordCount}

| Column | Type | Sample Value |
|--------|------|--------------|
`;
    
    Object.entries(tableInfo.columns || {}).forEach(([colName, colInfo]) => {
      const sampleValue = typeof colInfo.sampleValue === 'object' 
        ? JSON.stringify(colInfo.sampleValue).substring(0, 50) + '...'
        : String(colInfo.sampleValue).substring(0, 50);
      
      doc += `| ${colName} | ${colInfo.type} | ${sampleValue} |\n`;
    });
    
    doc += '\n';
  });

  const docFilename = `database-documentation-${Date.now()}.md`;
  fs.writeFileSync(docFilename, doc);
  console.log(`   ✅ Documentation saved to: ${docFilename}`);
}

exportDatabase().then(() => {
  console.log('\n🏁 Database export completed!');
  console.log('\n📋 Files generated:');
  console.log('   • database-export-*.json - Complete data export');
  console.log('   • database-recreation-*.sql - SQL recreation script');
  console.log('   • database-documentation-*.md - Detailed documentation');
  process.exit(0);
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
