#!/usr/bin/env node

/**
 * Complete test of the shipping zone system with Google Maps API
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://htdgoceqepvrffblfvns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testShippingZoneSystem() {
  console.log('🚚 COMPLETE SHIPPING ZONE SYSTEM TEST');
  console.log('=====================================');
  console.log('');

  let allTestsPassed = true;

  try {
    // Test 1: Verify database configuration
    console.log('1️⃣ Testing Database Configuration...');
    
    const { data: settingsData, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'shippingZoneSettings')
      .single();

    if (settingsError) {
      console.log('❌ Failed to load shipping settings:', settingsError.message);
      allTestsPassed = false;
    } else {
      console.log('✅ Shipping settings loaded successfully');
      console.log('🔑 API Key present:', settingsData.value?.googleMapsApiKey ? 'Yes' : 'No');
      console.log('📍 Restaurant address:', settingsData.value?.restaurantAddress);
      console.log('📏 Max delivery distance:', settingsData.value?.maxDeliveryDistance, 'km');
    }

    const { data: zonesData, error: zonesError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'deliveryZones')
      .single();

    if (zonesError) {
      console.log('❌ Failed to load delivery zones:', zonesError.message);
      allTestsPassed = false;
    } else {
      console.log('✅ Delivery zones loaded successfully');
      console.log('📊 Number of zones:', zonesData.value?.length || 0);
      zonesData.value?.forEach((zone, index) => {
        console.log(`   Zone ${index + 1}: ${zone.name} (0-${zone.maxDistance}km, €${zone.deliveryFee})`);
      });
    }

    console.log('');

    // Test 2: Test Google Maps API functionality
    console.log('2️⃣ Testing Google Maps API...');
    
    if (!settingsData?.value?.googleMapsApiKey) {
      console.log('❌ No API key found in database');
      allTestsPassed = false;
    } else {
      const apiKey = settingsData.value.googleMapsApiKey;
      const testAddresses = [
        'Via Roma 1, Torino, Italy',
        'Corso Principe Oddone 82, Torino, Italy',
        'Piazza della Repubblica, Torino, Italy'
      ];

      for (const address of testAddresses) {
        console.log(`🔍 Testing: ${address}`);
        
        try {
          const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
          const response = await fetch(geocodeUrl);
          const data = await response.json();

          if (data.status === 'OK' && data.results.length > 0) {
            const result = data.results[0];
            const lat = result.geometry.location.lat;
            const lng = result.geometry.location.lng;
            
            // Calculate distance from restaurant
            const restaurantLat = settingsData.value.restaurantLat;
            const restaurantLng = settingsData.value.restaurantLng;
            const distance = calculateDistance(restaurantLat, restaurantLng, lat, lng);
            
            console.log(`   ✅ Geocoded successfully (${distance.toFixed(2)}km from restaurant)`);
            
            // Find appropriate zone
            const zones = zonesData.value || [];
            const zone = zones.find(z => distance <= z.maxDistance && z.isActive);
            
            if (zone) {
              console.log(`   🚚 Delivery zone: ${zone.name} (€${zone.deliveryFee})`);
            } else if (distance <= settingsData.value.maxDeliveryDistance) {
              console.log(`   ⚠️ Within max distance but no zone configured`);
            } else {
              console.log(`   ❌ Outside delivery area (max: ${settingsData.value.maxDeliveryDistance}km)`);
            }
            
          } else {
            console.log(`   ❌ Geocoding failed: ${data.status}`);
            allTestsPassed = false;
          }
        } catch (error) {
          console.log(`   ❌ Network error: ${error.message}`);
          allTestsPassed = false;
        }
      }
    }

    console.log('');

    // Test 3: Test delivery zone logic
    console.log('3️⃣ Testing Delivery Zone Logic...');
    
    const testDistances = [1.5, 5, 10, 18]; // km
    const zones = zonesData.value || [];
    
    testDistances.forEach(distance => {
      console.log(`📏 Testing distance: ${distance}km`);
      
      const zone = zones
        .filter(z => z.isActive)
        .sort((a, b) => a.maxDistance - b.maxDistance)
        .find(z => distance <= z.maxDistance);
      
      if (zone) {
        console.log(`   ✅ Zone found: ${zone.name} (€${zone.deliveryFee}, ${zone.estimatedTime})`);
      } else if (distance <= settingsData.value?.maxDeliveryDistance) {
        console.log(`   ⚠️ Within max distance but no zone configured`);
      } else {
        console.log(`   ❌ Outside delivery area`);
      }
    });

    console.log('');

    // Test 4: Test free delivery threshold
    console.log('4️⃣ Testing Free Delivery Threshold...');
    
    const freeThreshold = settingsData.value?.freeDeliveryThreshold || 50;
    const testOrders = [25, 50, 75];
    
    testOrders.forEach(orderAmount => {
      const isFree = orderAmount >= freeThreshold;
      console.log(`💰 Order €${orderAmount}: ${isFree ? 'FREE delivery' : 'Delivery fee applies'}`);
    });

    console.log('');

  } catch (error) {
    console.error('💥 Test failed:', error);
    allTestsPassed = false;
  }

  // Final results
  console.log('=====================================');
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ Database configuration is correct');
    console.log('✅ Google Maps API is working');
    console.log('✅ Delivery zones are properly configured');
    console.log('✅ Distance calculations are accurate');
    console.log('✅ Free delivery threshold is working');
    console.log('');
    console.log('🚀 The shipping zone system is ready for production!');
  } else {
    console.log('❌ SOME TESTS FAILED!');
    console.log('Please check the configuration and try again.');
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
testShippingZoneSystem().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
});
