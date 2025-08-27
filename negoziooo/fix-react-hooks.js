// React Hooks Dependency Fixer for Pizzeria Senza Cipolla
// This script helps identify and suggest fixes for React Hook dependency issues

import fs from 'fs';
import path from 'path';

console.log('🔧 REACT HOOKS DEPENDENCY FIXER');
console.log('================================');

// Common patterns that need fixing
const hookPatterns = [
  {
    name: 'useEffect with missing function dependency',
    pattern: /useEffect\(\(\) => \{\s*(\w+)\(\);?\s*\}, \[\]\);/g,
    fix: (match, functionName) => 
      `useEffect(() => {\n    ${functionName}();\n  }, [${functionName}]);`
  },
  {
    name: 'useCallback with missing dependency',
    pattern: /useCallback\([^,]+, \[\]\)/g,
    fix: (match) => {
      console.log('⚠️ Found useCallback with empty deps - manual review needed:', match);
      return match;
    }
  }
];

// Files to check (most problematic ones from the build log)
const filesToCheck = [
  'src/components/AddressValidator.tsx',
  'src/components/ContactSection.tsx',
  'src/components/OrderNotificationSystem.tsx',
  'src/components/PizzaCustomizationModal.tsx',
  'src/components/SoundManager.tsx',
  'src/components/admin/BusinessHoursManager.tsx',
  'src/components/admin/ContactInfoEditor.tsx'
];

function analyzeFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`\n📁 Analyzing: ${filePath}`);
    
    let issuesFound = 0;
    
    // Check for useEffect with empty dependencies calling functions
    const useEffectMatches = content.match(/useEffect\(\(\) => \{\s*\w+\(\);?\s*\}, \[\]\);?/g);
    if (useEffectMatches) {
      console.log(`  🔍 Found ${useEffectMatches.length} useEffect with empty deps calling functions`);
      useEffectMatches.forEach(match => {
        console.log(`    - ${match.trim()}`);
      });
      issuesFound += useEffectMatches.length;
    }
    
    // Check for useCallback with empty dependencies
    const useCallbackMatches = content.match(/useCallback\([^}]+\}, \[\]\)/g);
    if (useCallbackMatches) {
      console.log(`  🔍 Found ${useCallbackMatches.length} useCallback with empty deps`);
      issuesFound += useCallbackMatches.length;
    }
    
    // Check for missing useCallback import
    const hasUseCallback = content.includes('useCallback');
    const importsUseCallback = content.includes('useCallback') && 
      content.match(/import.*useCallback.*from ['"]react['"]/);
    
    if (hasUseCallback && !importsUseCallback) {
      console.log(`  ⚠️ Uses useCallback but doesn't import it`);
      issuesFound++;
    }
    
    if (issuesFound === 0) {
      console.log(`  ✅ No obvious hook dependency issues found`);
    }
    
    return issuesFound;
    
  } catch (error) {
    console.log(`❌ Error analyzing ${filePath}:`, error.message);
    return 0;
  }
}

function generateFixSuggestions() {
  console.log('\n💡 COMMON FIXES FOR REACT HOOK DEPENDENCIES');
  console.log('===========================================');
  
  console.log('\n1. 🔧 useEffect calling a function:');
  console.log('   ❌ Bad:');
  console.log('   useEffect(() => {');
  console.log('     loadData();');
  console.log('   }, []);');
  console.log('   ✅ Good:');
  console.log('   useEffect(() => {');
  console.log('     loadData();');
  console.log('   }, [loadData]);');
  
  console.log('\n2. 🔧 Function used in useEffect should be wrapped in useCallback:');
  console.log('   ❌ Bad:');
  console.log('   const loadData = async () => { /* ... */ };');
  console.log('   useEffect(() => { loadData(); }, [loadData]);');
  console.log('   ✅ Good:');
  console.log('   const loadData = useCallback(async () => { /* ... */ }, []);');
  console.log('   useEffect(() => { loadData(); }, [loadData]);');
  
  console.log('\n3. 🔧 State updates should use functional form:');
  console.log('   ❌ Bad:');
  console.log('   setData({ ...data, newField: value });');
  console.log('   ✅ Good:');
  console.log('   setData(prevData => ({ ...prevData, newField: value }));');
  
  console.log('\n4. 🔧 Add missing import:');
  console.log('   ❌ Bad:');
  console.log('   import React, { useState, useEffect } from "react";');
  console.log('   ✅ Good:');
  console.log('   import React, { useState, useEffect, useCallback } from "react";');
}

function runAnalysis() {
  console.log('Starting React Hooks dependency analysis...\n');
  
  let totalIssues = 0;
  let filesChecked = 0;
  
  filesToCheck.forEach(filePath => {
    const issues = analyzeFile(filePath);
    if (issues !== undefined) {
      totalIssues += issues;
      filesChecked++;
    }
  });
  
  console.log('\n📊 ANALYSIS SUMMARY');
  console.log('==================');
  console.log(`Files checked: ${filesChecked}`);
  console.log(`Total issues found: ${totalIssues}`);
  
  if (totalIssues > 0) {
    console.log('\n⚠️ Issues found that need manual review and fixing.');
    generateFixSuggestions();
  } else {
    console.log('\n🎉 No obvious React Hook dependency issues found!');
  }
  
  console.log('\n🍕 PIZZERIA SENZA CIPOLLA - BUILD OPTIMIZATION');
  console.log('==============================================');
  console.log('After fixing these issues, run:');
  console.log('1. npm run lint - to check for remaining issues');
  console.log('2. npm run type-check - to verify TypeScript');
  console.log('3. npm run build - to test production build');
  console.log('4. git commit and push - to trigger CircleCI');
}

// Export for use in other scripts
export { analyzeFile, generateFixSuggestions, runAnalysis };

// Run analysis
runAnalysis();
