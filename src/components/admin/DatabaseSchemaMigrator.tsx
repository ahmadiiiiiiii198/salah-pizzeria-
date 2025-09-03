import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MigrationResult {
  step: string;
  status: 'success' | 'error' | 'info';
  message: string;
}

const DatabaseSchemaMigrator: React.FC = () => {
  const [results, setResults] = useState<MigrationResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const addResult = (step: string, status: 'success' | 'error' | 'info', message: string) => {
    setResults(prev => [...prev, { step, status, message }]);
  };

  const runMigrations = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      addResult('Start', 'info', 'Starting database schema migration...');

      // Test if we can query content_sections first
      addResult('Test 1', 'info', 'Testing current content_sections table...');

      const { data: currentData, error: currentError } = await supabase
        .from('content_sections')
        .select('*')
        .limit(1);

      if (currentError) {
        addResult('Test 1', 'error', `Current table query failed: ${currentError.message}`);
        addResult('Manual Fix', 'info', 'Please run the migrations manually in Supabase SQL Editor:');
        addResult('SQL 1', 'info', `
ALTER TABLE content_sections
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_content_sections_sort_order ON content_sections(sort_order);

UPDATE content_sections
SET sort_order = COALESCE(
  (SELECT COUNT(*) FROM content_sections c2 WHERE c2.created_at <= content_sections.created_at),
  0
)
WHERE sort_order IS NULL OR sort_order = 0;
        `);
        return;
      }

      addResult('Test 1', 'success', `Found ${currentData?.length || 0} content sections`);

      // Check if columns already exist by trying to select them
      addResult('Test 2', 'info', 'Checking if new columns exist...');

      const { data: columnTest, error: columnError } = await supabase
        .from('content_sections')
        .select('title, content, image_url, sort_order')
        .limit(1);

      if (columnError) {
        if (columnError.message.includes('column') && columnError.message.includes('does not exist')) {
          addResult('Test 2', 'info', 'Columns missing - need to add them manually');
          addResult('Manual Fix', 'error', 'Database schema needs manual update. Please run this SQL in Supabase:');
          addResult('SQL Commands', 'info', `
-- Add missing columns to content_sections table
ALTER TABLE content_sections
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Create index for sort_order
CREATE INDEX IF NOT EXISTS idx_content_sections_sort_order ON content_sections(sort_order);

-- Update existing records to have a default sort_order
UPDATE content_sections
SET sort_order = COALESCE(
  (SELECT COUNT(*) FROM content_sections c2 WHERE c2.created_at <= content_sections.created_at),
  0
)
WHERE sort_order IS NULL OR sort_order = 0;

-- Fix RLS policies for content_sections
DROP POLICY IF EXISTS "Allow public read access to active content sections" ON content_sections;
DROP POLICY IF EXISTS "Allow authenticated users full access to content sections" ON content_sections;

CREATE POLICY "Allow public read access to content sections"
  ON content_sections FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to content sections"
  ON content_sections FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to content sections"
  ON content_sections FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete access to content sections"
  ON content_sections FOR DELETE USING (true);

-- Fix RLS policies for settings
DROP POLICY IF EXISTS "Allow public read access to settings" ON settings;
DROP POLICY IF EXISTS "Allow authenticated users to update settings" ON settings;
DROP POLICY IF EXISTS "Allow authenticated users to insert settings" ON settings;

CREATE POLICY "Allow public read access to settings"
  ON settings FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to settings"
  ON settings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to settings"
  ON settings FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete access to settings"
  ON settings FOR DELETE USING (true);
          `);
          return;
        } else {
          addResult('Test 2', 'error', `Column test failed: ${columnError.message}`);
          return;
        }
      }

      addResult('Test 2', 'success', 'All columns exist! Testing sort_order query...');

      // Test content_sections query with sort_order
      const { data: testData, error: testError } = await supabase
        .from('content_sections')
        .select('*')
        .order('sort_order');

      if (testError) {
        addResult('Final Test', 'error', `Sort order query failed: ${testError.message}`);
        addResult('Manual Fix', 'error', 'Please run the SQL commands shown above in Supabase SQL Editor');
      } else {
        addResult('Final Test', 'success', `✅ All tests passed! Found ${testData?.length || 0} content sections`);
        addResult('Complete', 'success', '🎉 Database schema is working correctly!');

        toast({
          title: 'Database Ready',
          description: 'All database operations are working correctly',
        });
      }

    } catch (error) {
      addResult('Error', 'error', `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast({
        title: 'Migration Failed',
        description: 'Failed to update database schema',
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
        <CardTitle>Database Schema Migrator</CardTitle>
        <CardDescription>
          Fix database schema issues and RLS policies for content management
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runMigrations} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Migrations...
            </>
          ) : (
            'Run Database Migrations'
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="flex items-start gap-2 p-2 rounded border">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="font-medium text-sm">{result.step}</div>
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

export default DatabaseSchemaMigrator;
