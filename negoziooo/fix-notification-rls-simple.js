// Simple RLS fix for notifications
// Run this in browser console on admin page

console.log('🔧 Fixing notification RLS policies...');

// Instructions for manual fix
console.log('📋 MANUAL FIX REQUIRED:');
console.log('1. Go to: https://supabase.com/dashboard/project/htdgoceqepvrffblfvns/auth/policies');
console.log('2. Find the "order_notifications" table');
console.log('3. Add these policies:');
console.log('');
console.log('   📝 SELECT Policy:');
console.log('   - Name: "Allow public read access to order_notifications"');
console.log('   - Policy: USING (true)');
console.log('   - Target roles: public');
console.log('');
console.log('   📝 INSERT Policy:');
console.log('   - Name: "Allow public insert access to order_notifications"');
console.log('   - Policy: WITH CHECK (true)');
console.log('   - Target roles: public');
console.log('');
console.log('   📝 UPDATE Policy:');
console.log('   - Name: "Allow public update access to order_notifications"');
console.log('   - Policy: USING (true) WITH CHECK (true)');
console.log('   - Target roles: public');
console.log('');
console.log('   📝 DELETE Policy:');
console.log('   - Name: "Allow public delete access to order_notifications"');
console.log('   - Policy: USING (true)');
console.log('   - Target roles: public');
console.log('');
console.log('4. Enable real-time for order_notifications table');
console.log('5. Test notification creation');

// Test function
async function testNotificationAfterFix() {
    console.log('🧪 Testing notification creation...');
    
    try {
        const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js@2');
        const supabase = createClient(
            'https://htdgoceqepvrffblfvns.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8'
        );
        
        const { data, error } = await supabase
            .from('order_notifications')
            .insert({
                order_id: null,
                notification_type: 'test',
                title: 'RLS Fix Test!',
                message: `Test notification after RLS fix - ${new Date().toLocaleTimeString()}`,
                is_read: false,
                is_acknowledged: false
            })
            .select()
            .single();
            
        if (error) {
            console.error('❌ Test failed:', error.message);
            if (error.message.includes('row-level security policy')) {
                console.log('🔧 RLS policies still need fixing - follow instructions above');
            }
            return false;
        } else {
            console.log('✅ Test successful! Notification created:', data.id);
            console.log('🔊 You should hear a notification sound if UnifiedNotificationSystem is working');
            return true;
        }
    } catch (error) {
        console.error('❌ Test error:', error);
        return false;
    }
}

// Export test function
window.testNotificationAfterFix = testNotificationAfterFix;

console.log('');
console.log('🧪 After fixing RLS policies, run: testNotificationAfterFix()');
console.log('📋 Or click the "➕ CREATE" button in the notification system UI');
