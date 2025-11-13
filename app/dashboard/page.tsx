'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import ShowcaseCard from '@/components/ShowcaseCard';
import Link from 'next/link';

interface Showcase {
  id: string;
  title: string;
  slug: string;
  status: 'uploaded' | 'processing' | 'ready' | 'failed';
  visibility: 'public' | 'unlisted' | 'private';
  created_at: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchShowcases() {
      try {
        // Import function from /lib/db.ts (Backend will provide)
        const { listShowcasesByUser } = await import('@/lib/db');
        const data = await listShowcasesByUser(user.id);
        setShowcases(data);
      } catch (error) {
        console.error('Failed to fetch showcases:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchShowcases();
  }, [user]);

  if (loading) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Showcases</h1>
        <Link
          href="/dashboard/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + New Showcase
        </Link>
      </div>

      {showcases.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No showcases yet. Upload your first CAD file!</p>
          <Link href="/dashboard/new" className="text-blue-600 hover:underline">
            Get Started
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcases.map((showcase) => (
            <ShowcaseCard key={showcase.id} showcase={showcase} />
          ))}
        </div>
      )}
    </div>
  );
}
