import { useState } from 'react';
import { PatientFormData } from '../types';
import { AlertCircle, ChevronDown } from 'lucide-react';

interface PatientFormProps {
  onSubmit: (data: PatientFormData) => void;
  onCancel: () => void;
}

const DURATION_OPTIONS = [
  'Less than 30 minutes',
  '30 minutes - 1 hour',
  '1-6 hours',
  '6-24 hours',
  '1-3 days',
  'More than 3 days',
];

export function PatientForm({ onSubmit, onCancel }: PatientFormProps) {
  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    age: '',
    symptoms: '',
    pain_level: 5,
    symptom_duration: '',
    medical_history: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PatientFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PatientFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Patient name is required';
    }

    if (formData.age === '' || formData.age < 0 || formData.age > 150) {
      newErrors.age = 'Please enter a valid age (0-150)';
    }

    if (!formData.symptoms.trim()) {
      newErrors.symptoms = 'Symptoms description is required';
    }

    if (!formData.symptom_duration) {
      newErrors.symptom_duration = 'Please select symptom duration';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof PatientFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">New Patient Registration</h2>
        <p className="text-teal-100 text-sm mt-1">Enter patient information to assign priority</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Patient Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all ${
                errors.name ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
              placeholder="Full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value === '' ? '' : Number(e.target.value))}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all ${
                errors.age ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
              placeholder="Years"
              min="0"
              max="150"
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.age}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Symptoms <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.symptoms}
              onChange={(e) => handleChange('symptoms', e.target.value)}
              rows={3}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none ${
                errors.symptoms ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
              placeholder="Describe the patient's symptoms in detail (e.g., chest pain, difficulty breathing, severe headache...)"
            />
            {errors.symptoms && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.symptoms}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Pain Level <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="10"
                value={formData.pain_level}
                onChange={(e) => handleChange('pain_level', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>1 (Minimal)</span>
                <span className={`font-semibold px-2 py-0.5 rounded ${
                  formData.pain_level >= 8 ? 'bg-red-100 text-red-700' :
                  formData.pain_level >= 5 ? 'bg-amber-100 text-amber-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {formData.pain_level}/10
                </span>
                <span>10 (Severe)</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Symptom Duration <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.symptom_duration}
                onChange={(e) => handleChange('symptom_duration', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all appearance-none bg-white ${
                  errors.symptom_duration ? 'border-red-300 bg-red-50' : 'border-slate-300'
                }`}
              >
                <option value="">Select duration</option>
                {DURATION_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            </div>
            {errors.symptom_duration && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.symptom_duration}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Medical History <span className="text-slate-400">(optional)</span>
            </label>
            <textarea
              value={formData.medical_history}
              onChange={(e) => handleChange('medical_history', e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none"
              placeholder="Any relevant medical history, chronic conditions, allergies, or current medications..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            Register Patient
          </button>
        </div>
      </form>
    </div>
  );
}
