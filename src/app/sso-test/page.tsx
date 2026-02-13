"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SSOTestPage() {
  const searchParams = useSearchParams();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    addLog('=== SSO Test Page Loaded ===');
    
    // Check URL parameters
    const authToken = searchParams.get('auth_token');
    const loggedIn = searchParams.get('logged_in');
    const wpLogin = searchParams.get('wp_login');
    
    addLog(`URL Parameters:`);
    addLog(`  auth_token: ${authToken ? authToken.substring(0, 20) + '...' : 'null'}`);
    addLog(`  logged_in: ${loggedIn}`);
    addLog(`  wp_login: ${wpLogin}`);
    
    // Check localStorage
    const storedToken = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    addLog(`\nLocalStorage:`);
    addLog(`  auth_token: ${storedToken ? storedToken.substring(0, 20) + '...' : 'null'}`);
    addLog(`  user_data: ${userData ? 'exists' : 'null'}`);
    
    // If auth_token in URL, store it
    if (authToken) {
      addLog(`\nStoring auth_token from URL...`);
      localStorage.setItem('auth_token', authToken);
      addLog(`Token stored successfully!`);
      
      // Test API call
      addLog(`\nTesting API call to get user details...`);
      fetch('https://real-leaders.com/wp-json/verified-real-leaders/v1/user/user-details', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(data => {
          addLog(`API Response: ${data.success ? 'SUCCESS' : 'FAILED'}`);
          if (data.success) {
            addLog(`User: ${data.user.email}`);
            localStorage.setItem('user_data', JSON.stringify(data.user));
            addLog(`User data stored!`);
          } else {
            addLog(`Error: ${data.message || 'Unknown error'}`);
          }
        })
        .catch(error => {
          addLog(`API Error: ${error.message}`);
        });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">SSO Test Page</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Login to WordPress: <a href="https://real-leaders.com/wp-admin" target="_blank" className="text-blue-400 underline">real-leaders.com/wp-admin</a></li>
            <li>After login, visit: <a href="https://real-leaders.com/wp-json/verified-real-leaders/v1/sso/check-session?redirect_url=https://app.real-leaders.com/sso-test" target="_blank" className="text-blue-400 underline">SSO Check Session</a></li>
            <li>You should be redirected back here with auth_token</li>
            <li>Check the logs below to see what happened</li>
          </ol>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Logs:</h2>
          <div className="bg-black rounded p-4 font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-green-400">{log}</div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 space-x-4">
          <button
            onClick={() => {
              localStorage.clear();
              addLog('localStorage cleared!');
            }}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Clear localStorage
          </button>
          
          <button
            onClick={() => {
              window.location.href = '/dashboard';
            }}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Go to Dashboard
          </button>
          
          <button
            onClick={() => {
              setLogs([]);
            }}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
          >
            Clear Logs
          </button>
        </div>
      </div>
    </div>
  );
}
