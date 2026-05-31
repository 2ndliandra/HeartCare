import api from "./api";

type ApiDataResponse<T> = {
  success?: boolean;
  data?: T;
  message?: string;
};

type PaginatedResponse<T> = ApiDataResponse<T[]> & {
  pagination?: {
    total?: number;
    per_page?: number;
    current_page: number;
    last_page: number;
  };
};

export type AdminUserPayload = {
  name: string;
  email: string;
  password?: string;
  phone_number?: string;
  role: string;
};

export type AdminCategoryPayload = {
  name: string;
};

export const adminService = {
  async getStats() {
    const response = await api.get<ApiDataResponse<unknown>>("/admin/stats");
    return response.data;
  },

  async getPredictionStats() {
    const response = await api.get<ApiDataResponse<unknown>>("/admin/predictions/stats");
    return response.data;
  },

  async getUsers(page?: number) {
    const query = page ? `?page=${page}` : "";
    const response = await api.get<PaginatedResponse<unknown>>(`/admin/users${query}`);
    return response.data;
  },

  async createUser(data: AdminUserPayload) {
    const response = await api.post<ApiDataResponse<unknown>>("/admin/users", data);
    return response.data;
  },

  async updateUser(id: number | string, data: AdminUserPayload) {
    const response = await api.put<ApiDataResponse<unknown>>(`/admin/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: number | string) {
    const response = await api.delete<ApiDataResponse<unknown>>(`/admin/users/${id}`);
    return response.data;
  },

  async createCategory(data: AdminCategoryPayload) {
    const response = await api.post<ApiDataResponse<unknown>>("/admin/categories", data);
    return response.data;
  },

  async updateCategory(id: string, data: AdminCategoryPayload) {
    const response = await api.put<ApiDataResponse<unknown>>(`/admin/categories/${id}`, data);
    return response.data;
  },

  async deleteCategory(id: string) {
    const response = await api.delete<ApiDataResponse<unknown>>(`/admin/categories/${id}`);
    return response.data;
  },

  async getArticles(page: number) {
    const response = await api.get<PaginatedResponse<unknown>>(`/admin/articles?page=${page}`);
    return response.data;
  },

  async createArticle(data: FormData) {
    const response = await api.post<ApiDataResponse<unknown>>("/admin/articles", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async updateArticle(id: string, data: FormData) {
    const response = await api.post<ApiDataResponse<unknown>>(`/admin/articles/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async deleteArticle(id: string) {
    const response = await api.delete<ApiDataResponse<unknown>>(`/admin/articles/${id}`);
    return response.data;
  },
};
