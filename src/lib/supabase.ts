import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Patient {
  id: string;
  name: string;
  age: number;
  symptoms: string;
  pain_level: number;
  symptom_duration: string;
  medical_history: string;
  severity_score: number;
  severity_level: 'critical' | 'high' | 'moderate' | 'low';
  token_number: number | null;
  status: 'waiting' | 'in_treatment' | 'discharged';
  scoring_breakdown: ScoringBreakdown;
  created_at: string;
  updated_at: string;
  queue_date: string;
}

export interface ScoringBreakdown {
  age_score: number;
  age_reason: string;
  pain_score: number;
  pain_reason: string;
  symptom_score: number;
  symptom_reason: string;
  duration_score: number;
  duration_reason: string;
  history_score: number;
  history_reason: string;
  total_score: number;
  final_level: string;
}

export interface PatientInput {
  name: string;
  age: number;
  symptoms: string;
  pain_level: number;
  symptom_duration: string;
  medical_history: string;
}
