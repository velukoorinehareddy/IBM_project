import { ScoringBreakdown, SeverityLevel } from '../types';

// Critical symptom keywords that indicate life-threatening conditions
const CRITICAL_KEYWORDS = [
  'chest pain', 'difficulty breathing', 'shortness of breath', 'unconscious',
  'severe bleeding', 'stroke', 'heart attack', 'seizure', 'anaphylaxis',
  'allergic reaction', 'swelling throat', 'cannot breathe', 'blue lips',
  'unresponsive', 'major trauma', 'gunshot', 'stabbing', 'severe head',
  'paralysis', 'numbness', 'slurred speech', 'sudden weakness'
];

const HIGH_PRIORITY_KEYWORDS = [
  'severe pain', 'high fever', 'vomiting blood', 'blood in stool',
  'abdominal pain', 'dehydration', 'infection', 'fracture', 'broken',
  'dislocated', 'deep cut', 'laceration', 'burns', 'severe headache',
  'migraine', 'asthma', 'wheezing', 'pregnancy', 'labor', 'contractions',
  'diabetic', 'low blood sugar', 'high blood sugar', 'dizziness',
  'fainting', 'rapid heart', 'irregular heartbeat'
];

const MODERATE_KEYWORDS = [
  'moderate pain', 'fever', 'cough', 'cold', 'flu', 'nausea', 'vomiting',
  'diarrhea', 'rash', 'earache', 'sore throat', 'back pain', 'joint pain',
  'sprain', 'bruise', 'minor cut', 'eye irritation', 'blurred vision'
];

export function calculateSeverity(
  age: number,
  painLevel: number,
  symptoms: string,
  symptomDuration: string,
  medicalHistory: string
): { score: number; level: SeverityLevel; breakdown: ScoringBreakdown } {
  let ageScore = 0;
  let painScore = 0;
  let symptomScore = 0;
  let durationScore = 0;
  let historyScore = 0;

  const ageReason = calculateAgeScore(age);
  ageScore = ageReason.score;

  const painReason = calculatePainScore(painLevel);
  painScore = painReason.score;

  const symptomReason = calculateSymptomScore(symptoms);
  symptomScore = symptomReason.score;

  const durationReason = calculateDurationScore(symptomDuration);
  durationScore = durationReason.score;

  const historyReason = calculateHistoryScore(medicalHistory);
  historyScore = historyReason.score;

  const totalScore = ageScore + painScore + symptomScore + durationScore + historyScore;
  const finalLevel = determineSeverityLevel(totalScore);

  const breakdown: ScoringBreakdown = {
    age_score: ageScore,
    age_reason: ageReason.reason,
    pain_score: painScore,
    pain_reason: painReason.reason,
    symptom_score: symptomScore,
    symptom_reason: symptomReason.reason,
    duration_score: durationScore,
    duration_reason: durationReason.reason,
    history_score: historyScore,
    history_reason: historyReason.reason,
    total_score: totalScore,
    final_level: finalLevel
  };

  return { score: totalScore, level: finalLevel, breakdown };
}

function calculateAgeScore(age: number): { score: number; reason: string } {
  if (age < 1) {
    return { score: 35, reason: 'Infant (<1 year): High vulnerability - 35 points' };
  } else if (age < 5) {
    return { score: 25, reason: 'Toddler (1-4 years): Elevated priority - 25 points' };
  } else if (age >= 70) {
    return { score: 30, reason: 'Elderly (70+ years): High risk due to age - 30 points' };
  } else if (age >= 60) {
    return { score: 20, reason: 'Senior (60-69 years): Moderate risk - 20 points' };
  } else if (age >= 50) {
    return { score: 10, reason: 'Adult (50-59 years): Slight elevation - 10 points' };
  }
  return { score: 0, reason: 'Adult (5-49 years): Standard priority - 0 points' };
}

function calculatePainScore(painLevel: number): { score: number; reason: string } {
  if (painLevel >= 9) {
    return { score: 40, reason: `Severe pain (${painLevel}/10): Immediate attention required - 40 points` };
  } else if (painLevel >= 7) {
    return { score: 25, reason: `High pain (${painLevel}/10): Urgent care needed - 25 points` };
  } else if (painLevel >= 5) {
    return { score: 15, reason: `Moderate pain (${painLevel}/10): Prompt attention - 15 points` };
  } else if (painLevel >= 3) {
    return { score: 8, reason: `Mild pain (${painLevel}/10): Standard care - 8 points` };
  }
  return { score: 0, reason: `Minimal pain (${painLevel}/10): Routine care - 0 points` };
}

function calculateSymptomScore(symptoms: string): { score: number; reason: string } {
  const lowerSymptoms = symptoms.toLowerCase();

  for (const keyword of CRITICAL_KEYWORDS) {
    if (lowerSymptoms.includes(keyword)) {
      return { score: 50, reason: `Critical symptom detected ("${keyword}"): Emergency priority - 50 points` };
    }
  }

  const matchedHigh = HIGH_PRIORITY_KEYWORDS.find(k => lowerSymptoms.includes(k));
  if (matchedHigh) {
    return { score: 30, reason: `High priority symptom ("${matchedHigh}"): Urgent care - 30 points` };
  }

  const matchedModerate = MODERATE_KEYWORDS.find(k => lowerSymptoms.includes(k));
  if (matchedModerate) {
    return { score: 15, reason: `Moderate symptom ("${matchedModerate}"): Standard care - 15 points` };
  }

  return { score: 5, reason: 'No recognized high-risk symptoms: Routine assessment - 5 points' };
}

function calculateDurationScore(duration: string): { score: number; reason: string } {
  const lowerDuration = duration.toLowerCase();

  if (lowerDuration.includes('minute') && !lowerDuration.includes('hour')) {
    const minutes = parseInt(lowerDuration) || 0;
    if (minutes < 30) {
      return { score: 20, reason: `Sudden onset (<30 minutes): Acute emergency - 20 points` };
    }
    return { score: 15, reason: `Recent onset (${minutes} minutes): Urgent - 15 points` };
  }

  if (lowerDuration.includes('hour')) {
    const hours = parseInt(lowerDuration) || 1;
    if (hours <= 1) {
      return { score: 15, reason: `Acute onset (≤1 hour): Needs prompt care - 15 points` };
    } else if (hours <= 6) {
      return { score: 10, reason: `Recent symptoms (${hours} hours): Priority attention - 10 points` };
    } else if (hours <= 24) {
      return { score: 5, reason: `Same-day symptoms (${hours} hours): Standard queue - 5 points` };
    }
    return { score: 3, reason: `Ongoing symptoms (${hours}+ hours): Scheduled care - 3 points` };
  }

  if (lowerDuration.includes('day')) {
    const days = parseInt(lowerDuration) || 1;
    if (days <= 2) {
      return { score: 5, reason: `Short-term symptoms (${days} days): Routine priority - 5 points` };
    }
    return { score: 2, reason: `Prolonged symptoms (${days} days): Non-urgent - 2 points` };
  }

  if (lowerDuration.includes('week') || lowerDuration.includes('month')) {
    return { score: 1, reason: 'Chronic/long-term symptoms: Scheduled care - 1 point' };
  }

  return { score: 5, reason: 'Duration not specified: Default priority - 5 points' };
}

function calculateHistoryScore(history: string): { score: number; reason: string } {
  if (!history || history.trim() === '' || history.toLowerCase() === 'none') {
    return { score: 0, reason: 'No relevant medical history: Standard protocol - 0 points' };
  }

  const lowerHistory = history.toLowerCase();
  let score = 0;
  const reasons: string[] = [];

  const criticalConditions = ['heart disease', 'cardiac', 'cancer', 'hiv', 'aids', 'transplant', 'dialysis'];
  for (const condition of criticalConditions) {
    if (lowerHistory.includes(condition)) {
      score += 15;
      reasons.push(`Serious condition (${condition})`);
    }
  }

  const chronicConditions = ['diabetes', 'hypertension', 'asthma', 'copd', 'kidney', 'liver'];
  for (const condition of chronicConditions) {
    if (lowerHistory.includes(condition)) {
      score += 8;
      reasons.push(`Chronic condition (${condition})`);
    }
  }

  if (lowerHistory.includes('surgery') || lowerHistory.includes('medication')) {
    score += 5;
    reasons.push('Recent treatment history');
  }

  if (reasons.length === 0) {
    return { score: 3, reason: 'Medical history noted: Standard monitoring - 3 points' };
  }

  return {
    score: Math.min(score, 25),
    reason: `${reasons.join(', ')}: Higher monitoring needed - ${Math.min(score, 25)} points`
  };
}

function determineSeverityLevel(totalScore: number): SeverityLevel {
  if (totalScore >= 80) return 'critical';
  if (totalScore >= 50) return 'high';
  if (totalScore >= 25) return 'moderate';
  return 'low';
}
