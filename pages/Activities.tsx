import React, { useState } from 'react';
import { 
  Save, 
  Copy, 
  FileText, 
  HardHat, 
  Camera, 
  Calendar,
  User as UserIcon,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Upload
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';

// Mock Data
const JOBS = [
  { id: 'J-24-101', name: 'Highway 101 Extension' },
  { id: 'J-24-105', name: 'Downtown Plaza Foundation' },
  { id: 'J-24-200', name: 'Airport Runway Resurfacing' },
];

const SPECIAL_TYPES = [
  'Reinforcing Steel / Tendons',
  'Masonry',
  'High Strength Bolting',
  'Structural Welding',
  'Fireproofing',
  'Epoxy Anchors',
  'Misc / Other'
];

type ActivityType = 'daily' | 'special';

const Activities: React.FC = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // State
  const [activeTab, setActiveTab] = useState<ActivityType>('daily');
  
  // Shared Fields
  const [jobId, setJobId] = useState(JOBS[0].id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [inspector, setInspector] = useState(user?.displayName || '');
  
  // DFR Fields
  const [narrative, setNarrative] = useState('');
  
  // Special Fields
  const [specialType, setSpecialType] = useState(SPECIAL_TYPES[0]);
  const [location, setLocation] = useState('');
  const [discrepancies, setDiscrepancies] = useState('');
  const [notes, setNotes] = useState('');
  const [plansStampedDate, setPlansStampedDate] = useState('');
  const [fileCount, setFileCount] = useState(0);

  const handleSave = () => {
    alert(`Activity Saved: ${activeTab === 'daily' ? 'Daily Report' : specialType}`);
    // In real app: Save to Firestore
  };

  const handleCopyLast = () => {
    // In real app, fetch last entry.
    // Mock behavior:
    setNarrative('Weather: Sunny, 72F. Contractor worked on footing excavation...');
    setLocation('Grid Line A-B');
    alert('Copied content from last entry.');
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
              <h1 className="text-2xl font-bold text-slate-900">Activity Log</h1>
              <p className="text-slate-500 text-sm">Daily reports and special inspection records.</p>
            </div>
          </div>
          
          <div className="bg-slate-100 p-1 rounded-xl flex w-full md:w-auto">
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'daily' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <FileText size={16} />
              Daily Report
            </button>
            <button
              onClick={() => setActiveTab('special')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'special' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <HardHat size={16} />
              Special Insp.
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: FORM CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Common Info */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Project</label>
                <select 
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {JOBS.map(job => (
                    <option key={job.id} value={job.id}>{job.id} - {job.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                <div className="relative">
                   <Calendar className="absolute left-3 top-2.5 text-slate-400" size={16} />
                   <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Inspector</label>
                 <div className="relative">
                   <UserIcon className="absolute left-3 top-2.5 text-slate-400" size={16} />
                   <input 
                    type="text" 
                    value={inspector}
                    onChange={(e) => setInspector(e.target.value)}
                    className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Daily Field Report Form */}
          {activeTab === 'daily' && (
             <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="font-semibold text-slate-900">Field Observations</h3>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Narrative / Comments</label>
                  <textarea 
                    rows={12}
                    value={narrative}
                    onChange={(e) => setNarrative(e.target.value)}
                    placeholder="Record site conditions, contractor activities, weather, visitors, and general observations..."
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
             </section>
          )}

          {/* Special Inspection Form */}
          {activeTab === 'special' && (
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-4">
               <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Inspection Details</h3>
                  <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded border border-orange-100">IBC Chapter 17</span>
               </div>

               <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Inspection Type</label>
                  <select 
                    value={specialType}
                    onChange={(e) => setSpecialType(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
                  >
                    {SPECIAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
               </div>

               <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Location / Area</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Grid Line 4-5, Level 2"
                      className="w-full pl-9 p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Plans Stamped Date</label>
                  <input 
                    type="date" 
                    value={plansStampedDate}
                    onChange={(e) => setPlansStampedDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
               </div>

               <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Discrepancies / Non-Compliance</label>
                  <div className="relative">
                    <AlertTriangle className="absolute left-3 top-3 text-rose-400" size={16} />
                    <textarea 
                      rows={3}
                      value={discrepancies}
                      onChange={(e) => setDiscrepancies(e.target.value)}
                      placeholder="Describe any non-conforming items..."
                      className="w-full pl-9 p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none resize-none"
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Other Notes</label>
                  <textarea 
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="General notes..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                  />
               </div>

               <div className="pt-4 border-t border-slate-100">
                 <label className="block text-xs font-medium text-slate-500 mb-2">Attachments / Photos</label>
                 <div 
                    onClick={() => setFileCount(c => c + 1)}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-brand-400 hover:text-brand-500 transition-all cursor-pointer"
                 >
                    <Camera size={32} className="mb-2" />
                    <span className="text-sm font-medium">Tap to add photos or files</span>
                    {fileCount > 0 && (
                      <span className="mt-2 text-xs bg-slate-900 text-white px-2 py-1 rounded-full">
                        {fileCount} files selected
                      </span>
                    )}
                 </div>
               </div>
            </section>
          )}
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 sticky top-20">
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold shadow-md transition-all active:scale-[0.98]"
            >
              <Save size={20} />
              Save {activeTab === 'daily' ? 'Report' : 'Inspection'}
            </button>

            <div className="grid grid-cols-1 gap-3 pt-2">
              <button 
                onClick={handleCopyLast}
                className="flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium transition-colors"
              >
                <Copy size={18} className="text-brand-600" />
                Copy Last Activity
              </button>
            </div>

             <button className="w-full text-xs text-slate-400 hover:text-brand-600 mt-2 underline text-center">
               View Activity History
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Activities;