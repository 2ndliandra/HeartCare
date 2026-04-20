// ============================================================
// AdminPage types
// Used by: AdminUsers, AdminArticles, AdminDatasets, AdminDashboard
// ============================================================

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  roles?: string[];
  created_at: string;
}

export interface AdminArticle {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  thumbnail: string;
  status: "published" | "draft";
  created_at: string;
  author?: {
    name: string;
  };
}

export interface Dataset {
  _id?: string;
  id: string;
  name: string;
  description?: string;
  file_path?: string;
  row_count?: number;
  status: "active" | "inactive" | "training";
  created_at: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalArticles: number;
  totalPredictions: number;
  totalDatasets: number;
  recentActivity?: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: string;
  message: string;
  created_at: string;
}
