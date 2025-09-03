// Test script to check if user can see their own order updates
// This simulates the real user experience

console.log('👤 User Order Tracking Test Starting...');

window.testUserOrders = async function() {
  try {
    const { supabase } = await import('./src/integrations/supabase/client.js');
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    console.log('👤 Authentication status:', session ? 'Authenticated' : 'Anonymous');
    
    if (session) {
      console.log('👤 User ID:', session.user.id);
      console.log('👤 Email:', session.user.email);
    }
    
    // Check client identity
    const clientId = localStorage.getItem('pizzeria_client_id');
    console.log('🆔 Client ID:', clientId?.slice(-12) || 'None');
    
    // Get user's orders
    console.log('📋 Checking user orders...');
    
    let userOrders = [];
    
    if (session?.user?.id) {
      const { data, error } = await supabase
        .from('orders')
        .select('id, order_number, status, user_id, metadata, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching user orders:', error);
      } else {
        userOrders = data || [];
        console.log(`📋 Found ${userOrders.length} orders for authenticated user`);
      }
    }
    
    if (clientId) {
      const { data, error } = await supabase
        .from('orders')
        .select('id, order_number, status, user_id, metadata, created_at')
        .contains('metadata', { clientId })
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching client orders:', error);
      } else {
        const clientOrders = data || [];
        console.log(`📋 Found ${clientOrders.length} orders for client ID`);
        
        // Merge with user orders (avoid duplicates)
        clientOrders.forEach(order => {
          if (!userOrders.some(uo => uo.id === order.id)) {
            userOrders.push(order);
          }
        });
      }
    }
    
    if (userOrders.length === 0) {
      console.log('❌ No orders found for this user/client');
      console.log('💡 Place an order first, then run this test');
      return;
    }
    
    console.log(`📋 Total orders found: ${userOrders.length}`);
    userOrders.forEach((order, i) => {
      console.log(`  ${i+1}. ${order.order_number}: ${order.status} (${order.user_id ? 'auth' : 'anon'})`);
    });
    
    // Set up real-time monitoring for user's orders
    console.log('📡 Setting up real-time monitoring for user orders...');
    
    const channel = supabase
      .channel('user-orders-test-' + Date.now())
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        const updatedOrder = payload.new;
        
        // Check if this order belongs to the user
        const belongsToUser = session?.user?.id && updatedOrder.user_id === session.user.id;
        const belongsToClient = clientId && updatedOrder.metadata?.clientId === clientId;
        const isUserOrder = userOrders.some(order => order.id === updatedOrder.id);
        
        console.log('🔔 Real-time update received:');
        console.log('📦 Order:', updatedOrder.order_number);
        console.log('📦 Status:', updatedOrder.status);
        console.log('📦 User ID:', updatedOrder.user_id || 'None');
        console.log('📦 Client ID:', updatedOrder.metadata?.clientId?.slice(-12) || 'None');
        console.log('🎯 Filtering results:');
        console.log('   Belongs to user:', belongsToUser);
        console.log('   Belongs to client:', belongsToClient);
        console.log('   Is user order:', isUserOrder);
        
        if (belongsToUser || belongsToClient || isUserOrder) {
          console.log('✅ THIS ORDER UPDATE SHOULD BE VISIBLE TO USER!');
          console.log('🎉 Cross-browser order tracking working!');
        } else {
          console.log('⏭️ This order update is not for this user');
        }
        console.log('---');
      })
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time monitoring active for user orders');
          console.log('💡 Now update one of these orders from admin panel:');
          userOrders.forEach((order, i) => {
            console.log(`   ${i+1}. ${order.order_number} (${order.status})`);
          });
          console.log('💡 Or run testAdminUpdate() to simulate admin update');
        }
      });
    
    return { channel, userOrders };
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// Auto-run
console.log('💡 This test will:');
console.log('   1. Check user authentication and orders');
console.log('   2. Set up real-time monitoring');
console.log('   3. Show which updates should be visible');

setTimeout(() => {
  console.log('🚀 Auto-starting user test...');
  window.testUserOrders();
}, 1000);
