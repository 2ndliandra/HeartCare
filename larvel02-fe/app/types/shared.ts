// ============================================================
// Shared / Article types
// Used by: ArticlesPage, LandingPage
// ============================================================

export interface Article {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  content: string;
  raw_content?: string;
  category: string;
  thumbnail: string;
  status: string;
  created_at: string;
  reading_time?: number;
  author?: {
    id?: string;
    name: string;
    email?: string;
    initial?: string;
    profile_picture?: string | null;
  };
  author_name?: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
}
