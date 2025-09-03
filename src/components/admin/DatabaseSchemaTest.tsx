import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  test: string;
  status: 'success' | 'error' | 'info';
  message: string;
}

const DatabaseSchemaTest: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const addResult = (test: string, status: 'success' | 'error' | 'info', message: string) => {
    setResults(prev => [...prev, { test, status, message }]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      addResult('Start', 'info', 'Starting database schema tests...');

      // Test 1: Basic content_sections query
      addResult('Test 1', 'info', 'Testing basic content_sections query...');
      
      const { data: basicData, error: basicError } = await supabase
        .from('content_sections')
        .select('id, section_key, section_name')
        .limit(5);

      if (basicError) {
        addResult('Test 1', 'error', `Basic query failed: ${basicError.message}`);
        return;
      }

      addResult('Test 1', 'success', `✅ Basic query works. Found ${basicData?.length || 0} sections`);

      // Test 2: Check for new columns
      addResult('Test 2', 'info', 'Testing new columns (title, content, image_url, sort_order)...');
      
      const { data: columnData, error: columnError } = await supabase
        .from('content_sections')
        .select('title, content, image_url, sort_order')
        .limit(1);

      if (columnError) {
        if (columnError.message.includes('column') && columnError.message.includes('does not exist')) {
          addResult('Test 2', 'error', '❌ New columns missing! Need to run schema migration.');
          addResult('Fix Required', 'info', 'Run the Schema Migrator or apply SQL manually');
          return;
        } else {
          addResult('Test 2', 'error', `Column test failed: ${columnError.message}`);
          return;
        }
      }

      addResult('Test 2', 'success', '✅ All new columns exist!');

      // Test 3: Test sort_order query
      addResult('Test 3', 'info', 'Testing ORDER BY sort_order...');
      
      const { data: sortData, error: sortError } = await supabase
        .from('content_sections')
        .select('section_key, sort_order')
        .order('sort_order')
        .limit(5);

      if (sortError) {
        addResult('Test 3', 'error', `Sort order query failed: ${sortError.message}`);
        return;
      }

      addResult('Test 3', 'success', `✅ Sort order query works! Found ${sortData?.length || 0} sections`);

      // Test 4: Test INSERT operation (RLS policy test)
      addResult('Test 4', 'info', 'Testing INSERT operation (RLS policy)...');
      
      const testSection = {
        section_key: `test_${Date.now()}`,
        section_name: 'Test Section',
        content_type: 'test',
        content_value: 'Test content',
        metadata: { test: true },
        is_active: false,
        title: 'Test Title',
        content: 'Test Content',
        image_url: null,
        sort_order: 999
      };

      const { data: insertData, error: insertError } = await supabase
        .from('content_sections')
        .insert(testSection)
        .select()
        .single();

      if (insertError) {
        addResult('Test 4', 'error', `INSERT failed: ${insertError.message}`);
        addResult('RLS Issue', 'info', 'This indicates RLS policies need to be fixed');
        return;
      }

      addResult('Test 4', 'success', '✅ INSERT works! RLS policies are correct');

      // Test 5: Test UPDATE operation
      addResult('Test 5', 'info', 'Testing UPDATE operation...');
      
      const { error: updateError } = await supabase
        .from('content_sections')
        .update({ title: 'Updated Test Title' })
        .eq('id', insertData.id);

      if (updateError) {
        addResult('Test 5', 'error', `UPDATE failed: ${updateError.message}`);
      } else {
        addResult('Test 5', 'success', '✅ UPDATE works!');
      }

      // Test 6: Clean up test data
      addResult('Cleanup', 'info', 'Cleaning up test data...');
      
      const { error: deleteError } = await supabase
        .from('content_sections')
        .delete()
        .eq('id', insertData.id);

      if (deleteError) {
        addResult('Cleanup', 'error', `DELETE failed: ${deleteError.message}`);
      } else {
        addResult('Cleanup', 'success', '✅ DELETE works! Test data cleaned up');
      }

      addResult('Complete', 'success', '🎉 All database schema tests passed!');
      
      toast({
        title: 'Tests Successful',
        description: 'Database schema is working correctly',
      });

    } catch (error) {
      addResult('Error', 'error', `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast({
        title: 'Tests Failed',
        description: 'Database schema tests encountered errors',
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: 'success' | 'error' | 'info') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'info':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Database Schema Test</CardTitle>
        <CardDescription>
          Test database schema and RLS policies for content_sections table
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runTests} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            'Run Database Schema Tests'
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="flex items-start gap-2 p-2 rounded border">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="font-medium text-sm">{result.test}</div>
                  <div className="text-sm text-gray-600">{result.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseSchemaTest;
