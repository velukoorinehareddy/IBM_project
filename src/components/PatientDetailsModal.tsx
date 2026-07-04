import { Patient } from '../types';
import { X, Clock, AlertCircle, Activity, CheckCircle, User, Calendar, HeartPulse, FileText } from 'lucide-react';

interface PatientDetailsModalProps {
  patient: Patient;
  onClose: () => void;
  onUpdateStatus: (patientId: string, status: Patient['status']) => void;
}

function getSeverityConfig(level: Patient['severity_level']) {
  switch (level) {
    case 'critical':
      return { color: 'bg-red-500', textColor: 'text-red-600', bgColor: 'bg-red-50', label: 'CRITICAL' };
    case 'high':
      return { color: 'bg-orange-500', textColor: 'text-orange-600', bgColor: 'bg-orange-50', label: 'HIGH' };
    case 'moderate':
      return { color: 'bg-amber-500', textColor: 'text-amber-600', bgColor: 'bg-amber-50', label: 'MODERATE' };
    case 'low':
      return { color: 'bg-slate-500', textColor: 'text-slate-600', bgColor: 'bg-slate-100', label: 'LOW' };
  }
}

export function PatientDetailsModal({ patient, onClose, onUpdateStatus }: PatientDetailsModalProps) {
  const severityConfig = getSeverityConfig(patient.severity_level);
  const breakdown = patient.scoring_breakdown;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${severityConfig.color} px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white text-3xl font-bold">#{patient.token_number}</span>
              <span className="bg-white/20 text-white px-2 py-0.5 rounded text-sm font-semibold">
                {severityConfig.label}
              </span>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
          <h2 className="text-white text-xl font-semibold mt-2">{patient.name}</h2>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <User className="h-4 w-4" />
                  Age
                </div>
                <p className="text-2xl font-bold text-slate-900">{patient.age} years</p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <HeartPulse className="h-4 w-4" />
                  Pain Level
                </div>
                <p className="text-2xl font-bold text-slate-900">{patient.pain_level}/10</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                <FileText className="h-4 w-4" />
                Symptoms
              </div>
              <p className="text-slate-900">{patient.symptoms}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <Clock className="h-4 w-4" />
                  Duration
                </div>
                <p className="text-slate-900 font-medium">{patient.symptom_duration}</p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <Calendar className="h-4 w-4" />
                  Registered
                </div>
                <p className="text-slate-900 font-medium">
                  {new Date(patient.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {patient.medical_history && (
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <AlertCircle className="h-4 w-4" />
                  Medical History
                </div>
                <p className="text-slate-900">{patient.medical_history}</p>
              </div>
            )}

            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-teal-600" />
                Priority Scoring Breakdown
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Total Score: <span className="font-bold text-slate-900">{breakdown.total_score} points</span>
              </p>

              <div className="space-y-3">
                {[
                  { score: breakdown.age_score, reason: breakdown.age_reason },
                  { score: breakdown.pain_score, reason: breakdown.pain_reason },
                  { score: breakdown.symptom_score, reason: breakdown.symptom_reason },
                  { score: breakdown.duration_score, reason: breakdown.duration_reason },
                  { score: breakdown.history_score, reason: breakdown.history_reason },
                ].map((item, index) => (
                  <div key={index} className="bg-slate-50 rounded-lg p-3 flex items-start justify-between gap-4">
                    <p className="text-sm text-slate-700 flex-1">{item.reason}</p>
                    <span className="font-semibold text-slate-900 bg-white px-2 py-0.5 rounded">
                      +{item.score}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
                <p className="text-sm text-teal-800">
                  <span className="font-semibold">Final Classification:</span> Score of {breakdown.total_score} points
                  results in <span className="font-bold">{breakdown.final_level.toUpperCase()}</span> priority.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
              {patient.status === 'waiting' && (
                <button
                  onClick={() => onUpdateStatus(patient.id, 'in_treatment')}
                  className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
                >
                  Start Treatment
                </button>
              )}
              {patient.status === 'in_treatment' && (
                <button
                  onClick={() => onUpdateStatus(patient.id, 'discharged')}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  Discharge Patient
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
