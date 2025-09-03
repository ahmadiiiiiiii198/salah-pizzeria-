// Test script to simulate admin order updates
// This will test real-time updates by actually updating orders in the database

console.log('🔧 Admin Update Test Starting...');

window.testAdminUpdate = async function() {
  try {
    const { supabase } = await import('./src/integrations/supabase/client.js');
    
    console.log('📋 Checking available orders...');
    
    // Get recent orders
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, order_number, status, user_id, metadata')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error('❌ Error fetching orders:', error);
      return;
    }
    
    if (!orders || orders.length === 0) {
      console.log('❌ No orders found to test with');
      return;
    }
    
    console.log(`📋 Found ${orders.length} orders:`);
    orders.forEach((order, i) => {
      console.log(`  ${i+1}. ${order.order_number}: ${order.status}`);
    });
    
    // Pick the first order to test with
    const testOrder = orders[0];
    console.log(`🎯 Testing with order: ${testOrder.order_number}`);
    
    // Set up real-time listener first
    console.log('📡 Setting up real-time listener...');
    const channel = supabase
      .channel('admin-test-' + Date.now())
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        if (payload.new.id === testOrder.id) {
          console.log('🔔 REAL-TIME UPDATE RECEIVED FOR TEST ORDER!');
          console.log('📦 Order:', payload.new.order_number);
          console.log('📦 Old Status:', testOrder.status);
          console.log('📦 New Status:', payload.new.status);
          console.log('📦 Has Metadata:', !!payload.new.metadata);
          console.log('📦 Client ID:', payload.new.metadata?.clientId?.slice(-12) || 'None');
          console.log('✅ CROSS-BROWSER REAL-TIME WORKING!');
          console.log('---');
        }
      })
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time subscription active');
          
          // Now simulate admin update
          setTimeout(() => {
            simulateAdminUpdate(testOrder);
          }, 2000);
        }
      });
    
    return channel;
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

async function simulateAdminUpdate(order) {
  try {
    const { supabase } = await import('./src/integrations/supabase/client.js');
    
    console.log('🔄 Simulating admin update...');
    
    // Cycle through statuses
    const statuses = ['confirmed', 'preparing', 'ready', 'arrived', 'delivered'];
    const currentIndex = statuses.indexOf(order.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    console.log(`🔄 Updating ${order.order_number} from "${order.status}" to "${nextStatus}"`);
    
    // First, fetch existing order to preserve metadata (like our fix)
    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('metadata')
      .eq('id', order.id)
      .single();
    
    if (fetchError) {
      console.error('❌ Error fetching existing order:', fetchError);
      return;
    }
    
    // Update with preserved metadata
    const updateData = {
      status: nextStatus,
      order_status: nextStatus,
      updated_at: new Date().toISOString(),
      // 🎯 CRITICAL: Preserve existing metadata
      metadata: existingOrder?.metadata || {}
    };
    
    console.log('🔄 Sending update with preserved metadata...');
    
    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', order.id);
    
    if (updateError) {
      console.error('❌ Error updating order:', updateError);
      return;
    }
    
    console.log('✅ Order updated successfully');
    console.log('⏳ Waiting for real-time update...');
    
  } catch (error) {
    console.error('❌ Error in admin update:', error);
  }
}

// Auto-run test
console.log('💡 Starting admin update test...');
console.log('💡 This will:');
console.log('   1. Find an existing order');
console.log('   2. Set up real-time listener');
console.log('   3. Simulate admin status update');
console.log('   4. Check if real-time update is received');

setTimeout(() => {
  console.log('🚀 Auto-starting admin test...');
  window.testAdminUpdate();
}, 2000);
