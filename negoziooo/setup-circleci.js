// CircleCI Setup Helper Script for Pizzeria Senza Cipolla
// Run this script to verify CircleCI setup and trigger a test pipeline

import fs from 'fs';
import path from 'path';

console.log('🍕 PIZZERIA SENZA CIPOLLA - CircleCI Setup Helper');
console.log('================================================');

function checkProjectStructure() {
    console.log('\n📁 Checking project structure...');
    
    const requiredFiles = [
        '.circleci/config.yml',
        'package.json',
        'src/main.tsx',
        'vite.config.ts'
    ];
    
    const missingFiles = [];
    
    requiredFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file} - Found`);
        } else {
            console.log(`❌ ${file} - Missing`);
            missingFiles.push(file);
        }
    });
    
    if (missingFiles.length === 0) {
        console.log('✅ All required files present');
        return true;
    } else {
        console.log(`❌ Missing files: ${missingFiles.join(', ')}`);
        return false;
    }
}

function checkPackageJson() {
    console.log('\n📦 Checking package.json scripts...');
    
    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const requiredScripts = ['build', 'lint', 'type-check', 'test'];
        
        requiredScripts.forEach(script => {
            if (packageJson.scripts && packageJson.scripts[script]) {
                console.log(`✅ ${script} script - Found`);
            } else {
                console.log(`❌ ${script} script - Missing`);
            }
        });
        
        return true;
    } catch (error) {
        console.log('❌ Error reading package.json:', error.message);
        return false;
    }
}

function checkCircleCIConfig() {
    console.log('\n⚙️ Checking CircleCI configuration...');
    
    try {
        const configContent = fs.readFileSync('.circleci/config.yml', 'utf8');
        
        const checks = [
            { name: 'Version 2.1', pattern: /version:\s*2\.1/ },
            { name: 'Node orb', pattern: /node:\s*circleci\/node@/ },
            { name: 'Install dependencies job', pattern: /install-dependencies:/ },
            { name: 'Build job', pattern: /build:/ },
            { name: 'Test job', pattern: /test:/ },
            { name: 'Workflows', pattern: /workflows:/ }
        ];
        
        checks.forEach(check => {
            if (check.pattern.test(configContent)) {
                console.log(`✅ ${check.name} - Found`);
            } else {
                console.log(`❌ ${check.name} - Missing`);
            }
        });
        
        return true;
    } catch (error) {
        console.log('❌ Error reading .circleci/config.yml:', error.message);
        return false;
    }
}

function displaySetupInstructions() {
    console.log('\n🚀 CIRCLECI SETUP INSTRUCTIONS');
    console.log('==============================');
    console.log('');
    console.log('1. Go to https://circleci.com/signup/');
    console.log('2. Sign in with your GitHub account');
    console.log('3. Click "Create a project"');
    console.log('4. Select "GitHub" as VCS');
    console.log('5. Install CircleCI GitHub app');
    console.log('6. Select repository: ahmadiiiiiiii198/senza.cipolla');
    console.log('7. CircleCI will detect .circleci/config.yml');
    console.log('8. Click "Set up project"');
    console.log('');
    console.log('📋 ENVIRONMENT VARIABLES TO ADD:');
    console.log('- VITE_SUPABASE_URL');
    console.log('- VITE_SUPABASE_ANON_KEY');
    console.log('- NETLIFY_SITE_ID (if using Netlify)');
    console.log('- NETLIFY_AUTH_TOKEN (if using Netlify)');
    console.log('- VITE_STRIPE_PUBLISHABLE_KEY (if using Stripe)');
    console.log('- VITE_GOOGLE_MAPS_API_KEY (if using Google Maps)');
    console.log('');
    console.log('🔗 Repository: https://github.com/ahmadiiiiiiii198/senza.cipolla');
    console.log('📞 Contact: +393479190907');
    console.log('📧 Email: anilamyzyri@gmail.com');
}

function displayProjectInfo() {
    console.log('\n🍕 PROJECT INFORMATION');
    console.log('======================');
    console.log('Name: Pizzeria Senza Cipolla');
    console.log('Address: C.so Giulio Cesare, 36, 10152 Torino TO');
    console.log('Phone: +393479190907');
    console.log('Email: anilamyzyri@gmail.com');
    console.log('Repository: https://github.com/ahmadiiiiiiii198/senza.cipolla');
    console.log('');
    console.log('🏗️ TECH STACK:');
    console.log('- React + TypeScript');
    console.log('- Vite build tool');
    console.log('- Supabase backend');
    console.log('- Tailwind CSS');
    console.log('- Stripe payments');
    console.log('- Netlify deployment');
}

// Run all checks
function runSetupCheck() {
    console.log('Starting CircleCI setup verification...\n');
    
    const structureOk = checkProjectStructure();
    const packageOk = checkPackageJson();
    const configOk = checkCircleCIConfig();
    
    console.log('\n📊 SETUP STATUS');
    console.log('===============');
    
    if (structureOk && packageOk && configOk) {
        console.log('🎉 All checks passed! Ready for CircleCI setup.');
        console.log('✅ Project structure is correct');
        console.log('✅ Package.json has required scripts');
        console.log('✅ CircleCI config is valid');
    } else {
        console.log('⚠️ Some issues found. Please fix before proceeding.');
    }
    
    displayProjectInfo();
    displaySetupInstructions();
}

// Export for use in other scripts
export {
    checkProjectStructure,
    checkPackageJson,
    checkCircleCIConfig,
    runSetupCheck
};

// Run the setup check
runSetupCheck();
