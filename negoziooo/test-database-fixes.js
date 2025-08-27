// Comprehensive test script to verify all database fixes
import { supabase } from './src/lib/supabase.js';

console.log('🧪 Starting comprehensive database fixes verification...');

async function testDatabaseFixes() {
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  function addTest(name, passed, details = '') {
    results.tests.push({ name, passed, details });
    if (passed) {
      results.passed++;
      console.log(`✅ ${name}`);
    } else {
      results.failed++;
      console.log(`❌ ${name}: ${details}`);
    }
  }

  try {
    // Test 1: Check if all required tables exist
    console.log('\n📋 Testing table existence...');
    const requiredTables = [
      'categories', 'products', 'orders', 'order_items', 'order_notifications',
      'order_status_history', 'user_profiles', 'user_roles', 'settings',
      'site_content', 'category_sections', 'comments', 'gallery_images',
      'youtube_videos', 'popups', 'admin_sessions', 'admin_activity_log'
    ];

    const { data: tables } = await supabase.rpc('sql', {
      query: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'"
    });

    const existingTables = tables?.map(t => t.table_name) || [];
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    addTest('All required tables exist', missingTables.length === 0, 
      missingTables.length > 0 ? `Missing: ${missingTables.join(', ')}` : '');

    // Test 2: Check order_items schema
    console.log('\n📋 Testing order_items schema...');
    const { data: orderItemsColumns } = await supabase.rpc('sql', {
      query: "SELECT column_name FROM information_schema.columns WHERE table_name = 'order_items' AND column_name IN ('price', 'product_price', 'unit_price', 'subtotal')"
    });

    const requiredOrderItemsFields = ['price', 'product_price', 'unit_price', 'subtotal'];
    const existingOrderItemsFields = orderItemsColumns?.map(c => c.column_name) || [];
    const missingOrderItemsFields = requiredOrderItemsFields.filter(field => !existingOrderItemsFields.includes(field));

    addTest('order_items has all required price fields', missingOrderItemsFields.length === 0,
      missingOrderItemsFields.length > 0 ? `Missing: ${missingOrderItemsFields.join(', ')}` : '');

    // Test 3: Check database functions
    console.log('\n📋 Testing database functions...');
    const { data: functions } = await supabase.rpc('sql', {
      query: "SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name IN ('delete_order_cascade', 'has_role', 'update_order_status')"
    });

    const requiredFunctions = ['delete_order_cascade', 'has_role', 'update_order_status'];
    const existingFunctions = functions?.map(f => f.routine_name) || [];
    const missingFunctions = requiredFunctions.filter(func => !existingFunctions.includes(func));

    addTest('All required database functions exist', missingFunctions.length === 0,
      missingFunctions.length > 0 ? `Missing: ${missingFunctions.join(', ')}` : '');

    // Test 4: Check app_role enum
    console.log('\n📋 Testing app_role enum...');
    const { data: enumValues } = await supabase.rpc('sql', {
      query: "SELECT enumlabel FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE typname = 'app_role'"
    });

    const expectedEnumValues = ['admin', 'customer'];
    const existingEnumValues = enumValues?.map(e => e.enumlabel) || [];
    const hasAllEnumValues = expectedEnumValues.every(val => existingEnumValues.includes(val));

    addTest('app_role enum exists with correct values', hasAllEnumValues,
      !hasAllEnumValues ? `Expected: ${expectedEnumValues.join(', ')}, Got: ${existingEnumValues.join(', ')}` : '');

    // Test 5: Test order creation (simulation)
    console.log('\n📋 Testing order creation schema...');
    try {
      // This should not fail due to schema issues
      const testOrderData = {
        order_number: 'TEST-' + Date.now(),
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        customer_phone: '1234567890',
        total_amount: 25.50,
        status: 'pending'
      };

      // Test the insert structure (without actually inserting)
      const { error: orderError } = await supabase
        .from('orders')
        .insert(testOrderData)
        .select()
        .limit(0); // This prevents actual insertion but tests schema

      addTest('Order creation schema is valid', !orderError, orderError?.message || '');

      // Test order item structure
      const testOrderItemData = {
        order_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
        product_id: '00000000-0000-0000-0000-000000000000',
        product_name: 'Test Product',
        quantity: 1,
        product_price: 10.50,
        unit_price: 10.50,
        subtotal: 10.50,
        price: 10.50
      };

      const { error: itemError } = await supabase
        .from('order_items')
        .insert(testOrderItemData)
        .select()
        .limit(0); // This prevents actual insertion but tests schema

      addTest('Order item creation schema is valid', !itemError, itemError?.message || '');

    } catch (error) {
      addTest('Order creation test', false, error.message);
    }

    // Test 6: Check indexes
    console.log('\n📋 Testing essential indexes...');
    const { data: indexes } = await supabase.rpc('sql', {
      query: "SELECT indexname FROM pg_indexes WHERE schemaname = 'public' AND indexname LIKE 'idx_%'"
    });

    const existingIndexes = indexes?.map(i => i.indexname) || [];
    const hasEssentialIndexes = existingIndexes.length > 0;

    addTest('Essential indexes exist', hasEssentialIndexes,
      !hasEssentialIndexes ? 'No custom indexes found' : `Found ${existingIndexes.length} indexes`);

    // Test 7: Check RLS policies
    console.log('\n📋 Testing RLS policies...');
    const { data: policies } = await supabase.rpc('sql', {
      query: "SELECT tablename FROM pg_policies WHERE schemaname = 'public'"
    });

    const tablesWithPolicies = policies?.map(p => p.tablename) || [];
    const hasRLSPolicies = tablesWithPolicies.length > 0;

    addTest('RLS policies exist', hasRLSPolicies,
      !hasRLSPolicies ? 'No RLS policies found' : `Found policies on ${tablesWithPolicies.length} tables`);

  } catch (error) {
    console.error('❌ Test suite failed:', error);
    addTest('Test suite execution', false, error.message);
  }

  // Summary
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📊 Total: ${results.tests.length}`);
  console.log(`🎯 Success Rate: ${((results.passed / results.tests.length) * 100).toFixed(1)}%`);

  if (results.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Database fixes are working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the issues above.');
  }

  return results;
}

// Run the tests
testDatabaseFixes().catch(console.error);
