// Deep debugging script for real-time issues
// Run this in BOTH browsers to compare what's happening

console.log('🔍 Deep Real-time Debugging Started...');

window.deepDebugRealtime = async function() {
  try {
    const { supabase } = await import('./src/integrations/supabase/client.js');
    
    console.log('='.repeat(50));
    console.log('🔍 DEEP REAL-TIME DEBUG ANALYSIS');
    console.log('='.repeat(50));
    
    // 1. Check Supabase connection
    console.log('1️⃣ SUPABASE CONNECTION:');
    console.log('   URL:', supabase.supabaseUrl);
    console.log('   Key:', supabase.supabaseKey ? 'Present' : 'Missing');
    console.log('   Realtime:', supabase.realtime ? 'Available' : 'Missing');
    
    // 2. Check authentication
    console.log('\n2️⃣ AUTHENTICATION:');
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    console.log('   Status:', session ? 'Authenticated' : 'Anonymous');
    console.log('   User ID:', session?.user?.id || 'None');
    console.log('   Auth Error:', authError || 'None');
    
    // 3. Check client identity
    console.log('\n3️⃣ CLIENT IDENTITY:');
    const clientId = localStorage.getItem('pizzeria_client_id');
    const storedIdentity = localStorage.getItem('pizzeria_client_identity');
    console.log('   Client ID:', clientId?.slice(-12) || 'None');
    console.log('   Stored Identity:', storedIdentity ? 'Present' : 'Missing');
    
    // 4. Check current orders
    console.log('\n4️⃣ CURRENT ORDERS:');
    
    if (session?.user?.id) {
      const { data: userOrders, error: userError } = await supabase
        .from('orders')
        .select('id, order_number, status, user_id, metadata, updated_at')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false });
      
      console.log('   User Orders:', userOrders?.length || 0);
      userOrders?.forEach((order, i) => {
        console.log(`   ${i+1}. ${order.order_number}: ${order.status} (updated: ${order.updated_at})`);
        console.log(`      User ID: ${order.user_id}`);
        console.log(`      Client ID: ${order.metadata?.clientId?.slice(-12) || 'None'}`);
      });
      
      if (userError) console.log('   User Orders Error:', userError);
    }
    
    if (clientId) {
      const { data: clientOrders, error: clientError } = await supabase
        .from('orders')
        .select('id, order_number, status, user_id, metadata, updated_at')
        .contains('metadata', { clientId })
        .order('updated_at', { ascending: false });
      
      console.log('   Client Orders:', clientOrders?.length || 0);
      clientOrders?.forEach((order, i) => {
        console.log(`   ${i+1}. ${order.order_number}: ${order.status} (updated: ${order.updated_at})`);
        console.log(`      User ID: ${order.user_id || 'None'}`);
        console.log(`      Client ID: ${order.metadata?.clientId?.slice(-12) || 'None'}`);
      });
      
      if (clientError) console.log('   Client Orders Error:', clientError);
    }
    
    // 5. Test real-time subscription
    console.log('\n5️⃣ REAL-TIME SUBSCRIPTION TEST:');
    console.log('   Setting up test subscription...');
    
    const testChannel = supabase
      .channel('deep-debug-test-' + Date.now())
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        console.log('\n🔔 REAL-TIME UPDATE RECEIVED:');
        console.log('   Order ID:', payload.new.id);
        console.log('   Order Number:', payload.new.order_number);
        console.log('   Status:', payload.new.status);
        console.log('   User ID:', payload.new.user_id || 'None');
        console.log('   Has Metadata:', !!payload.new.metadata);
        console.log('   Client ID:', payload.new.metadata?.clientId?.slice(-12) || 'None');
        console.log('   Updated At:', payload.new.updated_at);
        console.log('   Full Payload:', payload.new);
        
        // Check if this should match our filters
        const matchesUser = session?.user?.id && payload.new.user_id === session.user.id;
        const matchesClient = clientId && payload.new.metadata?.clientId === clientId;
        
        console.log('\n🎯 FILTER MATCHING:');
        console.log('   Matches User ID:', matchesUser);
        console.log('   Matches Client ID:', matchesClient);
        console.log('   Should Update UI:', matchesUser || matchesClient);
        
        if (matchesUser || matchesClient) {
          console.log('✅ THIS UPDATE SHOULD TRIGGER UI CHANGE');
        } else {
          console.log('❌ THIS UPDATE WILL BE IGNORED');
        }
      })
      .subscribe((status) => {
        console.log('   Subscription Status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time subscription active');
          console.log('💡 Now update an order status from admin panel');
        }
      });
    
    // 6. Check for existing subscriptions
    console.log('\n6️⃣ EXISTING SUBSCRIPTIONS:');
    const channels = supabase.getChannels();
    console.log('   Active Channels:', channels.length);
    channels.forEach((channel, i) => {
      console.log(`   ${i+1}. ${channel.topic} (${channel.state})`);
    });
    
    console.log('\n='.repeat(50));
    console.log('🔍 Debug analysis complete. Check console for real-time updates.');
    console.log('='.repeat(50));
    
    return testChannel;
    
  } catch (error) {
    console.error('❌ Deep debug error:', error);
  }
};

// Function to compare two browsers
window.compareBrowsers = function() {
  console.log('\n🔄 BROWSER COMPARISON:');
  console.log('Run this function in both browsers and compare results:');
  console.log('Browser:', navigator.userAgent.slice(0, 50) + '...');
  console.log('Client ID:', localStorage.getItem('pizzeria_client_id')?.slice(-12) || 'None');
  
  // Check if user is same across browsers
  const authToken = localStorage.getItem('sb-hnoadcbppldmawognwdx-auth-token');
  if (authToken) {
    try {
      const parsed = JSON.parse(authToken);
      console.log('User ID:', parsed?.user?.id || 'None');
      console.log('Session:', parsed?.access_token ? 'Valid' : 'Invalid');
    } catch (e) {
      console.log('Auth Token:', 'Invalid JSON');
    }
  } else {
    console.log('Auth Token:', 'Not found');
  }
};

// Auto-run basic check
setTimeout(() => {
  console.log('💡 Run deepDebugRealtime() for full analysis');
  console.log('💡 Run compareBrowsers() in both browsers to compare');
  window.compareBrowsers();
}, 1000);
