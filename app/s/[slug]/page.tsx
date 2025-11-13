import { notFound } from 'next/navigation';
import ViewerSTL from '@/components/ViewerSTL';
import Badge from '@/components/Badge';
import { getShowcaseBySlug } from '@/lib/db';
import { supabase } from '@/lib/supabaseClient';

interface PageProps {
  params: { slug: string };
}

async function getShowcase(slug: string) {
  const showcase = await getShowcaseBySlug(slug);

  if (!showcase) return null;

  // Generate signed URL if status is ready
  let signedUrl = null;
  if (showcase.status === 'ready' && showcase.output_path) {
    const { data } = await supabase.storage
      .from(process.env.SUPABASE_STORAGE_BUCKET_CONVERTED || 'cad-converted')
      .createSignedUrl(showcase.output_path, 3600); // 1 hour expiry
    signedUrl = data?.signedUrl || null;
  }

  return { ...showcase, signedUrl };
}

export default async function ShowcasePage({ params }: PageProps) {
  const showcase = await getShowcase(params.slug);

  if (!showcase) {
    notFound();
  }

  if (showcase.status !== 'ready') {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">{showcase.title}</h1>
        <Badge tone={showcase.status === 'processing' ? 'yellow' : 'red'}>
          {showcase.status}
        </Badge>
        <p className="mt-4 text-gray-600">
          {showcase.status === 'processing'
            ? 'Your file is being converted. Please check back in a few moments.'
            : 'This showcase is not ready yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{showcase.title}</h1>
        <div className="flex gap-2 mt-2">
          <Badge tone="blue">{showcase.visibility}</Badge>
          <Badge tone="green">{showcase.status}</Badge>
        </div>
      </div>

      {showcase.signedUrl ? (
        <div className="w-full h-[600px] border rounded-lg overflow-hidden">
          <ViewerSTL url={showcase.signedUrl} />
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Failed to load 3D model. Please try again later.
        </div>
      )}
    </div>
  );
}
