'use client';
import { useState } from 'react';
import { uploadFile } from '@/lib/upload';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';

export default function UploadForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Validate file type
    const validTypes = ['.step', '.stp', '.obj', '.stl'];
    const ext = selected.name.toLowerCase().substring(selected.name.lastIndexOf('.'));
    if (!validTypes.includes(ext)) {
      setError('Invalid file type. Please upload STEP, OBJ, or STL files.');
      return;
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (selected.size > maxSize) {
      setError('File too large. Maximum size is 50MB.');
      return;
    }

    setFile(selected);
    setError('');
    if (!title) setTitle(selected.name.replace(/\.[^/.]+$/, '')); // Auto-fill title
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    setUploading(true);
    setError('');

    try {
      // Upload file to cad-uploaded bucket
      const uploadResult = await uploadFile(file);
      if (!uploadResult.ok || !uploadResult.path) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      // Call RPC to create showcase + job
      const { data: showcaseId, error: rpcError } = await supabase.rpc(
        'create_showcase_and_job',
        {
          p_user_id: user.id,
          p_title: title,
          p_input_path: uploadResult.path,
        }
      );

      if (rpcError) throw rpcError;

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="My CAD Model"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          CAD File (.step, .obj, .stl)
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".step,.stp,.obj,.stl"
          required
          className="mt-1 block w-full"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={!file || uploading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}
