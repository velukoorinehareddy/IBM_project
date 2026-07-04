import { Stethoscope, Plus, Users } from 'lucide-react';

interface HeaderProps {
  onAddPatient: () => void;
}

export function Header({ onAddPatient }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 p-2 rounded-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">MedTriage</h1>
              <p className="text-xs text-slate-500">Patient Priority System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
              <Users className="h-4 w-4" />
              <span>Priority-Based Queue</span>
            </div>

            <button
              onClick={onAddPatient}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Add Patient</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
