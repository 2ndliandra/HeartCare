import api from "./api";
import type { Article } from "~/types/shared";
import type { Prediction, UserProfile } from "~/types/UserPage/User";

type ApiSuccessResponse<T> = {
  success: boolean;
  data: T;
};

type ApiMessageResponse<T = undefined> = {
  success: boolean;
  message?: string;
  data?: T;
};

export type PredictPayload = {
  age: number;
  gender: string;
  systolic_bp: number;
  diastolic_bp: number;
  cholesterol: number;
  blood_sugar: number;
  weight: number;
  height: number;
  smoking: string;
  alcohol: string;
  exercise: string;
};

export type PredictResponse = {
  success: boolean;
  prediction: {
    id?: string;
    risk_level: string;
    risk_score?: number;
    created_at?: string;
  };
};

export type ChatHistoryItem = {
  id?: string;
  _id?: string;
  message: string;
  response: string;
  created_at: string;
};

export type ChatResponseData =
  | string
  | {
      message?: string;
      error?: string;
    };

export type UserDashboardResponseData = {
  stats?: {
    total_checkups: number;
    checkups_trend: string;
    total_consultations: number;
    consultations_trend: string;
    total_articles_read: number;
  };
  predictions?: Prediction[];
  articles?: Article[];
};

export type ProfileResponse = ApiMessageResponse<UserProfile>;

export type UpdatePasswordPayload = {
  password: string;
  password_confirmation: string;
};

export const userService = {
  async predict(data: PredictPayload) {
    const response = await api.post<PredictResponse>("/predict", data);
    return response.data;
  },

  async getPredictions() {
    const response = await api.get<ApiSuccessResponse<Prediction[]>>("/predictions");
    return response.data;
  },

  async getDashboard() {
    const response = await api.get<ApiSuccessResponse<UserDashboardResponseData>>("/user/dashboard");
    return response.data;
  },

  async getChats() {
    const response = await api.get<ApiSuccessResponse<ChatHistoryItem[]>>("/chats");
    return response.data;
  },

  async sendChat(prompt: string) {
    const response = await api.post<ApiSuccessResponse<ChatResponseData>>("/chat", { prompt });
    return response.data;
  },

  async getProfile() {
    const response = await api.get<ProfileResponse>("/profile");
    return response.data;
  },

  async updateProfile(data: FormData) {
    const response = await api.post<ProfileResponse>("/profile", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async updatePassword(data: UpdatePasswordPayload) {
    const response = await api.patch<ProfileResponse>("/profile/password", data);
    return response.data;
  },
};
