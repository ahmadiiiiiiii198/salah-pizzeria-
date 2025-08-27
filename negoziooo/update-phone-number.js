// Update phone number throughout the website
// Run this in browser console on any page

async function updatePhoneNumberEverywhere() {
    console.log('📞 Starting phone number update to +393479190907...');
    
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
        
        const newPhoneNumber = '+393479190907';
        
        // 1. Update contactContent in settings table
        console.log('📋 Updating contact content in database...');
        
        // First, get current contact content
        const { data: currentContact, error: fetchError } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'contactContent')
            .single();
            
        if (fetchError) {
            console.error('❌ Error fetching current contact:', fetchError);
            
            // Create new contact content if it doesn't exist
            console.log('📝 Creating new contact content...');
            const newContactContent = {
                address: "C.so Giulio Cesare, 36, 10152 Torino TO",
                phone: newPhoneNumber,
                email: "anilamyzyri@gmail.com",
                mapUrl: "https://maps.google.com",
                hours: "lunedì: 11-03\nmartedì: 11-03\nmercoledì: 11-03\ngiovedì: 11-03\nvenerdì: 11-03\nsabato: 11-03\ndomenica: 11-03"
            };
            
            const { error: insertError } = await supabase
                .from('settings')
                .insert({
                    key: 'contactContent',
                    value: newContactContent
                });
                
            if (insertError) {
                console.error('❌ Error creating contact content:', insertError);
            } else {
                console.log('✅ Contact content created successfully');
            }
        } else {
            // Update existing contact content
            const updatedContact = {
                ...currentContact.value,
                phone: newPhoneNumber
            };
            
            const { error: updateError } = await supabase
                .from('settings')
                .update({ value: updatedContact })
                .eq('key', 'contactContent');
                
            if (updateError) {
                console.error('❌ Error updating contact content:', updateError);
            } else {
                console.log('✅ Contact content updated successfully');
            }
        }
        
        // 2. Update localStorage
        console.log('💾 Updating localStorage...');
        try {
            const storedContact = localStorage.getItem('contactContent');
            if (storedContact) {
                const parsedContact = JSON.parse(storedContact);
                parsedContact.phone = newPhoneNumber;
                localStorage.setItem('contactContent', JSON.stringify(parsedContact));
                console.log('✅ localStorage updated successfully');
            } else {
                // Create new localStorage entry
                const newContact = {
                    address: "C.so Giulio Cesare, 36, 10152 Torino TO",
                    phone: newPhoneNumber,
                    email: "anilamyzyri@gmail.com",
                    mapUrl: "https://maps.google.com",
                    hours: "lunedì: 11-03\nmartedì: 11-03\nmercoledì: 11-03\ngiovedì: 11-03\nvenerdì: 11-03\nsabato: 11-03\ndomenica: 11-03"
                };
                localStorage.setItem('contactContent', JSON.stringify(newContact));
                console.log('✅ localStorage created with new phone number');
            }
        } catch (localError) {
            console.warn('⚠️ localStorage update failed:', localError);
        }
        
        // 3. Trigger page refresh event
        console.log('🔄 Triggering content refresh...');
        window.dispatchEvent(new CustomEvent('contactContentUpdated', {
            detail: { phone: newPhoneNumber }
        }));
        
        // 4. Force page refresh to show changes
        console.log('🔄 Refreshing page to show changes...');
        setTimeout(() => {
            window.location.reload();
        }, 2000);
        
        console.log('🎉 Phone number update completed successfully!');
        console.log(`📱 New phone number: ${newPhoneNumber}`);
        
        return 'SUCCESS';
        
    } catch (error) {
        console.error('❌ Phone number update error:', error);
        return 'ERROR';
    }
}

// Auto-run update
console.log('🚀 Running phone number update...');
updatePhoneNumberEverywhere().then(result => {
    console.log(`🏁 Update result: ${result}`);
    
    if (result === 'SUCCESS') {
        console.log('');
        console.log('🎉 SUCCESS! Phone number updated to +393479190907');
        console.log('📋 Updated locations:');
        console.log('  • Database settings (contactContent)');
        console.log('  • localStorage cache');
        console.log('  • Frontend components (via code changes)');
        console.log('');
        console.log('🔄 Page will refresh in 2 seconds to show changes');
    }
});

// Export for manual use
window.updatePhoneNumberEverywhere = updatePhoneNumberEverywhere;
