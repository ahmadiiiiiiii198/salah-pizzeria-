// Debug script to test image loading issues
// Run this in the browser console on the frontend

console.log('🔍 Starting image loading debug...');

// Function to test image loading
const testImageLoad = (url, name) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      console.log(`✅ ${name} loaded successfully:`, url);
      resolve({ success: true, url, name });
    };
    img.onerror = () => {
      console.log(`❌ ${name} failed to load:`, url);
      resolve({ success: false, url, name });
    };
    img.src = url;
  });
};

// Function to check database content
const checkDatabaseContent = async () => {
  try {
    console.log('📊 Checking database content...');
    
    // This would need to be run in the context where supabase is available
    if (typeof supabase !== 'undefined') {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['chiSiamoImage', 'chiSiamoContent', 'contactContent']);
      
      if (error) {
        console.error('❌ Database error:', error);
        return;
      }
      
      console.log('📦 Database content:', data);
      
      // Test each image URL
      for (const setting of data) {
        if (setting.key === 'chiSiamoImage' && setting.value?.image) {
          await testImageLoad(setting.value.image, 'Chi Siamo Image');
        }
        if (setting.key === 'chiSiamoContent' && setting.value?.backgroundImage) {
          await testImageLoad(setting.value.backgroundImage, 'Chi Siamo Background');
        }
        if (setting.key === 'contactContent' && setting.value?.backgroundImage) {
          await testImageLoad(setting.value.backgroundImage, 'Contact Background');
        }
      }
    } else {
      console.log('⚠️ Supabase not available in this context');
    }
  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
};

// Function to force refresh components
const forceRefreshComponents = () => {
  console.log('🔄 Forcing component refresh...');
  
  // Dispatch custom events to trigger component updates
  window.dispatchEvent(new CustomEvent('forceImageRefresh', {
    detail: { timestamp: Date.now() }
  }));
  
  // Clear any cached images
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (img.src.includes('supabase.co')) {
      const originalSrc = img.src;
      img.src = '';
      setTimeout(() => {
        img.src = originalSrc + '?t=' + Date.now();
      }, 100);
    }
  });
  
  console.log('✅ Refresh triggered');
};

// Function to check current page images
const checkCurrentPageImages = () => {
  console.log('🖼️ Checking current page images...');
  
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    console.log(`Image ${index + 1}:`, {
      src: img.src,
      alt: img.alt,
      loaded: img.complete && img.naturalHeight !== 0,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    });
  });
};

// Function to check localStorage
const checkLocalStorage = () => {
  console.log('💾 Checking localStorage...');
  
  const keys = ['chiSiamoImage', 'chiSiamoContent', 'contactContent'];
  keys.forEach(key => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log(`📦 ${key}:`, parsed);
      } catch (e) {
        console.log(`📦 ${key} (raw):`, stored);
      }
    } else {
      console.log(`📦 ${key}: not found`);
    }
  });
};

// Main debug function
const runFullDebug = async () => {
  console.log('🚀 Running full debug...');
  
  checkCurrentPageImages();
  checkLocalStorage();
  await checkDatabaseContent();
  
  console.log('✅ Debug complete');
};

// Export functions for manual use
window.debugImageLoading = {
  testImageLoad,
  checkDatabaseContent,
  forceRefreshComponents,
  checkCurrentPageImages,
  checkLocalStorage,
  runFullDebug
};

console.log('🛠️ Debug tools loaded. Use window.debugImageLoading.runFullDebug() to start');
