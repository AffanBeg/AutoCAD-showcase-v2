import UploadForm from '@/components/UploadForm';

export default function NewShowcasePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Upload New Showcase</h1>
      <UploadForm />
    </div>
  );
}
