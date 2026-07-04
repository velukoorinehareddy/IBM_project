import { useState, useEffect, useCallback } from 'react';
import { supabase, Patient } from './lib/supabase';
import { calculateSeverity } from './lib/severityCalculator';
import { PatientFormData } from './types';
import { PatientForm } from './components/PatientForm';
import { PatientQueue } from './components/PatientQueue';
import { PatientDetailsModal } from './components/PatientDetailsModal';
import { Header } from './components/Header';

function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchPatients = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error: fetchError } = await supabase
        .from('patients')
        .select('*')
        .eq('queue_date', today)
        .in('status', ['waiting', 'in_treatment'])
        .order('severity_score', { ascending: false })
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setPatients(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleSubmitPatient = async (formData: PatientFormData) => {
    try {
      setError(null);
      const { score, level, breakdown } = calculateSeverity(
        Number(formData.age),
        formData.pain_level,
        formData.symptoms,
        formData.symptom_duration,
        formData.medical_history
      );

      const today = new Date().toISOString().split('T')[0];

      const { data: existingPatients } = await supabase
        .from('patients')
        .select('token_number')
        .eq('queue_date', today)
        .not('token_number', 'is', null)
        .order('token_number', { ascending: true });

      const usedTokens = new Set((existingPatients || []).map(p => p.token_number));
      let tokenNumber = 1;
      while (usedTokens.has(tokenNumber)) {
        tokenNumber++;
      }

      const { error: insertError } = await supabase
        .from('patients')
        .insert({
          name: formData.name,
          age: Number(formData.age),
          symptoms: formData.symptoms,
          pain_level: formData.pain_level,
          symptom_duration: formData.symptom_duration,
          medical_history: formData.medical_history,
          severity_score: score,
          severity_level: level,
          token_number: tokenNumber,
          scoring_breakdown: breakdown,
          queue_date: today,
          status: 'waiting'
        });

      if (insertError) throw insertError;
      setShowForm(false);
      await fetchPatients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add patient');
    }
  };

  const handleUpdateStatus = async (patientId: string, newStatus: Patient['status']) => {
    try {
      const { error: updateError } = await supabase
        .from('patients')
        .update({ status: newStatus })
        .eq('id', patientId);

      if (updateError) throw updateError;

      if (newStatus === 'discharged') {
        setSelectedPatient(null);
      }
      await fetchPatients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update patient status');
    }
  };

  const handleReassignTokens = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data: waitingPatients } = await supabase
        .from('patients')
        .select('id, severity_score, created_at')
        .eq('queue_date', today)
        .eq('status', 'waiting')
        .order('severity_score', { ascending: false })
        .order('created_at', { ascending: true });

      if (!waitingPatients || waitingPatients.length === 0) return;

      const sortedPatients = [...waitingPatients].sort((a, b) => {
        if (b.severity_score !== a.severity_score) {
          return b.severity_score - a.severity_score;
        }
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });

      for (let i = 0; i < sortedPatients.length; i++) {
        await supabase
          .from('patients')
          .update({ token_number: i + 1 })
          .eq('id', sortedPatients[i].id);
      }

      await fetchPatients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reassign tokens');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header onAddPatient={() => setShowForm(true)} />

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="mb-8">
            <PatientForm
              onSubmit={handleSubmitPatient}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <PatientQueue
            patients={patients}
            onSelectPatient={setSelectedPatient}
            onUpdateStatus={handleUpdateStatus}
            onReassignTokens={handleReassignTokens}
          />
        )}
      </main>

      {selectedPatient && (
        <PatientDetailsModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}

export default App;
