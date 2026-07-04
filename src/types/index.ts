export type SeverityLevel = 'critical' | 'high' | 'moderate' | 'low';

export type PatientStatus = 'waiting' | 'in_treatment' | 'discharged';

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

export interface Patient {
  id: string;
  name: string;
  age: number;
  symptoms: string;
  pain_level: number;
  symptom_duration: string;
  medical_history: string;
  severity_score: number;
  severity_level: SeverityLevel;
  token_number: number | null;
  status: PatientStatus;
  scoring_breakdown: ScoringBreakdown;
  created_at: string;
  updated_at: string;
  queue_date: string;
}

export interface PatientFormData {
  name: string;
  age: number | '';
  symptoms: string;
  pain_level: number;
  symptom_duration: string;
  medical_history: string;
}
