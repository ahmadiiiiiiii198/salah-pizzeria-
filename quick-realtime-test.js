// Quick real-time test for authenticated user
// Copy and paste this into console after typing "allow pasting"

(async () => {
  console.log('🔧 Quick Real-time Test for Authenticated User');
  
  try {
    const { supabase } = await import('./src/integrations/supabase/client.js');
    
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    console.log('👤 User:', session?.user?.email);
    console.log('👤 User ID:', session?.user?.id);
    
    // Get user's orders
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, order_number, status, user_id, metadata')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (error) {
      console.error('❌ Error fetching orders:', error);
      return;
    }
    
    console.log(`📋 Found ${orders.length} orders:`);
    orders.forEach((order, i) => {
      console.log(`  ${i+1}. ${order.order_number}: ${order.status}`);
    });
    
    if (orders.length === 0) {
      console.log('❌ No orders found for this user');
      return;
    }
    
    // Set up real-time monitoring
    console.log('📡 Setting up real-time monitoring...');
    
    const channel = supabase
      .channel('user-realtime-test-' + Date.now())
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        const updatedOrder = payload.new;
        
        // Check if this order belongs to the current user
        if (updatedOrder.user_id === session.user.id) {
          console.log('🔔 REAL-TIME UPDATE FOR YOUR ORDER!');
          console.log('📦 Order:', updatedOrder.order_number);
          console.log('📦 Status:', updatedOrder.status);
          console.log('📦 Updated:', updatedOrder.updated_at);
          console.log('✅ CROSS-BROWSER REAL-TIME WORKING!');
          console.log('---');
        } else {
          console.log('⏭️ Real-time update for different user, ignoring');
        }
      })
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time monitoring active');
          console.log('💡 Now update one of your orders from admin panel');
          console.log('💡 Or run the admin simulation below...');
          
          // Auto-simulate admin update after 3 seconds
          setTimeout(async () => {
            console.log('🔄 Auto-simulating admin update...');
            
            const testOrder = orders[0];
            const statuses = ['confirmed', 'preparing', 'ready', 'arrived', 'delivered'];
            const currentIndex = statuses.indexOf(testOrder.status);
            const nextStatus = statuses[(currentIndex + 1) % statuses.length];
            
            console.log(`🔄 Updating ${testOrder.order_number} to "${nextStatus}"`);
            
            // Fetch existing order to preserve metadata
            const { data: existingOrder } = await supabase
              .from('orders')
              .select('metadata')
              .eq('id', testOrder.id)
              .single();
            
            // Update with preserved metadata
            const { error: updateError } = await supabase
              .from('orders')
              .update({
                status: nextStatus,
                order_status: nextStatus,
                updated_at: new Date().toISOString(),
                metadata: existingOrder?.metadata || {}
              })
              .eq('id', testOrder.id);
            
            if (updateError) {
              console.error('❌ Update error:', updateError);
            } else {
              console.log('✅ Order updated, waiting for real-time...');
            }
            
          }, 3000);
        }
      });
    
    console.log('⏳ Waiting for subscription to activate...');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
})();
