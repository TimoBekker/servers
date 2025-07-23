import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/lib/api';

export default function ApiTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpoint: string, description: string) => {
    setLoading(true);
    try {
      const response = await fetch(endpoint);
      const status = response.status;
      const text = await response.text();
      
      setTestResult(prev => prev + `\n${description}:\nStatus: ${status}\nResponse: ${text.substring(0, 200)}...\n---\n`);
    } catch (error) {
      setTestResult(prev => prev + `\n${description}:\nError: ${error}\n---\n`);
    }
    setLoading(false);
  };

  const testDashboardStats = async () => {
    setLoading(true);
    try {
      const data = await apiService.getDashboardStats();
      setTestResult(prev => prev + `\nDashboard Stats via API service:\nSuccess: ${JSON.stringify(data, null, 2)}\n---\n`);
    } catch (error) {
      setTestResult(prev => prev + `\nDashboard Stats via API service:\nError: ${error}\n---\n`);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API Test</h1>
        <p className="text-muted-foreground">
          Тестирование подключения к Laravel API
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Тестирование API endpoints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => testEndpoint('/laravel-api/dashboard/stats', 'Dashboard Stats')}
              disabled={loading}
            >
              Test Dashboard Stats
            </Button>
            <Button 
              onClick={() => testEndpoint('/laravel-api/equipment', 'Equipment')}
              disabled={loading}
            >
              Test Equipment
            </Button>
            <Button 
              onClick={() => testEndpoint('/laravel-api/contracts', 'Contracts')}
              disabled={loading}
            >
              Test Contracts
            </Button>
            <Button 
              onClick={() => testEndpoint('http://192.168.126.143:8000/api/dashboard/stats', 'Direct Laravel API')}
              disabled={loading}
            >
              Test Direct API
            </Button>
            <Button 
              onClick={testDashboardStats}
              disabled={loading}
            >
              Test API Service
            </Button>
            <Button 
              onClick={() => setTestResult('')}
              variant="outline"
            >
              Clear
            </Button>
          </div>

          {loading && (
            <Badge variant="secondary">Testing...</Badge>
          )}

          <div>
            <h3 className="font-medium mb-2">Results:</h3>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-auto max-h-96 whitespace-pre-wrap">
              {testResult || 'Нажмите кнопку для тестирования API endpoints'}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Environment:</strong> {import.meta.env.DEV ? 'Development' : 'Production'}</p>
            <p><strong>API Base URL:</strong> {import.meta.env.DEV ? '/laravel-api (proxy)' : (import.meta.env.VITE_API_URL || 'http://192.168.126.143:8000/api')}</p>
            <p><strong>Laravel Target:</strong> http://192.168.126.143:8000/api</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
