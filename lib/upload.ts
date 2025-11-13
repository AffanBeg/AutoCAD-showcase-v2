// Supabase upload + signed URL helpers
import { supabase } from './supabaseClient';
import { randomUUID } from 'crypto';

interface UploadResult {
  ok: boolean;
  path?: string;
  error?: string;
}

/**
 * Upload a CAD file to the cad-uploaded bucket
 * @param file - The file to upload (STEP, OBJ, or STL)
 * @returns UploadResult with ok status, path on success, or error message
 */
export async function uploadFile(file: File): Promise<UploadResult> {
  try {
    // Get current user session
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return { ok: false, error: 'Not authenticated' };
    }

    const userId = session.user.id;

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${randomUUID()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload to cad-uploaded bucket
    const { data, error } = await supabase.storage
      .from('cad-uploaded')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return { ok: false, error: error.message };
    }

    return { ok: true, path: data.path };
  } catch (err: any) {
    console.error('Upload exception:', err);
    return { ok: false, error: err.message || 'Upload failed' };
  }
}

/**
 * Generate a signed URL for a converted STL file
 * @param path - The file path in the cad-converted bucket
 * @returns Signed URL string or null on error
 */
export async function getSignedUrl(path: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from('cad-converted')
      .createSignedUrl(path, 3600); // 60 minutes

    if (error) {
      console.error('Signed URL error:', error);
      return null;
    }

    return data.signedUrl;
  } catch (err) {
    console.error('Signed URL exception:', err);
    return null;
  }
}
