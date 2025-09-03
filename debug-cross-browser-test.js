// Debug script to test cross-browser real-time updates
// Run this in the browser console where you're viewing the order

console.log('🔧 Cross-Browser Real-time Test Starting...');

// Function to test which tracking system is being used
window.debugOrderTracking = async function() {
  try {
    const { supabase } = await import('./src/integrations/supabase/client.js');
    
    console.log('🔍 Checking current page and tracking system...');
    console.log('📍 Current URL:', window.location.href);
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    console.log('👤 Authentication status:', session ? 'authenticated' : 'anonymous');
    console.log('👤 User ID:', session?.user?.id);
    
    // Check client identity
    const clientId = localStorage.getItem('pizzeria_client_id');
    console.log('🆔 Client ID:', clientId?.slice(-12));
    
    // Check what orders are visible
    if (session?.user?.id) {
      console.log('📋 Checking USER orders...');
      const { data: userOrders, error } = await supabase
        .from('orders')
        .select('id, order_number, status, user_id, metadata')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching user orders:', error);
      } else {
        console.log(`📋 Found ${userOrders.length} user orders:`);
        userOrders.forEach(order => {
          console.log(`  📦 ${order.order_number}: status=${order.status}, user_id=${order.user_id}`);
        });
      }
    }
    
    if (clientId) {
      console.log('📋 Checking CLIENT orders...');
      const { data: clientOrders, error } = await supabase
        .from('orders')
        .select('id, order_number, status, user_id, metadata')
        .contains('metadata', { clientId })
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching client orders:', error);
      } else {
        console.log(`📋 Found ${clientOrders.length} client orders:`);
        clientOrders.forEach(order => {
          console.log(`  📦 ${order.order_number}: status=${order.status}, clientId=${order.metadata?.clientId?.slice(-12)}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error in debug:', error);
  }
};

// Function to set up comprehensive real-time monitoring
window.startCrossBrowserTest = async function() {
  try {
    const { supabase } = await import('./src/integrations/supabase/client.js');
    
    console.log('📡 Setting up comprehensive real-time monitoring...');
    
    // Monitor ALL order updates
    const allOrdersChannel = supabase
      .channel('debug-all-orders')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        console.log('🔔 [ALL-ORDERS] Real-time update received:');
        console.log('  📦 Order ID:', payload.new.id);
        console.log('  📦 Order Number:', payload.new.order_number);
        console.log('  📦 Status:', payload.new.status);
        console.log('  📦 User ID:', payload.new.user_id);
        console.log('  📦 Has Metadata:', !!payload.new.metadata);
        console.log('  📦 Client ID:', payload.new.metadata?.clientId?.slice(-12));
        console.log('  📦 Full payload:', payload.new);
        console.log('---');
      })
      .subscribe();
    
    // Check authentication and set up user-specific monitoring
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) {
      console.log('👤 Setting up USER-specific monitoring...');
      const userChannel = supabase
        .channel('debug-user-orders')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${session.user.id}`
        }, (payload) => {
          console.log('🔔 [USER-ORDERS] Real-time update for authenticated user:');
          console.log('  📦 Order Number:', payload.new.order_number);
          console.log('  📦 Status:', payload.new.status);
          console.log('  📦 This should trigger UI update for authenticated users');
        })
        .subscribe();
    }
    
    // Check client ID and set up client-specific monitoring
    const clientId = localStorage.getItem('pizzeria_client_id');
    if (clientId) {
      console.log('🆔 Setting up CLIENT-specific monitoring...');
      const clientChannel = supabase
        .channel('debug-client-orders')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders'
        }, (payload) => {
          if (payload.new.metadata?.clientId === clientId) {
            console.log('🔔 [CLIENT-ORDERS] Real-time update for our client:');
            console.log('  📦 Order Number:', payload.new.order_number);
            console.log('  📦 Status:', payload.new.status);
            console.log('  📦 This should trigger UI update for anonymous users');
          }
        })
        .subscribe();
    }
    
    console.log('✅ Cross-browser monitoring started');
    console.log('💡 Now update order status from admin panel in another browser');
    console.log('💡 Watch for real-time updates above');
    
  } catch (error) {
    console.error('❌ Error starting test:', error);
  }
};

// Instructions
console.log('📋 Available functions:');
console.log('  • debugOrderTracking() - Check current tracking system');
console.log('  • startCrossBrowserTest() - Monitor real-time updates');
console.log('');
console.log('💡 Run: debugOrderTracking()');
console.log('💡 Then: startCrossBrowserTest()');
console.log('💡 Then update order status from admin panel in another browser');
