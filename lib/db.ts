// Database helper functions for Showcase3D
import { supabase } from './supabaseClient';
import { createServerClient } from './supabaseServer';

export interface Showcase {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  visibility: 'public' | 'unlisted' | 'private';
  status: 'uploaded' | 'processing' | 'ready' | 'failed';
  input_path: string | null;
  output_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  showcase_id: string;
  input_path: string;
  output_path: string | null;
  status: 'queued' | 'running' | 'complete' | 'failed';
  attempt_count: number;
  started_at: string | null;
  finished_at: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch all showcases for a given user (authenticated only)
 * @param userId - The user ID to fetch showcases for
 * @returns Array of Showcase objects
 */
export async function getUserShowcases(userId: string): Promise<Showcase[]> {
  const { data, error } = await supabase
    .from('showcases')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user showcases:', error);
    return [];
  }

  return data as Showcase[];
}

/**
 * Fetch a single showcase by slug (uses public_showcases view for anon access)
 * @param slug - The unique slug of the showcase
 * @returns Showcase object or null if not found
 */
export async function getShowcaseBySlug(slug: string): Promise<Showcase | null> {
  // Use server client for server-side queries
  const serverClient = createServerClient();

  // Use public_showcases view for anonymous access
  const { data, error } = await serverClient
    .from('public_showcases')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching showcase by slug:', error);
    return null;
  }

  return data as Showcase;
}

/**
 * Fetch job status for a showcase
 * @param showcaseId - The showcase ID to fetch job for
 * @returns Job object or null if not found
 */
export async function getJobStatus(showcaseId: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('showcase_id', showcaseId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching job status:', error);
    return null;
  }

  return data as Job;
}

/**
 * Legacy alias for getUserShowcases (for backwards compatibility)
 */
export async function listShowcasesByUser(userId: string): Promise<Showcase[]> {
  return getUserShowcases(userId);
}
