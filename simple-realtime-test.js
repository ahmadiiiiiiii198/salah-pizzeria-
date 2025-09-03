// Simple Real-time Test - Run in Browser Console
// Copy and paste this entire script into browser console

console.log('🔧 Simple Real-time Test Starting...');

// Test function
window.testRealtime = async function() {
  try {
    // Import Supabase client
    const { supabase } = await import('./src/integrations/supabase/client.js');

    console.log('📡 Setting up real-time subscription...');

    // Create subscription
    const channel = supabase
      .channel('simple-test-' + Date.now())
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        console.log('🔔 REAL-TIME UPDATE RECEIVED!');
        console.log('📦 Order:', payload.new.order_number);
        console.log('📦 Status:', payload.new.status);
        console.log('📦 Updated:', payload.new.updated_at);
        console.log('✅ REAL-TIME IS WORKING!');
        console.log('---');
      })
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time subscription active');
          console.log('💡 Now update an order status from admin panel');
        }
      });

    console.log('📡 Subscription created. Waiting for updates...');
    return channel;

  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// Auto-run
console.log('💡 Run: testRealtime()');
console.log('💡 Then update order status from admin panel');
console.log('💡 You should see real-time updates in console');

// Quick test
setTimeout(() => {
  console.log('🚀 Auto-starting test...');
  window.testRealtime();
}, 2000);