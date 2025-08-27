// Fix RLS policies for order_notifications table
// Run this in browser console on any page with Supabase access

async function fixNotificationRLS() {
    console.log('🔧 Starting RLS policy fix for order_notifications...');
    
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
        
        console.log('📡 Testing current notification access...');
        
        // Test current access
        const { data: testRead, error: readError } = await supabase
            .from('order_notifications')
            .select('count')
            .limit(1);
            
        if (readError) {
            console.error('❌ Read access blocked:', readError.message);
        } else {
            console.log('✅ Read access working');
        }
        
        // Test insert access
        console.log('🧪 Testing notification creation...');
        const { data: testInsert, error: insertError } = await supabase
            .from('order_notifications')
            .insert({
                order_id: null,
                notification_type: 'test',
                title: 'RLS Test',
                message: `RLS test notification - ${new Date().toISOString()}`,
                is_read: false,
                is_acknowledged: false
            })
            .select()
            .single();
            
        if (insertError) {
            console.error('❌ Insert access blocked:', insertError.message);
            console.error('❌ Error details:', insertError);
            
            if (insertError.message.includes('row-level security policy')) {
                console.log('🔧 RLS policies need to be fixed manually in Supabase dashboard');
                console.log('📋 Instructions:');
                console.log('1. Go to: https://supabase.com/dashboard/project/htdgoceqepvrffblfvns/auth/policies');
                console.log('2. Find the order_notifications table');
                console.log('3. Add these policies:');
                console.log('   - SELECT: Allow public access (USING: true)');
                console.log('   - INSERT: Allow public access (WITH CHECK: true)');
                console.log('   - UPDATE: Allow public access (USING: true, WITH CHECK: true)');
                console.log('   - DELETE: Allow public access (USING: true)');
                console.log('4. Enable real-time for order_notifications table');
                
                return false;
            }
        } else {
            console.log('✅ Insert access working - notification created:', testInsert.id);
            
            // Clean up test notification
            const { error: deleteError } = await supabase
                .from('order_notifications')
                .delete()
                .eq('id', testInsert.id);
                
            if (deleteError) {
                console.warn('⚠️ Could not clean up test notification:', deleteError.message);
            } else {
                console.log('🧹 Test notification cleaned up');
            }
        }
        
        // Test real-time subscription
        console.log('📡 Testing real-time subscription...');
        const subscription = supabase
            .channel('rls_test')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'order_notifications' },
                (payload) => {
                    console.log('📡 Real-time event received:', payload);
                }
            )
            .subscribe((status) => {
                console.log('📡 Subscription status:', status);
                if (status === 'SUBSCRIBED') {
                    console.log('✅ Real-time subscription working');
                } else if (status === 'CHANNEL_ERROR') {
                    console.error('❌ Real-time subscription failed');
                }
            });
            
        // Clean up subscription after 3 seconds
        setTimeout(() => {
            subscription.unsubscribe();
            console.log('🧹 Test subscription cleaned up');
        }, 3000);
        
        return true;
        
    } catch (error) {
        console.error('❌ RLS fix error:', error);
        return false;
    }
}

// Auto-run the fix
console.log('🚀 Running notification RLS fix...');
fixNotificationRLS().then(success => {
    if (success) {
        console.log('🎉 RLS fix completed successfully!');
    } else {
        console.log('❌ RLS fix requires manual intervention - see instructions above');
    }
});

// Export for manual use
window.fixNotificationRLS = fixNotificationRLS;
