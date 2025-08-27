/**
 * Test Image Loading
 * Check if the current logo URL is accessible and loading properly
 */

const logoUrl = 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400';

console.log('🧪 Testing image loading...');
console.log('📸 Logo URL:', logoUrl);

// Test 1: Fetch the image
console.log('\n📡 Testing HTTP fetch...');
fetch(logoUrl)
  .then(response => {
    console.log('✅ HTTP Response Status:', response.status);
    console.log('✅ HTTP Response OK:', response.ok);
    console.log('✅ Content-Type:', response.headers.get('content-type'));
    console.log('✅ Content-Length:', response.headers.get('content-length'));
    return response.blob();
  })
  .then(blob => {
    console.log('✅ Image blob size:', blob.size, 'bytes');
    console.log('✅ Image blob type:', blob.type);
    
    // Test 2: Create image element
    console.log('\n🖼️ Testing image element loading...');
    const img = new Image();
    
    img.onload = function() {
      console.log('✅ Image loaded successfully!');
      console.log('✅ Image dimensions:', this.naturalWidth, 'x', this.naturalHeight);
      console.log('✅ Image complete:', this.complete);
      console.log('🎉 Image is working correctly!');
    };
    
    img.onerror = function(e) {
      console.error('❌ Image failed to load:', e);
      console.error('❌ Image src:', this.src);
    };
    
    img.src = logoUrl;
    
    // Test 3: Create object URL from blob
    const objectUrl = URL.createObjectURL(blob);
    console.log('✅ Object URL created:', objectUrl);
    
    const img2 = new Image();
    img2.onload = function() {
      console.log('✅ Object URL image loaded successfully!');
      URL.revokeObjectURL(objectUrl);
    };
    img2.onerror = function() {
      console.error('❌ Object URL image failed to load');
      URL.revokeObjectURL(objectUrl);
    };
    img2.src = objectUrl;
    
  })
  .catch(error => {
    console.error('❌ Fetch failed:', error);
    console.error('❌ This might be a CORS issue or network problem');
    
    // Test direct image loading anyway
    console.log('\n🖼️ Testing direct image loading...');
    const img = new Image();
    
    img.onload = function() {
      console.log('✅ Direct image loaded successfully!');
      console.log('✅ Image dimensions:', this.naturalWidth, 'x', this.naturalHeight);
    };
    
    img.onerror = function(e) {
      console.error('❌ Direct image failed to load:', e);
    };
    
    img.src = logoUrl;
  });

// Test 4: Check if running in browser
console.log('\n🌐 Environment check:');
console.log('✅ User Agent:', navigator.userAgent);
console.log('✅ Online:', navigator.onLine);
console.log('✅ Current URL:', window.location.href);
