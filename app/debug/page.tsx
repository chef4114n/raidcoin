'use client';

export default function DebugAuth() {
  const checkConfig = () => {
    console.log('Environment check:');
    console.log('NEXTAUTH_URL:', process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'Not set');
    console.log('Current URL:', window.location.origin);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Twitter OAuth Debug</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Configuration</h2>
          <div className="space-y-2 text-sm">
            <p><strong>NextAuth URL:</strong> {process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'http://localhost:3000'}</p>
            <p><strong>Current Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'Loading...'}</p>
            <p><strong>Expected Callback:</strong> {typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback/twitter` : 'Loading...'}</p>
          </div>
        </div>

        <div className="bg-yellow-900 border border-yellow-500 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-300">Issue Identified</h2>
          <p className="mb-4">Your current Twitter credentials are <strong>API v1.1 format</strong>, but NextAuth needs <strong>OAuth 2.0 credentials</strong>.</p>
          
          <div className="space-y-2 text-sm">
            <p><strong>Current Client ID:</strong> <code className="bg-gray-800 px-2 py-1 rounded">1980063450819936256-xJ2Ba3IQ0wxX1lEnhj8O9kJT7EiUzD</code></p>
            <p className="text-red-400">❌ This is an Access Token format, not OAuth 2.0 Client ID</p>
          </div>
        </div>

        <div className="bg-green-900 border border-green-500 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-300">How to Fix</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" className="text-blue-400 underline">Twitter Developer Portal</a></li>
            <li>Select your app → User authentication settings → Edit</li>
            <li>Enable <strong>OAuth 2.0</strong> (not OAuth 1.0a)</li>
            <li>Set callback URL: <code className="bg-gray-800 px-2 py-1 rounded">{typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback/twitter` : 'http://localhost:3000/api/auth/callback/twitter'}</code></li>
            <li>Go to Keys and tokens → Copy <strong>OAuth 2.0 Client ID</strong> and <strong>Client Secret</strong></li>
            <li>Update your .env file with the new credentials</li>
          </ol>
        </div>

        <button
          onClick={checkConfig}
          className="mt-6 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Check Config (see console)
        </button>
      </div>
    </div>
  );
}