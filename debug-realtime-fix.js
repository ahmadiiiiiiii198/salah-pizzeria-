// Debug script to test real-time order tracking fix
// Run this in browser console to verify the fix works

console.log('🔧 Testing Real-time Order Tracking Fix...');

// Test function to verify metadata is preserved in updates
window.testRealtimeFix = async function() {
  try {
    // Import supabase client
    const { supabase } = await import('./src/integrations/supabase/client.js');
    
    console.log('📡 Setting up real-time subscription to monitor updates...');
    
    // Set up real-time listener to see what data is included in payloads
    const channel = supabase
      .channel('realtime-fix-test')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        console.log('🔔 Real-time update received:', payload);
        console.log('📦 Payload includes metadata:', !!payload.new.metadata);
        console.log('📦 ClientId in payload:', payload.new.metadata?.clientId);
        console.log('📦 Full payload.new:', payload.new);
      })
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
      });

    console.log('✅ Real-time listener set up. Now update an order status from admin panel to test.');
    console.log('💡 You should see metadata included in the real-time payload.');
    
    return channel;
  } catch (error) {
    console.error('❌ Error setting up test:', error);
  }
};

// Test function to check if clientId queries work efficiently
window.testClientIdQuery = async function(clientId) {
  if (!clientId) {
    console.log('❌ Please provide a clientId: testClientIdQuery("your_client_id")');
    return;
  }
  
  try {
    const { supabase } = await import('./src/integrations/supabase/client.js');
    
    console.log('🔍 Testing clientId query performance...');
    const startTime = performance.now();
    
    const { data, error } = await supabase
      .from('orders')
      .select('id, order_number, status, metadata')
      .contains('metadata', { clientId });
    
    const endTime = performance.now();
    
    if (error) {
      console.error('❌ Query error:', error);
      return;
    }
    
    console.log(`✅ Query completed in ${(endTime - startTime).toFixed(2)}ms`);
    console.log(`📋 Found ${data.length} orders for clientId: ${clientId}`);
    data.forEach(order => {
      console.log(`📦 Order ${order.order_number}: status=${order.status}, clientId=${order.metadata?.clientId}`);
    });
    
  } catch (error) {
    console.error('❌ Error testing query:', error);
  }
};

// Instructions
console.log('📋 Available test functions:');
console.log('  • testRealtimeFix() - Monitor real-time updates');
console.log('  • testClientIdQuery("clientId") - Test query performance');
console.log('');
console.log('💡 Run: testRealtimeFix()');
console.log('💡 Then update an order status from admin panel');
console.log('💡 You should see metadata preserved in real-time payload');
