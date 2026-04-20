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
  author?: {
    name: string;
  };
  author_name?: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
}
