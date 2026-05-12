// ============================================================
// Shared / Article types
// Used by: ArticlesPage, LandingPage
// ============================================================

export type ArticleStatus = "draft" | "published" | "archived";

export interface UserIdentity {
  id?: string;
  name: string;
  initial?: string;
  email?: string;
  profile_picture?: string | null;
}

export interface ArticleAuthor extends UserIdentity {}

export interface CurrentUserProfile
  extends Pick<UserIdentity, "name" | "initial" | "profile_picture"> {}

export interface Article {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  content: string;
  raw_content?: string;
  category: string;
  thumbnail?: string | null;
  status: ArticleStatus;
  created_at: string;
  reading_time?: number;
  author?: ArticleAuthor;
  author_name?: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
}
