// Debug script to check background image loading issue
// Run this in the browser console on http://localhost:3000

console.log('🔍 Debugging Chi Siamo Background Image Issue...');

// Check if About section exists
const aboutSection = document.querySelector('#about');
console.log('About section element:', aboutSection);

if (aboutSection) {
  const computedStyle = window.getComputedStyle(aboutSection);
  console.log('About section background-image:', computedStyle.backgroundImage);
  console.log('About section style attribute:', aboutSection.getAttribute('style'));
  console.log('About section classes:', aboutSection.className);
} else {
  console.log('❌ About section not found!');
}

// Check database content
async function checkDatabase() {
  try {
    console.log('📊 Checking database for chiSiamoContent...');
    
    // This would need to be run in the context where supabase is available
    if (typeof supabase !== 'undefined') {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value')
        .eq('key', 'chiSiamoContent')
        .single();
      
      if (error) {
        console.error('❌ Database error:', error);
        return;
      }
      
      console.log('📦 Database chiSiamoContent:', data.value);
      console.log('🖼️ Background image URL:', data.value?.backgroundImage);
      
      return data.value;
    } else {
      console.log('⚠️ Supabase not available in this context');
    }
  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
}

// Check React component state (if available)
function checkReactState() {
  console.log('⚛️ Checking React component state...');
  
  // Try to find React fiber node
  const aboutSection = document.querySelector('#about');
  if (aboutSection) {
    const reactFiber = aboutSection._reactInternalFiber || 
                      aboutSection._reactInternals ||
                      Object.keys(aboutSection).find(key => key.startsWith('__reactInternalInstance'));
    
    if (reactFiber) {
      console.log('Found React fiber:', reactFiber);
    } else {
      console.log('⚠️ Could not find React fiber');
    }
  }
}

// Force refresh test
function forceRefresh() {
  console.log('🔄 Forcing page refresh to check if background loads...');
  window.location.reload();
}

// Test background image URL directly
function testImageUrl(url) {
  console.log('🧪 Testing image URL:', url);
  
  const img = new Image();
  img.onload = () => {
    console.log('✅ Image loaded successfully');
  };
  img.onerror = () => {
    console.log('❌ Image failed to load');
  };
  img.src = url;
}

// Main debug function
async function debugBackgroundIssue() {
  console.log('🚀 Starting comprehensive background debug...');
  console.log('=====================================');
  
  // Check DOM
  console.log('\n1. 🔍 DOM Check:');
  const aboutSection = document.querySelector('#about');
  if (aboutSection) {
    console.log('✅ About section found');
    console.log('Background image:', window.getComputedStyle(aboutSection).backgroundImage);
    console.log('Style attribute:', aboutSection.getAttribute('style'));
  } else {
    console.log('❌ About section not found');
  }
  
  // Check database
  console.log('\n2. 📊 Database Check:');
  const dbContent = await checkDatabase();
  
  // Test image URL if available
  if (dbContent?.backgroundImage) {
    console.log('\n3. 🧪 Image URL Test:');
    testImageUrl(dbContent.backgroundImage);
  }
  
  // Check React state
  console.log('\n4. ⚛️ React State Check:');
  checkReactState();
  
  console.log('\n📋 Debug Summary:');
  console.log('=====================================');
  console.log('About section exists:', !!aboutSection);
  console.log('Database has background:', !!dbContent?.backgroundImage);
  console.log('Current background:', aboutSection ? window.getComputedStyle(aboutSection).backgroundImage : 'N/A');
  
  console.log('\n💡 Next Steps:');
  console.log('1. Check browser console for React component logs');
  console.log('2. Look for "🖼️ [About] Background image URL:" messages');
  console.log('3. Verify real-time listener is working');
  console.log('4. Try refreshing the page');
}

// Export functions for manual use
window.debugBackground = {
  debugBackgroundIssue,
  checkDatabase,
  testImageUrl,
  forceRefresh
};

console.log('🛠️ Background Debug Tools Loaded!');
console.log('📋 Available commands:');
console.log('   - window.debugBackground.debugBackgroundIssue()');
console.log('   - window.debugBackground.forceRefresh()');
console.log('');
console.log('🚀 Run: window.debugBackground.debugBackgroundIssue()');
