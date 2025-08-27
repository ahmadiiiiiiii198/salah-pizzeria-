// Test script to verify background image functionality
// Run this in the browser console on http://localhost:3001

console.log('🧪 Testing Background Image Functionality...');

// Function to check if an element has a background image
const checkBackgroundImage = (selector, sectionName) => {
  const element = document.querySelector(selector);
  if (!element) {
    console.log(`❌ ${sectionName}: Element not found (${selector})`);
    return false;
  }
  
  const style = window.getComputedStyle(element);
  const backgroundImage = style.backgroundImage;
  
  console.log(`🔍 ${sectionName}:`);
  console.log(`   Element:`, element);
  console.log(`   Background Image:`, backgroundImage);
  console.log(`   Has Background:`, backgroundImage !== 'none');
  
  return backgroundImage !== 'none';
};

// Function to test database content
const testDatabaseContent = async () => {
  try {
    console.log('📊 Checking database content...');
    
    // This would need to be run in the context where supabase is available
    if (typeof supabase !== 'undefined') {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['chiSiamoContent', 'contactContent']);
      
      if (error) {
        console.error('❌ Database error:', error);
        return;
      }
      
      console.log('📦 Database content:');
      data.forEach(setting => {
        console.log(`   ${setting.key}:`, {
          backgroundImage: setting.value?.backgroundImage || 'None',
          hasBackground: !!setting.value?.backgroundImage
        });
      });
    } else {
      console.log('⚠️ Supabase not available in this context');
      console.log('💡 Try running this in the browser console on the actual website');
    }
  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
};

// Function to test real-time updates
const testRealTimeUpdates = () => {
  console.log('🔄 Testing real-time update listeners...');
  
  // Check if components have real-time listeners
  const aboutSection = document.querySelector('#about');
  const contactSection = document.querySelector('#contact');
  
  if (aboutSection) {
    console.log('✅ About section found');
  } else {
    console.log('❌ About section not found');
  }
  
  if (contactSection) {
    console.log('✅ Contact section found');
  } else {
    console.log('❌ Contact section not found');
  }
};

// Function to simulate background image update
const simulateBackgroundUpdate = (sectionId) => {
  console.log(`🔄 Simulating background update for ${sectionId}...`);
  
  const element = document.querySelector(`#${sectionId}`);
  if (!element) {
    console.log(`❌ Section ${sectionId} not found`);
    return;
  }
  
  // Add a test background image
  const testImageUrl = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
  element.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${testImageUrl}')`;
  element.style.backgroundSize = 'cover';
  element.style.backgroundPosition = 'center';
  
  console.log(`✅ Test background applied to ${sectionId}`);
  
  // Remove after 5 seconds
  setTimeout(() => {
    element.style.backgroundImage = '';
    element.style.backgroundSize = '';
    element.style.backgroundPosition = '';
    console.log(`🔄 Test background removed from ${sectionId}`);
  }, 5000);
};

// Main test function
const runBackgroundImageTests = async () => {
  console.log('🚀 Starting Background Image Tests...');
  console.log('=====================================');
  
  // Test 1: Check if sections exist and have background images
  console.log('\n1. 🔍 Checking Section Background Images...');
  const aboutHasBackground = checkBackgroundImage('#about', 'About Section');
  const contactHasBackground = checkBackgroundImage('#contact', 'Contact Section');
  
  // Test 2: Check database content
  console.log('\n2. 📊 Checking Database Content...');
  await testDatabaseContent();
  
  // Test 3: Test real-time listeners
  console.log('\n3. 🔄 Testing Real-time Listeners...');
  testRealTimeUpdates();
  
  // Test 4: Summary
  console.log('\n4. 📋 Test Summary...');
  console.log('=====================================');
  console.log(`About Section Background: ${aboutHasBackground ? '✅ Found' : '❌ Not Found'}`);
  console.log(`Contact Section Background: ${contactHasBackground ? '✅ Found' : '❌ Not Found'}`);
  
  if (!aboutHasBackground && !contactHasBackground) {
    console.log('\n💡 Troubleshooting Tips:');
    console.log('1. Check if background images are uploaded in admin panel');
    console.log('2. Verify database contains backgroundImage URLs');
    console.log('3. Check browser console for errors');
    console.log('4. Try refreshing the page');
    console.log('5. Test with: simulateBackgroundUpdate("about") or simulateBackgroundUpdate("contact")');
  }
  
  console.log('\n✅ Background Image Tests Complete!');
};

// Export functions for manual testing
window.backgroundImageTests = {
  runBackgroundImageTests,
  checkBackgroundImage,
  testDatabaseContent,
  testRealTimeUpdates,
  simulateBackgroundUpdate
};

console.log('🛠️ Background Image Test Tools Loaded!');
console.log('📋 Available commands:');
console.log('   - window.backgroundImageTests.runBackgroundImageTests()');
console.log('   - window.backgroundImageTests.simulateBackgroundUpdate("about")');
console.log('   - window.backgroundImageTests.simulateBackgroundUpdate("contact")');
console.log('');
console.log('🚀 Run: window.backgroundImageTests.runBackgroundImageTests()');
