import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Copy, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Calculator, 
  FileText,
  ArrowLeft,
  History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';

type MaterialType = 'soil' | 'asphalt';

interface TestRecord {
  id: string;
  testNumber: string;
  date: string;
  jobId: string;
  inspector: string;
  materialType: MaterialType;
  location: string;
  elevation: string;
  gaugeNumber: string;
  proctorId: string;
  wetDensity: number;
  moistureContent: number;
  dryDensity: number;
  compaction: number;
  isRetest: boolean;
  originalTestId?: string;
  status: 'pass' | 'fail';
}

// Mock Data for Dropdowns
const JOBS = [
  { id: 'J-24-101', name: 'Highway 101 Extension' },
  { id: 'J-24-105', name: 'Downtown Plaza Foundation' },
  { id: 'J-24-200', name: 'Airport Runway Resurfacing' },
];

const PROCTORS = {
  soil: [
    { id: 'P-1', name: 'Red Clay Fill', maxDryDensity: 115.5, optimumMoisture: 14.5 },
    { id: 'P-2', name: 'Structural Fill (Sand)', maxDryDensity: 122.0, optimumMoisture: 10.5 },
    { id: 'P-3', name: 'Base Course', maxDryDensity: 135.0, optimumMoisture: 6.5 },
  ],
  asphalt: [
    { id: 'M-1', name: 'Surface Course (Type A)', targetDensity: 145.0 },
    { id: 'M-2', name: 'Binder Course', targetDensity: 148.5 },
  ]
};

const DensityTesting: React.FC = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  // Form State
  const [materialType, setMaterialType] = useState<MaterialType>('soil');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [jobId, setJobId] = useState(JOBS[0].id);
  const [inspector, setInspector] = useState(user?.displayName || '');
  const [gaugeNumber, setGaugeNumber] = useState('NDG-04');
  const [proctorId, setProctorId] = useState('');
  
  // Test Data State
  const [location, setLocation] = useState('');
  const [elevation, setElevation] = useState('');
  const [wetDensity, setWetDensity] = useState<string>('');
  const [moistureContent, setMoistureContent] = useState<string>('');
  
  // Retest State
  const [isRetest, setIsRetest] = useState(false);
  const [originalTestId, setOriginalTestId] = useState('');

  // Calculation Results
  const [results, setResults] = useState({
    dryDensity: 0,
    compaction: 0,
    passing: false,
    hasCalculated: false
  });

  const [lastSavedTest, setLastSavedTest] = useState<TestRecord | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Effect to reset proctor when material changes
  useEffect(() => {
    setProctorId(PROCTORS[materialType][0].id);
    setWetDensity('');
    setMoistureContent('');
    setResults({ ...results, hasCalculated: false });
  }, [materialType]);

  // Real-time Calculation
  useEffect(() => {
    calculate();
  }, [wetDensity, moistureContent, proctorId, materialType]);

  const calculate = () => {
    const wet = parseFloat(wetDensity);
    const moist = parseFloat(moistureContent);
    
    if (isNaN(wet) || (materialType === 'soil' && isNaN(moist))) {
      setResults({ ...results, hasCalculated: false });
      return;
    }

    let dry = 0;
    let comp = 0;
    let passing = false;

    if (materialType === 'soil') {
      const selectedProctor = PROCTORS.soil.find(p => p.id === proctorId);
      if (selectedProctor) {
        // Standard Formula: Dry Density = Wet / (1 + M/100)
        dry = wet / (1 + (moist / 100));
        comp = (dry / selectedProctor.maxDryDensity) * 100;
        // Pass if >= 95% (Mock rule) and Moisture within +/- 2% of optimum
        const moistDiff = Math.abs(moist - selectedProctor.optimumMoisture);
        passing = comp >= 95 && moistDiff <= 3.0; 
      }
    } else {
      const selectedMix = PROCTORS.asphalt.find(m => m.id === proctorId);
      if (selectedMix) {
        // Asphalt: Compaction = Wet / Target
        dry = wet; // Dry density concept doesn't apply the same way, but we use the variable
        comp = (wet / selectedMix.targetDensity) * 100;
        passing = comp >= 92 && comp <= 97; // Typical asphalt spec
      }
    }

    setResults({
      dryDensity: dry,
      compaction: comp,
      passing,
      hasCalculated: true
    });
  };

  const handleSave = () => {
    if (!results.hasCalculated) return;

    const newTest: TestRecord = {
      id: `T-${Date.now()}`,
      testNumber: `24-${Math.floor(Math.random() * 1000)}`,
      date,
      jobId,
      inspector,
      materialType,
      location,
      elevation,
      gaugeNumber,
      proctorId,
      wetDensity: parseFloat(wetDensity),
      moistureContent: parseFloat(moistureContent) || 0,
      dryDensity: results.dryDensity,
      compaction: results.compaction,
      isRetest,
      originalTestId: isRetest ? originalTestId : undefined,
      status: results.passing ? 'pass' : 'fail'
    };

    // Mock Save
    console.log("Saving to Firestore:", newTest);
    setLastSavedTest(newTest);
    setShowSuccess(true);
    
    // Auto-hide success message
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCopyLast = () => {
    if (!lastSavedTest) return;
    setLocation(lastSavedTest.location); // Usually nearby
    setElevation(lastSavedTest.elevation);
    // Keep job, inspector, date, proctor same
    setWetDensity('');
    setMoistureContent('');
    setIsRetest(false);
    setOriginalTestId('');
    setResults({ ...results, hasCalculated: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNew = () => {
    setLocation('');
    setElevation('');
    setWetDensity('');
    setMoistureContent('');
    setIsRetest(false);
    setOriginalTestId('');
    setResults({ ...results, hasCalculated: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getActiveProctorName = () => {
    if (materialType === 'soil') {
      const p = PROCTORS.soil.find(x => x.id === proctorId);
      return p ? `${p.name} (MDD: ${p.maxDryDensity})` : '';
    } else {
      const p = PROCTORS.asphalt.find(x => x.id === proctorId);
      return p ? `${p.name} (Target: ${p.targetDensity})` : '';
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="md:hidden p-2 -ml-2 text-slate-500">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Density Testing</h1>
            <p className="text-slate-500 text-sm">Enter nuclear gauge readings and calculate compaction.</p>
          </div>
        </div>
        
        {/* Material Toggle */}
        <div className="bg-slate-100 p-1 rounded-xl flex w-full md:w-auto">
          <button
            onClick={() => setMaterialType('soil')}
            className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              materialType === 'soil' 
                ? 'bg-white text-brand-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Soil / Agg
          </button>
          <button
            onClick={() => setMaterialType('asphalt')}
            className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              materialType === 'asphalt' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Bituminous
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN - INPUTS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Job & Inspector Info */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <FileText size={18} className="text-brand-500" />
              Project & Inspector
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Project</label>
                <select 
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                >
                  {JOBS.map(job => (
                    <option key={job.id} value={job.id}>{job.id} - {job.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Inspector</label>
                <input 
                  type="text" 
                  value={inspector}
                  onChange={(e) => setInspector(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Gauge #</label>
                <input 
                  type="text" 
                  value={gaugeNumber}
                  onChange={(e) => setGaugeNumber(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* 2. Test Setup */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Calculator size={18} className="text-brand-500" />
              Test Configuration
            </h3>
            
            {/* Retest Toggle */}
            <div className="flex items-center gap-3 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
               <div className="flex items-center h-5">
                <input
                  id="isRetest"
                  type="checkbox"
                  checked={isRetest}
                  onChange={(e) => setIsRetest(e.target.checked)}
                  className="w-4 h-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500"
                />
              </div>
              <div className="text-sm">
                <label htmlFor="isRetest" className="font-medium text-slate-900">Is this a Retest?</label>
                <p className="text-xs text-slate-500">Check if this test is replacing a previous failed test.</p>
              </div>
            </div>

            {isRetest && (
              <div className="mb-4 animate-in slide-in-from-top-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Original Test Number</label>
                <div className="relative">
                  <History className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={originalTestId}
                    onChange={(e) => setOriginalTestId(e.target.value)}
                    placeholder="e.g. 24-102"
                    className="w-full pl-9 p-2.5 bg-white border border-rose-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {materialType === 'soil' ? 'Standard Proctor' : 'Mix Design / Target'}
                </label>
                <select 
                  value={proctorId}
                  onChange={(e) => setProctorId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none shadow-sm"
                >
                  {(materialType === 'soil' ? PROCTORS.soil : PROCTORS.asphalt).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {materialType === 'soil' ? `${(p as any).maxDryDensity} pcf` : `${(p as any).targetDensity} pcf`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Location / Station</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Sta 10+50, 5' Rt CL"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Elevation / Lift</label>
                <input 
                  type="text" 
                  value={elevation}
                  onChange={(e) => setElevation(e.target.value)}
                  placeholder="e.g. -2.5' or Lift 3"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* 3. Readings */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Gauge Readings
              </h3>
              <span className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-500">Auto-Calculating</span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Wet Density (PCF)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={wetDensity}
                  onChange={(e) => setWetDensity(e.target.value)}
                  placeholder="0.0"
                  className="w-full p-4 text-xl font-mono bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-4 focus:ring-brand-100 focus:border-brand-500 outline-none transition-all"
                />
              </div>
              
              {materialType === 'soil' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Moisture (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={moistureContent}
                    onChange={(e) => setMoistureContent(e.target.value)}
                    placeholder="0.0"
                    className="w-full p-4 text-xl font-mono bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-4 focus:ring-brand-100 focus:border-brand-500 outline-none transition-all"
                  />
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN - RESULTS & ACTIONS */}
        <div className="space-y-6">
          
          {/* Live Results Card */}
          <div className={`
            rounded-2xl border shadow-lg overflow-hidden transition-all duration-300
            ${results.hasCalculated 
                ? (results.passing ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200') 
                : 'bg-slate-50 border-slate-200'
            }
          `}>
            <div className="p-6 text-center space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Compaction Results</h3>
              
              <div className="flex justify-center items-end gap-2">
                <span className={`text-6xl font-black tracking-tighter ${
                  results.hasCalculated 
                    ? (results.passing ? 'text-emerald-600' : 'text-rose-600') 
                    : 'text-slate-300'
                }`}>
                  {results.hasCalculated ? results.compaction.toFixed(1) : '--.-'}
                </span>
                <span className="text-2xl font-bold text-slate-400 mb-2">%</span>
              </div>

              {results.hasCalculated && (
                 <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${
                   results.passing ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'
                 }`}>
                   {results.passing ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                   {results.passing ? 'PASS' : 'FAIL'}
                 </div>
              )}
              
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-black/5 text-sm">
                 <div className="text-right pr-2 border-r border-black/5">
                    <div className="text-slate-500 text-xs">Dry Density</div>
                    <div className="font-mono font-semibold text-slate-700">
                      {results.hasCalculated ? results.dryDensity.toFixed(1) : '-'} pcf
                    </div>
                 </div>
                 <div className="text-left pl-2">
                    <div className="text-slate-500 text-xs">Standard</div>
                    <div className="font-mono font-semibold text-slate-700">
                      {materialType === 'soil' 
                        ? PROCTORS.soil.find(p => p.id === proctorId)?.maxDryDensity 
                        : PROCTORS.asphalt.find(p => p.id === proctorId)?.targetDensity
                      } pcf
                    </div>
                 </div>
              </div>
            </div>
            
            {/* Quick warning for moisture if soil */}
            {results.hasCalculated && materialType === 'soil' && !results.passing && results.compaction >= 95 && (
              <div className="bg-rose-100 p-3 text-center text-xs text-rose-800 font-medium">
                Compaction OK, but Moisture out of spec.
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 sticky top-20">
            <button
              onClick={handleSave}
              disabled={!results.hasCalculated}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold shadow-md transition-all active:scale-[0.98]"
            >
              <Save size={20} />
              Save Test
            </button>

            {showSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm flex items-center gap-2 animate-in zoom-in duration-300">
                <CheckCircle2 size={16} />
                Test saved successfully!
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={handleCopyLast}
                disabled={!lastSavedTest}
                className="flex flex-col items-center justify-center gap-1 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Copy size={18} className="text-brand-600" />
                Copy Last
              </button>
              <button 
                onClick={handleNew}
                className="flex flex-col items-center justify-center gap-1 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium transition-colors"
              >
                <RotateCcw size={18} className="text-emerald-600" />
                Clear / New
              </button>
            </div>
            
            <button className="w-full text-xs text-slate-400 hover:text-brand-600 mt-2 underline">
              Manage / Review Tests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DensityTesting;
