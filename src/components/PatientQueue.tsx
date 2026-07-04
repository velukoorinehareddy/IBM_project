import { Patient } from '../types';
import { RefreshCw, Clock, AlertTriangle, Users, CheckCircle, Activity } from 'lucide-react';

interface PatientQueueProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onUpdateStatus: (patientId: string, status: Patient['status']) => void;
  onReassignTokens: () => void;
}

function getSeverityConfig(level: Patient['severity_level']) {
  switch (level) {
    case 'critical':
      return {
        color: 'bg-red-500',
        textColor: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        label: 'CRITICAL',
      };
    case 'high':
      return {
        color: 'bg-orange-500',
        textColor: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        label: 'HIGH',
      };
    case 'moderate':
      return {
        color: 'bg-amber-500',
        textColor: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        label: 'MODERATE',
      };
    case 'low':
      return {
        color: 'bg-slate-500',
        textColor: 'text-slate-600',
        bgColor: 'bg-slate-50',
        borderColor: 'border-slate-200',
        label: 'LOW',
      };
  }
}

function getStatusConfig(status: Patient['status']) {
  switch (status) {
    case 'waiting':
      return { icon: Clock, color: 'text-slate-500', label: 'Waiting' };
    case 'in_treatment':
      return { icon: Activity, color: 'text-teal-600', label: 'In Treatment' };
    case 'discharged':
      return { icon: CheckCircle, color: 'text-green-600', label: 'Discharged' };
  }
}

export function PatientQueue({ patients, onSelectPatient, onUpdateStatus, onReassignTokens }: PatientQueueProps) {
  const waitingCount = patients.filter(p => p.status === 'waiting').length;
  const inTreatmentCount = patients.filter(p => p.status === 'in_treatment').length;
  const criticalCount = patients.filter(p => p.severity_level === 'critical' && p.status === 'waiting').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-2.5 rounded-lg">
              <Users className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{patients.length}</p>
              <p className="text-sm text-slate-500">Total in Queue</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-teal-50 p-2.5 rounded-lg">
              <Clock className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{waitingCount}</p>
              <p className="text-sm text-slate-500">Waiting</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2.5 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{inTreatmentCount}</p>
              <p className="text-sm text-slate-500">In Treatment</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 p-2.5 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
              <p className="text-sm text-slate-500">Critical</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Priority Queue</h2>
        <button
          onClick={onReassignTokens}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Reshuffle Tokens
        </button>
      </div>

      {patients.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-1">No patients in queue</h3>
          <p className="text-slate-500">Click "Add Patient" to register a new patient</p>
        </div>
      ) : (
        <div className="space-y-3">
          {patients.map((patient) => {
            const severityConfig = getSeverityConfig(patient.severity_level);
            const statusConfig = getStatusConfig(patient.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={patient.id}
                className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all hover:shadow-md cursor-pointer ${
                  patient.status === 'discharged' ? 'opacity-60' : ''
                } ${severityConfig.borderColor}`}
              >
                <div className={`h-1 ${severityConfig.color}`} />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${severityConfig.bgColor} flex flex-col items-center justify-center`}>
                        <span className="text-2xl font-bold text-slate-900">#{patient.token_number}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900">{patient.name}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${severityConfig.bgColor} ${severityConfig.textColor}`}>
                            {severityConfig.label}
                          </span>
                        </div>

                        <p className="text-sm text-slate-600 mt-1 line-clamp-1">{patient.symptoms}</p>

                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span>Age: {patient.age}</span>
                          <span>Pain: {patient.pain_level}/10</span>
                          <span className="flex items-center gap-1">
                            <StatusIcon className={`h-3.5 w-3.5 ${statusConfig.color}`} />
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {patient.status === 'waiting' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(patient.id, 'in_treatment');
                          }}
                          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Start Treatment
                        </button>
                      )}
                      {patient.status === 'in_treatment' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStatus(patient.id, 'discharged');
                          }}
                          className="px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Discharge
                        </button>
                      )}
                      <button
                        onClick={() => onSelectPatient(patient)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-lg transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
