import api from "./api";
import type { Article, Category } from "~/types/shared";

type ArticleCollectionResponse = {
  success?: boolean;
  data: Article[];
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};

type ArticleDetailResponse = {
  success?: boolean;
  data: Article;
};

type CategoryCollectionResponse = {
  success?: boolean;
  data: Category[];
};

type MarkArticleReadResponse = {
  success?: boolean;
  data?: {
    read_article?: string[];
  };
};

export const articleService = {
  async getArticles(page?: number) {
    const query = page ? `?page=${page}` : "";
    const response = await api.get<ArticleCollectionResponse>(`/articles${query}`);
    return response.data;
  },

  async getArticleBySlug(slug: string) {
    const response = await api.get<ArticleDetailResponse>(`/articles/${slug}`);
    return response.data;
  },

  async getCategories() {
    const response = await api.get<CategoryCollectionResponse>("/categories");
    return response.data;
  },

  async markAsRead(articleId: string) {
    const response = await api.post<MarkArticleReadResponse>(`/articles/${articleId}/read`);
    return response.data;
  },
};
