import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, Loader2, User, Database, Key } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserInfo {
  step: string;
  status: 'success' | 'error' | 'info' | 'warning';
  message: string;
  data?: any;
}

const SupabaseUserChecker: React.FC = () => {
  const [results, setResults] = useState<UserInfo[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const addResult = (step: string, status: 'success' | 'error' | 'info' | 'warning', message: string, data?: any) => {
    setResults(prev => [...prev, { step, status, message, data }]);
  };

  const checkSupabaseUser = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      addResult('Start', 'info', 'Checking Supabase authentication and user information...');

      // Step 1: Check current session
      addResult('Session Check', 'info', 'Checking current Supabase session...');
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        addResult('Session Check', 'error', `Session error: ${sessionError.message}`);
      } else if (sessionData.session) {
        const user = sessionData.session.user;
        addResult('Session Check', 'success', 'Active Supabase session found!');
        addResult('User Info', 'success', `Email: ${user.email || 'N/A'}`);
        addResult('User Info', 'info', `User ID: ${user.id}`);
        addResult('User Info', 'info', `Created: ${new Date(user.created_at).toLocaleString()}`);
        addResult('User Info', 'info', `Last Sign In: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}`);
        
        if (user.user_metadata) {
          addResult('User Metadata', 'info', `Metadata: ${JSON.stringify(user.user_metadata, null, 2)}`);
        }
      } else {
        addResult('Session Check', 'warning', 'No active Supabase session found');
      }

      // Step 2: Check current user
      addResult('User Check', 'info', 'Getting current user...');
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        addResult('User Check', 'error', `User error: ${userError.message}`);
      } else if (userData.user) {
        addResult('User Check', 'success', 'Current user retrieved successfully');
        addResult('Current User', 'info', `Email: ${userData.user.email || 'N/A'}`);
      } else {
        addResult('User Check', 'warning', 'No current user found');
      }

      // Step 3: Check project configuration
      addResult('Project Info', 'info', 'Checking project configuration...');
      
      const projectUrl = 'https://hnoadcbppldmawognwdx.supabase.co';
      const projectRef = 'hnoadcbppldmawognwdx';
      
      addResult('Project Info', 'success', `Project URL: ${projectUrl}`);
      addResult('Project Info', 'success', `Project Reference: ${projectRef}`);
      addResult('Dashboard Link', 'info', `Dashboard: https://supabase.com/dashboard/project/${projectRef}`);

      // Step 4: Try to get database metadata
      addResult('Database Info', 'info', 'Checking database access...');
      
      try {
        // Try to access a system table to get database info
        const { data: dbData, error: dbError } = await supabase
          .from('settings')
          .select('key')
          .limit(1);

        if (dbError) {
          addResult('Database Info', 'error', `Database access error: ${dbError.message}`);
        } else {
          addResult('Database Info', 'success', 'Database is accessible');
        }
      } catch (error) {
        addResult('Database Info', 'error', `Database check failed: ${error.message}`);
      }

      // Step 5: Check for admin credentials in database
      addResult('Admin Credentials', 'info', 'Checking stored admin credentials...');
      
      try {
        const { data: adminData, error: adminError } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'adminCredentials')
          .single();

        if (adminError) {
          addResult('Admin Credentials', 'warning', 'No admin credentials found in database');
        } else if (adminData) {
          const credentials = adminData.value;
          addResult('Admin Credentials', 'success', 'Admin credentials found in database');
          addResult('Admin Info', 'info', `Admin Username: ${credentials.username || 'N/A'}`);
          addResult('Admin Info', 'info', 'Admin Password: [HIDDEN FOR SECURITY]');
        }
      } catch (error) {
        addResult('Admin Credentials', 'error', `Admin credentials check failed: ${error.message}`);
      }

      // Step 6: Check localStorage for admin auth
      addResult('Local Storage', 'info', 'Checking localStorage for admin authentication...');
      
      const adminAuth = localStorage.getItem('adminAuthenticated');
      const adminCreds = localStorage.getItem('adminCredentials');
      
      if (adminAuth === 'true') {
        addResult('Local Storage', 'success', 'Admin is authenticated in localStorage');
      } else {
        addResult('Local Storage', 'warning', 'Admin not authenticated in localStorage');
      }
      
      if (adminCreds) {
        try {
          const parsedCreds = JSON.parse(adminCreds);
          addResult('Local Credentials', 'info', `Cached admin username: ${parsedCreds.username || 'N/A'}`);
        } catch (e) {
          addResult('Local Credentials', 'error', 'Invalid admin credentials in localStorage');
        }
      }

      // Step 7: Provide access instructions
      addResult('Access Instructions', 'info', 'How to access Supabase Dashboard:');
      addResult('Method 1', 'info', '1. Go to https://supabase.com/dashboard');
      addResult('Method 2', 'info', '2. Log in with the account that created this project');
      addResult('Method 3', 'info', '3. Look for project reference: hnoadcbppldmawognwdx');
      addResult('Direct Link', 'info', `4. Or go directly to: https://supabase.com/dashboard/project/${projectRef}`);

      // Step 8: Check if we can determine the project owner
      addResult('Project Owner', 'info', 'Attempting to determine project owner...');

      // The project URL and reference suggest this is a specific Supabase project
      // We can't directly get the owner info, but we can provide guidance
      addResult('Owner Info', 'warning', 'Project owner information is not accessible from client-side');
      addResult('Owner Hint', 'info', 'The project owner is whoever created the Supabase project with reference: hnoadcbppldmawognwdx');
      addResult('Account Types', 'info', 'Supabase accounts are typically linked to: GitHub, Google, or Email/Password');

      addResult('Complete', 'success', '🎉 User and project information check completed!');
      
      toast({
        title: 'Check Complete',
        description: 'Supabase user and project information retrieved',
      });

    } catch (error) {
      addResult('Error', 'error', `Check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast({
        title: 'Check Failed',
        description: 'Failed to retrieve user information',
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: 'success' | 'error' | 'info' | 'warning') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2" />
          Supabase User & Project Information
        </CardTitle>
        <CardDescription>
          Check current Supabase authentication, user info, and project details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={checkSupabaseUser} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking User Info...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Check Supabase User & Project Info
            </>
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto border rounded p-4">
            {results.map((result, index) => (
              <div key={index} className="flex items-start gap-2 p-2 rounded border-l-4 border-l-gray-200">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="font-medium text-sm">{result.step}</div>
                  <div className="text-sm text-gray-600 whitespace-pre-wrap">{result.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
          <h3 className="font-semibold mb-2 text-blue-800">Quick Access Info:</h3>
          <div className="text-sm space-y-1 text-blue-700">
            <div><strong>Project Reference:</strong> hnoadcbppldmawognwdx</div>
            <div><strong>Dashboard URL:</strong> https://supabase.com/dashboard/project/hnoadcbppldmawognwdx</div>
            <div><strong>Project URL:</strong> https://hnoadcbppldmawognwdx.supabase.co</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 rounded border border-yellow-200">
          <h3 className="font-semibold mb-2 text-yellow-800">Admin Panel Access:</h3>
          <div className="text-sm space-y-1 text-yellow-700">
            <div><strong>Username:</strong> admin</div>
            <div><strong>Password:</strong> persian123</div>
            <div><strong>Alternative passwords:</strong> admin123, pizzeria2024, admin</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseUserChecker;
