import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SimpleAuthProps {
  onAuthenticated: () => void;
}

const SimpleAuth: React.FC<SimpleAuthProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simple password check (in production, use proper authentication)
      if (password === 'admin123' || password === 'pizzeria2024') {
        console.log('🔐 [SimpleAuth] Password correct, creating admin session...');

        // Use consistent localStorage key with useAdminAuth
        localStorage.setItem('adminAuthenticated', 'true');

        // Create proper Supabase session for cross-browser admin access
        try {
          const { supabase } = await import('@/lib/supabase');
          const { data: authData, error: authError } = await supabase.auth.signInAnonymously();

          if (authError) {
            console.warn('⚠️ [SimpleAuth] Failed to create Supabase session:', authError.message);
          } else {
            console.log('✅ [SimpleAuth] Supabase admin session created successfully');
          }
        } catch (sessionError) {
          console.warn('⚠️ [SimpleAuth] Error creating admin session:', sessionError);
        }

        onAuthenticated();
      } else {
        setError('Password non corretto');
      }
    } catch (error) {
      console.error('❌ [SimpleAuth] Authentication error:', error);
      setError('Errore durante l\'autenticazione');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pizza-red/10 to-pizza-orange/10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-pizza-dark">
            🍕 Admin Panel
          </CardTitle>
          <p className="text-gray-600">Inserisci la password per accedere</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-pizza-red hover:bg-pizza-red/90"
              disabled={isLoading}
            >
              {isLoading ? 'Accesso...' : 'Accedi'}
            </Button>
            
            <div className="text-xs text-gray-500 text-center mt-4">
              Password predefinite: admin123 o pizzeria2024
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleAuth;
