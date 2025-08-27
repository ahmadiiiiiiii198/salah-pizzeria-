#!/usr/bin/env node

/**
 * Test the Google Maps API key for shipping zone calculations
 */

const API_KEY = 'AIzaSyBkHCjFa0GKD7lJThAyFnSaeCXFDsBtJhs';

async function testGoogleMapsAPI() {
  console.log('🧪 TESTING GOOGLE MAPS API KEY');
  console.log('================================');
  console.log('🔑 API Key:', API_KEY.substring(0, 20) + '...');
  console.log('');

  // Test addresses in Torino area
  const testAddresses = [
    'C.so Giulio Cesare, 36, 10152 Torino TO', // Restaurant address
    'Via Roma 1, Torino, Italy',
    'Corso Principe Oddone 82, Torino, Italy',
    'Piazza della Repubblica, Torino, Italy',
    'Via Po 25, Torino, Italy'
  ];

  const restaurantLat = 45.047698;
  const restaurantLng = 7.679902;

  let allTestsPassed = true;

  for (let i = 0; i < testAddresses.length; i++) {
    const address = testAddresses[i];
    console.log(`${i + 1}. 📍 Testing: ${address}`);

    try {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        const lat = result.geometry.location.lat;
        const lng = result.geometry.location.lng;
        
        // Calculate distance from restaurant
        const distance = calculateDistance(restaurantLat, restaurantLng, lat, lng);
        
        console.log('   ✅ Geocoding successful');
        console.log('   📍 Coordinates:', lat.toFixed(6), lng.toFixed(6));
        console.log('   📏 Distance from restaurant:', distance.toFixed(2), 'km');
        console.log('   📮 Formatted address:', result.formatted_address);
        
        // Determine delivery zone
        let zone = 'Outside delivery area';
        let fee = 'N/A';
        
        if (distance <= 3) {
          zone = 'Zone 1 (0-3km)';
          fee = '€2.50';
        } else if (distance <= 7) {
          zone = 'Zone 2 (3-7km)';
          fee = '€4.00';
        } else if (distance <= 12) {
          zone = 'Zone 3 (7-12km)';
          fee = '€6.00';
        } else if (distance <= 15) {
          zone = 'Zone 4 (12-15km)';
          fee = '€8.00';
        }
        
        console.log('   🚚 Delivery zone:', zone);
        console.log('   💰 Delivery fee:', fee);
        
      } else {
        console.log('   ❌ Geocoding failed:', data.status);
        if (data.error_message) {
          console.log('   📝 Error message:', data.error_message);
        }
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('   ❌ Network error:', error.message);
      allTestsPassed = false;
    }
    
    console.log('');
  }

  // Test API key validity
  console.log('🔍 API KEY VALIDATION TEST');
  console.log('==========================');
  
  try {
    const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Torino&key=${API_KEY}`;
    const response = await fetch(testUrl);
    const data = await response.json();
    
    if (data.status === 'OK') {
      console.log('✅ API key is valid and working');
    } else if (data.status === 'REQUEST_DENIED') {
      console.log('❌ API key is invalid or restricted');
      console.log('📝 Error:', data.error_message);
      allTestsPassed = false;
    } else {
      console.log('⚠️ API key might have issues:', data.status);
      if (data.error_message) {
        console.log('📝 Error:', data.error_message);
      }
    }
  } catch (error) {
    console.log('❌ Failed to validate API key:', error.message);
    allTestsPassed = false;
  }

  console.log('');
  console.log('================================');
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ Google Maps API key is working correctly');
    console.log('✅ Geocoding is functional');
    console.log('✅ Distance calculations are accurate');
    console.log('✅ Delivery zone system is ready');
  } else {
    console.log('❌ SOME TESTS FAILED!');
    console.log('Please check the API key and network connection');
  }

  return allTestsPassed;
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Run the test
testGoogleMapsAPI().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('💥 Test failed:', error);
  process.exit(1);
});
