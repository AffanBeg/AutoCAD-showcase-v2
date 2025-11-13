'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="text-slate-400">Loading...</div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Showcase3D</h1>
      <p className="text-slate-400 max-w-2xl">
        Upload STEP/OBJ/STL. We convert to STL in the background and host a public viewer you can share.
      </p>
      <div className="card">
        <p className="text-sm text-slate-300">Get started by signing in and visiting your Dashboard.</p>
      </div>
    </section>
  );
}
