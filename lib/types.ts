export type Visibility = "public" | "unlisted" | "private";
export type ShowcaseStatus = "uploaded" | "processing" | "ready" | "failed";

export interface Showcase {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  visibility: Visibility;
  status: ShowcaseStatus;
  created_at: string;
  updated_at: string;
  input_path?: string;
  output_path?: string;
}
