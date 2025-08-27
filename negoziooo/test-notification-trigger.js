// Test notification trigger
// Run this in browser console on the admin page to manually create a notification

async function testNotificationTrigger() {
    console.log('🧪 Testing notification trigger...');
    
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
        
        console.log('📡 Creating test notification...');
        
        const testNotification = {
            order_id: null, // Test notification without specific order
            notification_type: 'test',
            title: 'Test Notification!',
            message: `Manual test notification created at ${new Date().toLocaleTimeString()}`,
            is_read: false,
            is_acknowledged: false
        };
        
        const { data, error } = await supabase
            .from('order_notifications')
            .insert([testNotification])
            .select()
            .single();
            
        if (error) {
            console.error('❌ Failed to create test notification:', error);
            console.error('❌ Error details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            
            if (error.message.includes('row-level security policy')) {
                console.log('🔧 RLS POLICY ISSUE!');
                console.log('📋 The order_notifications table RLS policies are blocking insertion');
                console.log('📋 This is why notifications are not being created');
                console.log('📋 Solution: Fix RLS policies to allow public INSERT');
                return 'RLS_BLOCKED';
            }
            
            return 'ERROR';
        } else {
            console.log('✅ Test notification created successfully!');
            console.log('📊 Notification details:', data);
            console.log('🔊 If UnifiedNotificationSystem is working, you should hear a sound now');
            console.log('📡 Check console for real-time subscription messages');
            
            // Wait a moment then check if it was picked up
            setTimeout(async () => {
                console.log('🔍 Checking if notification was picked up...');
                
                const { data: checkData, error: checkError } = await supabase
                    .from('order_notifications')
                    .select('*')
                    .eq('id', data.id)
                    .single();
                    
                if (checkError) {
                    console.error('❌ Could not verify notification:', checkError);
                } else {
                    console.log('✅ Notification verified in database:', checkData);
                }
            }, 2000);
            
            return 'SUCCESS';
        }
        
    } catch (error) {
        console.error('❌ Test error:', error);
        return 'EXCEPTION';
    }
}

// Auto-run test
console.log('🚀 Running notification trigger test...');
testNotificationTrigger().then(result => {
    console.log(`🏁 Test result: ${result}`);
    
    if (result === 'RLS_BLOCKED') {
        console.log('');
        console.log('🔧 NEXT STEPS:');
        console.log('1. Fix RLS policies for order_notifications table');
        console.log('2. Allow public INSERT, SELECT, UPDATE, DELETE');
        console.log('3. Enable real-time for the table');
    } else if (result === 'SUCCESS') {
        console.log('');
        console.log('🎉 SUCCESS! Check if you heard a notification sound');
        console.log('📊 If no sound played, check UnifiedNotificationSystem logs');
    }
});

// Export for manual use
window.testNotificationTrigger = testNotificationTrigger;
