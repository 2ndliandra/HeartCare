// ============================================================
// UserPage types
// Used by: ChatConsultation, RiwayatPemeriksaan, HasilPrediksi, etc.
// ============================================================

export interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export interface Prediction {
  id: string;
  user_id: number;
  result_level: "TINGGI" | "RENDAH";
  result_score: number;
  input_data: PredictionInput;
  created_at: string;
  updated_at?: string;
}

export interface PredictionInput {
  age: number | string;
  gender: string;
  systolic_bp: number | string;
  diastolic_bp: number | string;
  cholesterol: number | string;
  heart_rate: number | string;
  weight: number | string;
  height: number | string;
  smoking?: string;
  exercise?: string;
  medical_history?: string[];
  symptoms?: string[];
  alcohol?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  gender?: string;
  address?: string;
  birth_date?: string;
  profile_picture?: string;
  roles?: string[];
}

export type TabType = "info" | "settings" | "security";
