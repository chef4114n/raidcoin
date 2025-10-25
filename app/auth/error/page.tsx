'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'Access was denied. You may have cancelled the authentication.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      case 'OAuthSignin':
        return 'Error in constructing an authorization URL.';
      case 'OAuthCallback':
        return 'Error in handling the response from an OAuth provider.';
      case 'OAuthAccountNotLinked':
        return 'The account is not linked to any existing user.';
      case 'SessionRequired':
        return 'The content of this page requires you to be signed in at all times.';
      case 'Callback':
        return 'Error in the OAuth callback handler route.';
      default:
        return 'An unknown error occurred during authentication.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-red-400 mb-4">Authentication Error</h1>
        <p className="text-gray-300 mb-6">{getErrorMessage(error)}</p>
        
        {error && (
          <div className="bg-gray-700 rounded p-4 mb-6 text-left">
            <p className="text-sm text-gray-400">Error Code:</p>
            <p className="text-white font-mono">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link 
            href="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Try Again
          </Link>
          
          <Link 
            href="/"
            className="block w-full text-gray-400 hover:text-white transition duration-200"
          >
            Go Back Home
          </Link>
        </div>

        <div className="mt-8 text-xs text-gray-500">
          <p>If this problem persists, please check:</p>
          <ul className="mt-2 text-left space-y-1">
            <li>• Twitter app configuration</li>
            <li>• Callback URL settings</li>
            <li>• Environment variables</li>
          </ul>
        </div>
      </div>
    </div>
  );
}