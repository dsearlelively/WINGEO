import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Copy, 
  RotateCcw, 
  Beaker, 
  CalendarDays,
  MapPin,
  Truck,
  Thermometer,
  CheckSquare,
  Plus,
  Trash2,
  ArrowLeft,
  FileDigit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';

type MaterialCategory = 'soil' | 'asphalt' | 'concrete' | 'grout' | 'other';

// Mock Data
const JOBS = [
  { id: 'J-24-101', name: 'Highway 101 Extension' },
  { id: 'J-24-105', name: 'Downtown Plaza Foundation' },
  { id: 'J-24-200', name: 'Airport Runway Resurfacing' },
];

interface BreakScheduleItem {
  days: number;
  count: number;
}

const Sampling: React.FC = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Global State
  const [material, setMaterial] = useState<MaterialCategory>('soil');
  const [jobId, setJobId] = useState(JOBS[0].id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sampleId, setSampleId] = useState('S-24-1042'); // Mock auto-gen ID
  
  // Common Fields
  const [source, setSource] = useState('');
  const [location, setLocation] = useState('');
  const [materialType, setMaterialType] = useState('');
  
  // Soil/Asphalt Specific
  const [color, setColor] = useState('');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  // Concrete/Grout Specific
  const [supplier, setSupplier] = useState('');
  const [mixDesign, setMixDesign] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [truckNumber, setTruckNumber] = useState('');
  const [batchTime, setBatchTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [emptyTime, setEmptyTime] = useState('');
  const [airTemp, setAirTemp] = useState('');
  const [materialTemp, setMaterialTemp] = useState('');
  const [slump, setSlump] = useState('');
  const [sampleTime, setSampleTime] = useState('');
  const [castTime, setCastTime] = useState('');
  
  const [breakSchedule, setBreakSchedule] = useState<BreakScheduleItem[]>([
    { days: 7, count: 1 },
    { days: 28, count: 3 }
  ]);

  // Reset defaults when material changes
  useEffect(() => {
    // Reset lists or specific fields if needed
    if (material === 'concrete') {
      setBreakSchedule([
        { days: 7, count: 1 },
        { days: 28, count: 3 }
      ]);
    } else if (material === 'grout') {
      setBreakSchedule([
        { days: 7, count: 1 },
        { days: 28, count: 2 } // Grout often 1 cube/prism per age or 3 cubes per age
      ]);
    }
    setSelectedTests([]);
  }, [material]);

  const handleTestToggle = (test: string) => {
    if (selectedTests.includes(test)) {
      setSelectedTests(selectedTests.filter(t => t !== test));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const updateBreakSchedule = (index: number, field: keyof BreakScheduleItem, value: number) => {
    const newSchedule = [...breakSchedule];
    newSchedule[index][field] = value;
    setBreakSchedule(newSchedule);
  };

  const addBreakItem = () => {
    setBreakSchedule([...breakSchedule, { days: 14, count: 1 }]);
  };

  const removeBreakItem = (index: number) => {
    setBreakSchedule(breakSchedule.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    alert(`Sample ${sampleId} Saved!`);
    // In real app: Save to Firestore
  };

  const handleCopyLast = () => {
    // Keep Job, Date, Supplier, Mix
    setSampleId(`S-24-${Math.floor(Math.random() * 1000) + 1000}`);
    setTicketNumber('');
    setTruckNumber('');
    setSampleTime('');
    setCastTime('');
    setLocation(''); 
    alert('Previous generic data copied to new form.');
  };

  const handleNew = () => {
    // Reset all non-global
    setSource('');
    setLocation('');
    setTicketNumber('');
    setTruckNumber('');
    // ... reset others
    setSampleId(`S-24-${Math.floor(Math.random() * 1000) + 1000}`);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <button onClick={() => navigate('/')} className="md:hidden p-2 -ml-2 text-slate-500">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Sampling Log</h1>
              <p className="text-slate-500 text-sm">Record material samples and chain of custody.</p>
            </div>
          </div>
          
          {/* Material Selector */}
           <div className="overflow-x-auto pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex bg-slate-100 p-1 rounded-xl whitespace-nowrap">
              {['soil', 'asphalt', 'concrete', 'grout', 'other'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMaterial(m as MaterialCategory)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                    material === m
                      ? 'bg-white text-brand-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {m === 'soil' ? 'Soil/Agg' : m === 'asphalt' ? 'Bituminous' : m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN - INPUTS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. General Info */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <FileDigit size={18} className="text-brand-500" />
                Sample Identification
              </h3>
              <span className="text-xs font-mono bg-brand-50 text-brand-700 px-2 py-1 rounded border border-brand-100">
                ID: {sampleId}
              </span>
            </div>
           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Project</label>
                <select 
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  {JOBS.map(job => (
                    <option key={job.id} value={job.id}>{job.id} - {job.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Date Sampled</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Sampled By</label>
                <input 
                  type="text" 
                  value={user?.displayName || ''}
                  readOnly
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          {/* 2. Material Specific Data */}
          {(material === 'soil' || material === 'asphalt' || material === 'other') && (
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <MapPin size={18} className="text-brand-500" />
                Material Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                   <label className="block text-xs font-medium text-slate-500 mb-1">Material Source / Supplier</label>
                   <input 
                    type="text" 
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g. Quarry A, Pit 3, or ACME Concrete"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                   <label className="block text-xs font-medium text-slate-500 mb-1">Sample Location</label>
                   <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Stockpile, Sta 10+00, Truck #4"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1">Material Type / Class</label>
                   <input 
                    type="text" 
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value)}
                    placeholder="e.g. Class 5, Type B"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                {material === 'soil' && (
                   <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Color / Visual Desc.</label>
                    <input 
                      type="text" 
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="e.g. Reddish Brown Clay"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Checkboxes */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-medium text-slate-500 mb-3">Required Tests</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                   {material === 'soil' && [
                     'Proctor', 'Sieve Analysis', 'Wash 200', 'Atterberg/PI', 'Moisture'
                   ].map(test => (
                      <label key={test} className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedTests.includes(test)}
                          onChange={() => handleTestToggle(test)}
                          className="rounded text-brand-600 focus:ring-brand-500" 
                        />
                        <span className="text-sm text-slate-700">{test}</span>
                      </label>
                   ))}
                   {material === 'asphalt' && [
                     'Max Density', 'Rice (Gmm)', 'Binder Content', 'Gradation', 'Air Voids'
                   ].map(test => (
                      <label key={test} className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedTests.includes(test)}
                          onChange={() => handleTestToggle(test)}
                          className="rounded text-brand-600 focus:ring-brand-500" 
                        />
                        <span className="text-sm text-slate-700">{test}</span>
                      </label>
                   ))}
                   {material === 'other' && [
                     'Compaction', 'Chemical', 'Strength', 'Visual'
                   ].map(test => (
                      <label key={test} className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedTests.includes(test)}
                          onChange={() => handleTestToggle(test)}
                          className="rounded text-brand-600 focus:ring-brand-500" 
                        />
                        <span className="text-sm text-slate-700">{test}</span>
                      </label>
                   ))}
                </div>
              </div>
            </section>
          )}

          {/* 3. Concrete / Grout Specific Data */}
          {(material === 'concrete' || material === 'grout') && (
            <>
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Truck size={18} className="text-brand-500" />
                Batch & Placement Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1">Supplier</label>
                   <input type="text" value={supplier} onChange={e => setSupplier(e.target.value)} className="form-input w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500" placeholder="Supplier Name" />
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1">Mix Design ID</label>
                   <input type="text" value={mixDesign} onChange={e => setMixDesign(e.target.value)} className="form-input w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500" placeholder="e.g. 4000-EXT" />
                </div>
                 <div className="md:col-span-2">
                   <label className="block text-xs font-medium text-slate-500 mb-1">Placement Location</label>
                   <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="form-input w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500" placeholder="e.g. Column Line A-4, 2nd Floor" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Ticket #</label>
                    <input type="text" value={ticketNumber} onChange={e => setTicketNumber(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Truck #</label>
                    <input type="text" value={truckNumber} onChange={e => setTruckNumber(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500" />
                  </div>
                </div>
              </div>
              
              {/* Times */}
              <div className="pt-2 border-t border-slate-100">
                 <label className="block text-xs font-medium text-slate-500 mb-2">Timing Log</label>
                 <div className="grid grid-cols-4 gap-2">
                   {['Batch', 'Arrival', 'Empty', 'Sample'].map((label) => (
                     <div key={label}>
                        <label className="block text-[10px] uppercase text-slate-400 mb-1">{label}</label>
                        <input type="time" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500" />
                     </div>
                   ))}
                 </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Thermometer size={18} className="text-brand-500" />
                Field Properties
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1">Air Temp (°F)</label>
                   <input type="number" value={airTemp} onChange={e => setAirTemp(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1">{material === 'concrete' ? 'Conc.' : 'Grout'} Temp (°F)</label>
                   <input type="number" value={materialTemp} onChange={e => setMaterialTemp(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1">Slump/Spread (in)</label>
                   <input type="number" step="0.25" value={slump} onChange={e => setSlump(e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                 <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1">Air Content (%)</label>
                   <input type="number" step="0.1" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Beaker size={18} className="text-brand-500" />
                  Break Schedule
                </h3>
                <button 
                  onClick={addBreakItem}
                  className="text-xs flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-700 transition-colors"
                >
                  <Plus size={14} /> Add Age
                </button>
              </div>
              
              <div className="space-y-2">
                {breakSchedule.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 bg-slate-50 p-2 rounded-lg">
                    <div className="flex-1 flex items-center gap-2">
                       <input 
                          type="number" 
                          value={item.days} 
                          onChange={e => updateBreakSchedule(index, 'days', parseInt(e.target.value))}
                          className="w-16 p-1.5 border border-slate-200 rounded text-center outline-none focus:ring-1 focus:ring-brand-500"
                        />
                       <span className="text-sm text-slate-500">Days</span>
                    </div>
                    <div className="flex-1 flex items-center gap-2 justify-end">
                       <span className="text-sm text-slate-500">Qty:</span>
                       <input 
                          type="number" 
                          value={item.count} 
                          onChange={e => updateBreakSchedule(index, 'count', parseInt(e.target.value))}
                          className="w-16 p-1.5 border border-slate-200 rounded text-center outline-none focus:ring-1 focus:ring-brand-500"
                        />
                    </div>
                    <button 
                      onClick={() => removeBreakItem(index)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-xs text-slate-400 text-right">
                Total Cylinders: {breakSchedule.reduce((acc, curr) => acc + curr.count, 0)}
              </div>
            </section>
            </>
          )}

        </div>

        {/* RIGHT COLUMN - ACTIONS */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 sticky top-20">
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold shadow-md transition-all active:scale-[0.98]"
            >
              <Save size={20} />
              Save Sample
            </button>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={handleCopyLast}
                className="flex flex-col items-center justify-center gap-1 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium transition-colors"
              >
                <Copy size={18} className="text-brand-600" />
                Copy Last
              </button>
              <button 
                onClick={handleNew}
                className="flex flex-col items-center justify-center gap-1 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium transition-colors"
              >
                <RotateCcw size={18} className="text-emerald-600" />
                New
              </button>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sample Summary</h4>
              <div className="text-sm space-y-1 text-slate-600">
                <p><span className="font-medium">Type:</span> <span className="capitalize">{material}</span></p>
                <p><span className="font-medium">ID:</span> {sampleId}</p>
                <p><span className="font-medium">Tests:</span> {selectedTests.length > 0 ? selectedTests.length : (material === 'concrete' ? 'Cylinders' : 'None')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sampling;