import React, { useState } from 'react';
import { 
  Beaker, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Calendar,
  ArrowRight,
  ArrowLeft,
  TestTube
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type MaterialTab = 'concrete' | 'grout' | 'soil' | 'asphalt' | 'other';

// Mock Concrete Sample Data
interface Cylinder {
  id: string;
  age: number; // Days
  breakDate: string;
  psi: number | null;
  type: string; // 4x8, 6x12
}

interface ConcreteSample {
  id: string;
  jobId: string;
  castDate: string;
  designPsi: number;
  cylinders: Cylinder[];
  status: 'pending' | 'completed';
}

// Mock Data
const MOCK_CONCRETE_SAMPLES: ConcreteSample[] = [
  {
    id: 'S-24-1010',
    jobId: 'J-24-101',
    castDate: '2024-02-20',
    designPsi: 4000,
    status: 'pending',
    cylinders: [
      { id: 'C1', age: 7, breakDate: '2024-02-27', psi: 3200, type: '4x8' },
      { id: 'C2', age: 28, breakDate: '2024-03-19', psi: null, type: '4x8' },
      { id: 'C3', age: 28, breakDate: '2024-03-19', psi: null, type: '4x8' },
      { id: 'C4', age: 28, breakDate: '2024-03-19', psi: null, type: '4x8' },
    ]
  },
  {
    id: 'S-24-1015',
    jobId: 'J-24-105',
    castDate: '2024-02-25',
    designPsi: 5000,
    status: 'pending',
    cylinders: [
      { id: 'C1', age: 7, breakDate: '2024-03-03', psi: null, type: '4x8' },
      { id: 'C2', age: 28, breakDate: '2024-03-24', psi: null, type: '4x8' },
      { id: 'C3', age: 28, breakDate: '2024-03-24', psi: null, type: '4x8' },
    ]
  }
];

const LIMS: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MaterialTab>('concrete');
  const [samples, setSamples] = useState<ConcreteSample[]>(MOCK_CONCRETE_SAMPLES);
  const [expandedSampleId, setExpandedSampleId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handlePsiChange = (sampleId: string, cylinderId: string, val: string) => {
    const numVal = val === '' ? null : parseInt(val);
    setSamples(samples.map(s => {
      if (s.id !== sampleId) return s;
      const newCylinders = s.cylinders.map(c => c.id === cylinderId ? { ...c, psi: numVal } : c);
      
      // Check completion
      const allDone = newCylinders.every(c => c.psi !== null);
      return { ...s, cylinders: newCylinders, status: allDone ? 'completed' : 'pending' };
    }));
  };

  const getSoonestBreak = (s: ConcreteSample) => {
    const pending = s.cylinders.filter(c => c.psi === null);
    if (pending.length === 0) return 'Complete';
    // Simple sort by date
    pending.sort((a, b) => new Date(a.breakDate).getTime() - new Date(b.breakDate).getTime());
    return pending[0].breakDate;
  };

  const getStatusColor = (s: ConcreteSample) => {
    if (s.status === 'completed') return 'bg-emerald-100 text-emerald-800';
    
    // Check overdue
    const soonest = getSoonestBreak(s);
    if (soonest === 'Complete') return 'bg-emerald-100 text-emerald-800';
    
    const today = new Date().toISOString().split('T')[0];
    if (soonest < today) return 'bg-rose-100 text-rose-800';
    if (soonest === today) return 'bg-amber-100 text-amber-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
       {/* Header & Tab Switcher */}
       <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="md:hidden p-2 -ml-2 text-slate-500">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">LIMS</h1>
              <p className="text-slate-500 text-sm">Laboratory Information Management System.</p>
            </div>
          </div>
          
          <div className="overflow-x-auto pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
             <div className="flex bg-slate-100 p-1 rounded-xl whitespace-nowrap">
              {['concrete', 'grout', 'soil', 'asphalt'].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setActiveTab(m as MaterialTab);
                    setExpandedSampleId(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                    activeTab === m
                      ? 'bg-white text-purple-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {m === 'asphalt' ? 'Bituminous' : m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search Sample ID or Job..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
          />
        </div>
      </div>

      {/* CONTENT AREA */}
      {(activeTab === 'concrete' || activeTab === 'grout') ? (
        <div className="space-y-4">
          {samples.map(sample => (
            <div key={sample.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* SUMMARY ROW */}
              <div 
                className="p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer gap-4"
                onClick={() => setExpandedSampleId(expandedSampleId === sample.id ? null : sample.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${sample.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-purple-100 text-purple-600'}`}>
                    <Beaker size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{sample.id}</span>
                      <span className="text-xs text-slate-500 px-2 py-0.5 bg-slate-100 rounded-full">{sample.jobId}</span>
                    </div>
                    <div className="text-sm text-slate-500 mt-1 flex items-center gap-4">
                       <span className="flex items-center gap-1"><Calendar size={14} /> Cast: {sample.castDate}</span>
                       <span className="flex items-center gap-1"><TestTube size={14} /> {sample.designPsi} PSI</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                   <div className="text-right">
                      <div className="text-xs text-slate-400 uppercase font-bold">Next Break</div>
                      <div className="font-medium text-slate-800">{getSoonestBreak(sample)}</div>
                   </div>
                   <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(sample)}`}>
                      {sample.status}
                   </div>
                   <div className={`transform transition-transform ${expandedSampleId === sample.id ? 'rotate-90' : ''}`}>
                     <ArrowRight size={20} className="text-slate-400" />
                   </div>
                </div>
              </div>

              {/* EXPANDED BREAK LOG */}
              {expandedSampleId === sample.id && (
                <div className="bg-slate-50 border-t border-slate-200 p-4 md:p-6 animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {sample.cylinders.map((cyl) => {
                      const percent = cyl.psi ? ((cyl.psi / sample.designPsi) * 100).toFixed(1) : null;
                      const isPast = new Date(cyl.breakDate) < new Date() && !cyl.psi;
                      
                      return (
                        <div key={cyl.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <span className="block text-lg font-bold text-slate-900">{cyl.age}-Day</span>
                              <span className="text-xs text-slate-500">{cyl.breakDate}</span>
                            </div>
                            {isPast && <AlertCircle size={18} className="text-rose-500" />}
                            {cyl.psi && <CheckCircle2 size={18} className="text-emerald-500" />}
                          </div>
                          
                          <div className="space-y-3">
                             <div>
                               <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Break Strength (PSI)</label>
                               <input 
                                type="number" 
                                value={cyl.psi || ''}
                                onChange={(e) => handlePsiChange(sample.id, cyl.id, e.target.value)}
                                placeholder="Enter PSI"
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-purple-500 outline-none"
                               />
                             </div>
                             <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                <span className="text-xs text-slate-500">% Achieved</span>
                                <span className={`text-sm font-bold ${
                                  percent && parseFloat(percent) >= 100 ? 'text-emerald-600' : 'text-slate-700'
                                }`}>
                                  {percent ? `${percent}%` : '--'}
                                </span>
                             </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 flex justify-end gap-3">
                     <button className="text-sm text-slate-500 hover:text-slate-900 underline">Edit Break Schedule</button>
                     <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
                       Save Results
                     </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
          <TestTube size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">Lab Module for {activeTab.toUpperCase()}</h3>
          <p className="text-slate-500 max-w-md mx-auto mt-2">
            This section would contain forms for Proctor tests, Sieve Analysis, and Rice tests similar to the field modules but designed for lab technicians.
          </p>
           <button className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800">
            Add Lab Test Result
          </button>
        </div>
      )}
    </div>
  );
};

export default LIMS;