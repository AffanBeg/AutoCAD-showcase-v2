'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function AuthCallback() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Auth callback - loading:', loading, 'user:', user);

    // Wait for auth to finish loading
    if (loading) return;

    // If we have a user, redirect to dashboard
    if (user) {
      console.log('User authenticated, redirecting to dashboard');
      router.push('/dashboard');
      return;
    }

    // If loading is done but no user, there was an error
    console.log('Auth failed, redirecting to login');
    setError('Authentication failed');
    setTimeout(() => router.push('/login'), 2000);
  }, [user, loading, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-2">{error}</div>
          <div className="text-gray-600">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-lg mb-2">Completing authentication...</div>
        <div className="text-gray-600">Please wait</div>
      </div>
    </div>
  );
}
