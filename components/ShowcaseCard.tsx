import Link from 'next/link';
import Badge from './Badge';

interface ShowcaseCardProps {
  showcase: {
    id: string;
    title: string;
    slug: string;
    status: 'uploaded' | 'processing' | 'ready' | 'failed';
    visibility: 'public' | 'unlisted' | 'private';
    created_at: string;
  };
}

export default function ShowcaseCard({ showcase }: ShowcaseCardProps) {
  const statusColors = {
    uploaded: 'bg-gray-500',
    processing: 'bg-yellow-500',
    ready: 'bg-green-500',
    failed: 'bg-red-500',
  };

  const statusTone = {
    uploaded: 'neutral',
    processing: 'yellow',
    ready: 'green',
    failed: 'red',
  };

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold truncate">{showcase.title}</h3>
        <Badge tone={statusTone[showcase.status] as any}>
          {showcase.status}
        </Badge>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        <Badge tone="blue" className="mr-2">
          {showcase.visibility}
        </Badge>
        <span>
          {new Date(showcase.created_at).toLocaleDateString()}
        </span>
      </div>

      {showcase.status === 'ready' ? (
        <Link
          href={`/s/${showcase.slug}`}
          className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          View
        </Link>
      ) : (
        <button
          disabled
          className="block w-full text-center bg-gray-300 text-gray-600 py-2 rounded cursor-not-allowed"
        >
          {showcase.status === 'processing' ? 'Processing...' : showcase.status}
        </button>
      )}
    </div>
  );
}
