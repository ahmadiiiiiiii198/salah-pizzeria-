// Debug script for notification system
// Run this in browser console on the admin page

async function debugNotificationSystem() {
    console.log('🔍 Starting notification system debug...');
    
    try {
        // Import Supabase if not already available
        let supabase;
        if (window.supabase) {
            supabase = window.supabase;
        } else {
            const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js@2');
            supabase = createClient(
                'https://htdgoceqepvrffblfvns.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8'
            );
        }
        
        console.log('📊 Current page:', window.location.href);
        
        // 1. Check if UnifiedNotificationSystem is mounted
        const notificationElements = document.querySelectorAll('[class*="UnifiedNotification"], [class*="notification"]');
        console.log('🔧 Notification elements found:', notificationElements.length);
        
        // 2. Check recent orders
        console.log('📋 Checking recent orders...');
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
            
        if (ordersError) {
            console.error('❌ Orders query error:', ordersError);
        } else {
            console.log(`📊 Found ${orders.length} recent orders:`);
            orders.forEach((order, index) => {
                console.log(`  ${index + 1}. Order ${order.order_number} - ${order.customer_name} - ${order.created_at}`);
            });
        }
        
        // 3. Check notifications for recent orders
        console.log('🔔 Checking notifications...');
        const { data: notifications, error: notificationsError } = await supabase
            .from('order_notifications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);
            
        if (notificationsError) {
            console.error('❌ Notifications query error:', notificationsError);
            console.error('❌ Error details:', notificationsError);
            
            if (notificationsError.message.includes('row-level security policy')) {
                console.log('🔧 RLS POLICY ISSUE DETECTED!');
                console.log('📋 The order_notifications table has RLS policies blocking access');
                console.log('📋 This is why notifications are not being created or read');
                console.log('📋 Fix needed: Update RLS policies to allow public access');
                return 'RLS_POLICY_ISSUE';
            }
        } else {
            console.log(`📊 Found ${notifications.length} notifications:`);
            notifications.forEach((notification, index) => {
                console.log(`  ${index + 1}. ${notification.title || 'No title'} - ${notification.message} - ${notification.created_at} - Read: ${notification.is_read}`);
            });
            
            const unreadCount = notifications.filter(n => !n.is_read).length;
            console.log(`📊 Unread notifications: ${unreadCount}`);
        }
        
        // 4. Test audio system
        console.log('🔊 Testing audio system...');
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
            
            console.log('✅ Audio system test successful');
        } catch (audioError) {
            console.error('❌ Audio system error:', audioError);
        }
        
        // 5. Check if notification was created for the latest order
        if (orders && orders.length > 0) {
            const latestOrder = orders[0];
            console.log(`🔍 Checking notifications for latest order: ${latestOrder.order_number}`);
            
            const { data: orderNotifications, error: orderNotifError } = await supabase
                .from('order_notifications')
                .select('*')
                .eq('order_id', latestOrder.id);
                
            if (orderNotifError) {
                console.error('❌ Order notifications query error:', orderNotifError);
            } else {
                console.log(`📊 Notifications for order ${latestOrder.order_number}: ${orderNotifications.length}`);
                if (orderNotifications.length === 0) {
                    console.log('⚠️ NO NOTIFICATION CREATED FOR LATEST ORDER!');
                    console.log('📋 This explains why no sound played');
                    console.log('📋 Issue: Order creation did not trigger notification creation');
                    return 'NO_NOTIFICATION_CREATED';
                }
            }
        }
        
        // 6. Test real-time subscription
        console.log('📡 Testing real-time subscription...');
        const subscription = supabase
            .channel('debug_test')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'order_notifications' },
                (payload) => {
                    console.log('📡 Real-time notification received:', payload);
                }
            )
            .subscribe((status) => {
                console.log('📡 Subscription status:', status);
            });
            
        // Clean up after 3 seconds
        setTimeout(() => {
            subscription.unsubscribe();
            console.log('🧹 Debug subscription cleaned up');
        }, 3000);
        
        console.log('🎉 Debug completed - check results above');
        return 'DEBUG_COMPLETED';
        
    } catch (error) {
        console.error('❌ Debug error:', error);
        return 'DEBUG_ERROR';
    }
}

// Auto-run debug
console.log('🚀 Running notification system debug...');
debugNotificationSystem().then(result => {
    console.log(`🏁 Debug result: ${result}`);
    
    if (result === 'RLS_POLICY_ISSUE') {
        console.log('');
        console.log('🔧 SOLUTION: Fix RLS policies');
        console.log('1. Go to Supabase dashboard');
        console.log('2. Navigate to Authentication > Policies');
        console.log('3. Add policies for order_notifications table');
        console.log('4. Allow public SELECT, INSERT, UPDATE, DELETE');
    } else if (result === 'NO_NOTIFICATION_CREATED') {
        console.log('');
        console.log('🔧 SOLUTION: Fix notification creation');
        console.log('1. Check order creation components');
        console.log('2. Ensure notification is inserted when order is created');
        console.log('3. Check for errors in order creation process');
    }
});

// Export for manual use
window.debugNotificationSystem = debugNotificationSystem;
