// Debug script to test order tracking real-time updates
// Run this in browser console on the order tracking page

console.log('🔍 Starting Order Tracking Debug...');

// Check if user is authenticated
const checkAuth = () => {
  const user = JSON.parse(localStorage.getItem('sb-hnoadcbppldmawognwdx-auth-token') || '{}');
  console.log('👤 Auth User:', user?.user?.id);
  return user?.user?.id;
};

// Check orders in database
const checkOrders = async () => {
  const userId = checkAuth();
  if (!userId) {
    console.log('❌ No authenticated user found');
    return;
  }

  try {
    // Import supabase client
    const { supabase } = await import('./src/integrations/supabase/client.js');

    console.log('📋 Fetching orders for user:', userId);

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        customer_name,
        customer_email,
        status,
        order_status,
        user_id,
        created_at,
        updated_at
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching orders:', error);
      return;
    }

    console.log('📋 Found orders:', orders?.length || 0);
    orders?.forEach(order => {
      console.log(`📦 Order ${order.order_number}:`, {
        id: order.id,
        status: order.status,
        order_status: order.order_status,
        user_id: order.user_id,
        updated_at: order.updated_at
      });
    });

    return orders;
  } catch (error) {
    console.error('❌ Error in checkOrders:', error);
  }
};

// Test real-time subscription
const testRealTime = async () => {
  const userId = checkAuth();
  if (!userId) {
    console.log('❌ No authenticated user found');
    return;
  }

  try {
    const { supabase } = await import('./src/integrations/supabase/client.js');

    console.log('📡 Setting up real-time subscription for user:', userId);

    const channel = supabase
      .channel('debug-order-tracking')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        console.log('🔔 Real-time order update received:', payload);
        console.log('📦 Updated order data:', {
          id: payload.new.id,
          order_number: payload.new.order_number,
          status: payload.new.status,
          order_status: payload.new.order_status,
          user_id: payload.new.user_id,
          updated_at: payload.new.updated_at
        });
      })
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
      });

    console.log('✅ Real-time subscription active. Try updating an order status in admin panel...');

    // Return cleanup function
    return () => {
      console.log('🧹 Cleaning up subscription');
      channel.unsubscribe();
    };
  } catch (error) {
    console.error('❌ Error in testRealTime:', error);
  }
};

// Run debug
window.debugOrderTracking = {
  checkAuth,
  checkOrders,
  testRealTime
};

console.log('🎯 Debug functions available:');
console.log('- debugOrderTracking.checkAuth()');
console.log('- debugOrderTracking.checkOrders()');
console.log('- debugOrderTracking.testRealTime()');
console.log('');
console.log('💡 Run: debugOrderTracking.testRealTime() to start monitoring real-time updates');

// Quick debug function to check why order tracking is not showing
const quickDebug = () => {
  console.log('🔍 Quick Debug - Order Tracking Visibility');

  // Check authentication
  const authData = localStorage.getItem('sb-hnoadcbppldmawognwdx-auth-token');
  const isAuth = !!authData && authData !== 'null';
  console.log('👤 Authentication:', isAuth);

  // Check if OrderTrackingSection component exists
  const trackingSection = document.querySelector('[class*="OrderTracking"]') ||
                         document.querySelector('section[class*="bg-gradient-to-br"]');
  console.log('📱 OrderTrackingSection found:', !!trackingSection);

  // Check console for useUserOrders logs
  console.log('📋 Look for [USER-ORDERS] logs in console to see if orders are being loaded');
  console.log('🔍 Look for [OrderTracking] logs to see filtering logic');

  return {
    isAuthenticated: isAuth,
    componentFound: !!trackingSection,
    suggestion: !isAuth ? 'User not authenticated' :
                !trackingSection ? 'Component not rendered' :
                'Check console logs for order filtering'
  };
};

window.debugOrderTracking.quickDebug = quickDebug;
console.log('🎯 Added: debugOrderTracking.quickDebug() - Quick diagnosis');