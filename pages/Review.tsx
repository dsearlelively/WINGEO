import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Lock, 
  Unlock, 
  CheckSquare, 
  Square, 
  ChevronDown, 
  ArrowLeft,
  MoreHorizontal,
  Paperclip,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';

type ReviewCategory = 'density' | 'sampling' | 'activities';
type DensityMaterial = 'soil' | 'asphalt';
type ReviewStatus = 'pending' | 'approved' | 'rejected';

// --- Mock Data Interfaces ---

interface DensityRecord {
  id: string;
  testNo: string;
  retestRef?: string; // If this is a retest of another
  date: string;
  location: string;
  elevation: string;
  result: number; // Dry for soil, Wet for asphalt
  moisture?: number; // Soil only
  status: ReviewStatus;
  material: DensityMaterial;
}

interface SampleRecord {
  id: string;
  sampleNo: string;
  date: string;
  location: string;
  type: 'concrete' | 'grout';
  cylinders: number;
  status: ReviewStatus;
}

interface ActivityRecord {
  id: string;
  type: 'dfr' | 'special';
  date: string;
  inspector: string;
  narrative: string;
  attachmentCount: number;
  status: ReviewStatus;
}

// --- Mock Data ---

const MOCK_DENSITY: DensityRecord[] = [
  { id: 'd1', testNo: '24-001', date: '2024-03-01', location: 'Building Pad, Grid A-1', elevation: '-2.0\'', result: 118.5, moisture: 8.2, status: 'approved', material: 'soil' },
  { id: 'd2', testNo: '24-002', date: '2024-03-01', location: 'Building Pad, Grid B-2', elevation: '-2.0\'', result: 110.2, moisture: 12.5, status: 'pending', material: 'soil' }, // Low density
  { id: 'd3', testNo: '24-003', retestRef: '24-002', date: '2024-03-02', location: 'Building Pad, Grid B-2 (Retest)', elevation: '-2.0\'', result: 119.0, moisture: 8.0, status: 'pending', material: 'soil' },
  { id: 'd4', testNo: '24-A01', date: '2024-03-05', location: 'Parking Lot Entrance', elevation: 'Lift 1', result: 144.5, status: 'approved', material: 'asphalt' },
  { id: 'd5', testNo: '24-A02', date: '2024-03-05', location: 'Parking Lot South', elevation: 'Lift 1', result: 145.2, status: 'pending', material: 'asphalt' },
];

const MOCK_SAMPLES: SampleRecord[] = [
  { id: 's1', sampleNo: 'S-24-101', date: '2024-03-10', location: 'Column Line 4', type: 'concrete', cylinders: 4, status: 'approved' },
  { id: 's2', sampleNo: 'S-24-102', date: '2024-03-11', location: 'Deck Pour Area B', type: 'concrete', cylinders: 5, status: 'pending' },
  { id: 's3', sampleNo: 'S-24-G01', date: '2024-03-12', location: 'CMU Wall North', type: 'grout', cylinders: 3, status: 'pending' },
];

const MOCK_ACTIVITIES: ActivityRecord[] = [
  { id: 'a1', type: 'dfr', date: '2024-03-01', inspector: 'Alex Field', narrative: 'Contractor began excavation of footings. Weather clear.', attachmentCount: 2, status: 'approved' },
  { id: 'a2', type: 'special', date: '2024-03-02', inspector: 'Alex Field', narrative: 'Rebar inspection for Spread Footings F1-F4. All clear.', attachmentCount: 5, status: 'pending' },
  { id: 'a3', type: 'dfr', date: '2024-03-03', inspector: 'Sarah Engineer', narrative: 'Heavy rain delay. Pump trucks sent back.', attachmentCount: 0, status: 'rejected' },
];

const Review: React.FC = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const isManager = user?.role === 'manager' || user?.role === 'admin';

  // State
  const [category, setCategory] = useState<ReviewCategory>('density');
  const [densityMaterial, setDensityMaterial] = useState<DensityMaterial>('soil');
  
  // Data State (Mocking local mutations)
  const [densityData, setDensityData] = useState(MOCK_DENSITY);
  const [sampleData, setSampleData] = useState(MOCK_SAMPLES);
  const [activityData, setActivityData] = useState(MOCK_ACTIVITIES);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  // Handlers
  const handleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleSelectAll = (ids: string[]) => {
    if (selectedIds.size === ids.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(ids));
    }
  };

  const handleStatusToggle = (id: string, currentStatus: ReviewStatus, type: 'density' | 'sample' | 'activity') => {
    const nextStatus = currentStatus === 'approved' ? 'pending' : 'approved';
    
    if (type === 'density') {
      setDensityData(prev => prev.map(d => d.id === id ? { ...d, status: nextStatus } : d));
    } else if (type === 'sample') {
      setSampleData(prev => prev.map(s => s.id === id ? { ...s, status: nextStatus } : s));
    } else {
      setActivityData(prev => prev.map(a => a.id === id ? { ...a, status: nextStatus } : a));
    }
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    if (selectedIds.size === 0) {
      alert('Please select items to export.');
      return;
    }
    alert(`Downloading ${selectedIds.size} records as ${format.toUpperCase()}...`);
  };

  const handleEditCell = (id: string, field: string, value: string) => {
    const numFields = ['result', 'moisture', 'cylinders'];
    const parsedValue = numFields.includes(field) ? (parseFloat(value) || 0) : value;

    if (category === 'density') {
       setDensityData(prev => prev.map(d => d.id === id ? { ...d, [field]: parsedValue } : d));
    } else if (category === 'sampling') {
       setSampleData(prev => prev.map(s => s.id === id ? { ...s, [field]: parsedValue } : s));
    }
  };

  // --- Render Helpers ---

  const renderStatusBadge = (status: ReviewStatus) => {
    const styles = {
      pending: 'bg-blue-100 text-blue-800 border-blue-200',
      approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      rejected: 'bg-rose-100 text-rose-800 border-rose-200',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  // --- Density View ---
  const renderDensityTable = () => {
    const filtered = densityData.filter(d => 
      d.material === densityMaterial && 
      (d.testNo.includes(search) || d.location.toLowerCase().includes(search.toLowerCase()))
    );
    const allIds = filtered.map(d => d.id);

    return (
      <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 bg-white">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <button onClick={() => handleSelectAll(allIds)} className="text-slate-400 hover:text-slate-600">
                  {selectedIds.size > 0 && selectedIds.size === allIds.length ? <CheckSquare size={20} /> : <Square size={20} />}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Test #</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-1/3">Location</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Elev.</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                {densityMaterial === 'soil' ? 'Dry Den.' : 'Wet Den.'}
              </th>
              {densityMaterial === 'soil' && (
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Moist %</th>
              )}
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map(item => (
              <tr key={item.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.has(item.id) ? 'bg-blue-50/50' : ''}`}>
                <td className="px-4 py-3">
                  <button onClick={() => handleSelect(item.id)} className={`text-slate-400 ${selectedIds.has(item.id) ? 'text-blue-600' : ''}`}>
                    {selectedIds.has(item.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>
                </td>
                <td className="px-4 py-3">{renderStatusBadge(item.status)}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">
                  {item.testNo}
                  {item.retestRef && <span className="block text-[10px] text-amber-600 font-normal">Retest of {item.retestRef}</span>}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{item.date}</td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {/* Editable Field */}
                  <input 
                    type="text" 
                    value={item.location} 
                    disabled={item.status === 'approved'}
                    onChange={(e) => handleEditCell(item.id, 'location', e.target.value)}
                    className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-brand-500 focus:outline-none px-1 py-0.5 rounded transition-colors disabled:opacity-70 disabled:hover:border-transparent"
                  />
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  <input 
                    type="text" 
                    value={item.elevation}
                    disabled={item.status === 'approved'}
                    onChange={(e) => handleEditCell(item.id, 'elevation', e.target.value)}
                    className="w-20 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-brand-500 focus:outline-none px-1 py-0.5 rounded transition-colors disabled:opacity-70 disabled:hover:border-transparent"
                  />
                </td>
                <td className="px-4 py-3 text-sm text-right font-mono text-slate-900">
                   <input 
                    type="number" 
                    step="0.1"
                    value={item.result}
                    disabled={item.status === 'approved'}
                    onChange={(e) => handleEditCell(item.id, 'result', e.target.value)}
                    className="w-20 text-right bg-transparent border-b border-transparent hover:border-slate-300 focus:border-brand-500 focus:outline-none px-1 py-0.5 rounded transition-colors disabled:opacity-70 disabled:hover:border-transparent"
                  />
                </td>
                {densityMaterial === 'soil' && (
                  <td className="px-4 py-3 text-sm text-right font-mono text-slate-900">
                    <input 
                      type="number" 
                      step="0.1"
                      value={item.moisture}
                      disabled={item.status === 'approved'}
                      onChange={(e) => handleEditCell(item.id, 'moisture', e.target.value)}
                      className="w-16 text-right bg-transparent border-b border-transparent hover:border-slate-300 focus:border-brand-500 focus:outline-none px-1 py-0.5 rounded transition-colors disabled:opacity-70 disabled:hover:border-transparent"
                    />
                  </td>
                )}
                <td className="px-4 py-3 text-center">
                  <button 
                    onClick={() => handleStatusToggle(item.id, item.status, 'density')}
                    title={item.status === 'approved' ? 'Unlock Record' : 'Lock/Approve'}
                    className={`p-2 rounded-full hover:bg-slate-200 transition-colors ${item.status === 'approved' ? 'text-emerald-600' : 'text-slate-400'}`}
                  >
                    {item.status === 'approved' ? <Lock size={16} /> : <Unlock size={16} />}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-slate-400">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // --- Sampling View ---
  const renderSamplingTable = () => {
    const filtered = sampleData.filter(s => s.sampleNo.includes(search) || s.location.toLowerCase().includes(search.toLowerCase()));
    const allIds = filtered.map(s => s.id);

    return (
      <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 bg-white">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 w-12">
                 <button onClick={() => handleSelectAll(allIds)} className="text-slate-400 hover:text-slate-600">
                  {selectedIds.size > 0 && selectedIds.size === allIds.length ? <CheckSquare size={20} /> : <Square size={20} />}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Sample ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-1/3">Placement Loc.</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Cylinders</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map(item => (
              <tr key={item.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.has(item.id) ? 'bg-blue-50/50' : ''}`}>
                <td className="px-4 py-3">
                   <button onClick={() => handleSelect(item.id)} className={`text-slate-400 ${selectedIds.has(item.id) ? 'text-blue-600' : ''}`}>
                    {selectedIds.has(item.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>
                </td>
                <td className="px-4 py-3">{renderStatusBadge(item.status)}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{item.sampleNo}</td>
                <td className="px-4 py-3 text-sm text-slate-600 capitalize">{item.type}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{item.date}</td>
                <td className="px-4 py-3 text-sm text-slate-600">
                   <input 
                    type="text" 
                    value={item.location}
                    disabled={item.status === 'approved'}
                    onChange={(e) => handleEditCell(item.id, 'location', e.target.value)}
                    className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-brand-500 focus:outline-none px-1 py-0.5 rounded transition-colors disabled:opacity-70 disabled:hover:border-transparent"
                  />
                </td>
                <td className="px-4 py-3 text-sm text-center text-slate-900 font-medium">
                   <input 
                    type="number" 
                    value={item.cylinders}
                    disabled={item.status === 'approved'}
                    onChange={(e) => handleEditCell(item.id, 'cylinders', e.target.value)}
                    className="w-16 text-center bg-transparent border-b border-transparent hover:border-slate-300 focus:border-brand-500 focus:outline-none px-1 py-0.5 rounded transition-colors disabled:opacity-70 disabled:hover:border-transparent"
                  />
                </td>
                <td className="px-4 py-3 flex items-center justify-center gap-2">
                  <button className="p-1.5 text-slate-500 hover:text-brand-600 rounded hover:bg-brand-50" title="Edit Lab Data">
                    <MoreHorizontal size={18} />
                  </button>
                  <button 
                    onClick={() => handleStatusToggle(item.id, item.status, 'sample')}
                    className={`p-1.5 rounded hover:bg-slate-200 ${item.status === 'approved' ? 'text-emerald-600' : 'text-slate-400'}`}
                  >
                    {item.status === 'approved' ? <Lock size={18} /> : <Unlock size={18} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // --- Activities View ---
  const renderActivitiesTable = () => {
    const filtered = activityData.filter(a => a.narrative.toLowerCase().includes(search.toLowerCase()) || a.inspector.toLowerCase().includes(search.toLowerCase()));
    const allIds = filtered.map(a => a.id);

    return (
      <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 bg-white">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 w-12">
                 <button onClick={() => handleSelectAll(allIds)} className="text-slate-400 hover:text-slate-600">
                  {selectedIds.size > 0 && selectedIds.size === allIds.length ? <CheckSquare size={20} /> : <Square size={20} />}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Inspector</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-1/3">Preview</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Attach.</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map(item => (
              <tr key={item.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.has(item.id) ? 'bg-blue-50/50' : ''}`}>
                <td className="px-4 py-3">
                  <button onClick={() => handleSelect(item.id)} className={`text-slate-400 ${selectedIds.has(item.id) ? 'text-blue-600' : ''}`}>
                    {selectedIds.has(item.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>
                </td>
                <td className="px-4 py-3">{renderStatusBadge(item.status)}</td>
                <td className="px-4 py-3 text-sm text-slate-900">{item.date}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-600 uppercase">{item.type}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{item.inspector}</td>
                <td className="px-4 py-3 text-sm text-slate-500 truncate max-w-xs" title={item.narrative}>
                  {item.narrative}
                </td>
                <td className="px-4 py-3 text-center text-sm text-slate-400">
                  {item.attachmentCount > 0 ? (
                    <span className="flex items-center justify-center gap-1 text-slate-600">
                      <Paperclip size={14} /> {item.attachmentCount}
                    </span>
                  ) : '-'}
                </td>
                <td className="px-4 py-3 flex items-center justify-center gap-2">
                   <button className="p-1.5 text-slate-500 hover:text-brand-600 rounded hover:bg-brand-50">
                    <Eye size={18} />
                  </button>
                   <button 
                    onClick={() => handleStatusToggle(item.id, item.status, 'activity')}
                    className={`p-1.5 rounded hover:bg-slate-200 ${item.status === 'approved' ? 'text-emerald-600' : 'text-slate-400'}`}
                  >
                    {item.status === 'approved' ? <Lock size={18} /> : <Unlock size={18} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
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
            <h1 className="text-2xl font-bold text-slate-900">Data Review</h1>
            <p className="text-slate-500 text-sm">QA/QC validation and reporting.</p>
          </div>
        </div>

        <div className="bg-slate-100 p-1 rounded-xl flex w-full md:w-auto">
          <button onClick={() => { setCategory('density'); setSelectedIds(new Set()); }} className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-sm font-semibold transition-all ${category === 'density' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Density</button>
          <button onClick={() => { setCategory('sampling'); setSelectedIds(new Set()); }} className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-sm font-semibold transition-all ${category === 'sampling' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Sampling</button>
          <button onClick={() => { setCategory('activities'); setSelectedIds(new Set()); }} className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-sm font-semibold transition-all ${category === 'activities' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Activities</button>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search records..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full md:w-64 pl-10 p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none shadow-sm"
            />
          </div>
          
          {/* Job Filter */}
          <div className="relative">
            <select className="w-full md:w-48 p-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-brand-500 outline-none shadow-sm appearance-none cursor-pointer">
              <option>All Projects</option>
              <option>J-24-101 Highway</option>
              <option>J-24-105 Plaza</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={18} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full lg:w-auto justify-end">
           {selectedIds.size > 0 && (
             <div className="flex gap-2 animate-in fade-in slide-in-from-right-4">
                <button 
                  onClick={() => handleExport('excel')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium shadow-sm"
                >
                  <FileSpreadsheet size={18} />
                  <span className="hidden sm:inline">Excel</span>
                </button>
                <button 
                  onClick={() => handleExport('pdf')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors font-medium shadow-sm"
                >
                  <FileText size={18} />
                  <span className="hidden sm:inline">PDF</span>
                </button>
             </div>
           )}
           <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium shadow-sm">
             <Filter size={18} />
             Filters
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="animate-in slide-in-from-bottom-2 duration-500">
        
        {category === 'density' && (
          <div className="space-y-4">
            {/* Sub-tabs for Density */}
            <div className="flex border-b border-slate-200">
              <button 
                onClick={() => setDensityMaterial('soil')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${densityMaterial === 'soil' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                Soil / Aggregate
              </button>
              <button 
                onClick={() => setDensityMaterial('asphalt')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${densityMaterial === 'asphalt' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                Bituminous
              </button>
            </div>
            {renderDensityTable()}
          </div>
        )}

        {category === 'sampling' && renderSamplingTable()}
        
        {category === 'activities' && renderActivitiesTable()}

      </div>

      {/* Footer Note */}
      <div className="text-center text-xs text-slate-400 pt-8">
        {selectedIds.size} record(s) selected. {isManager ? 'You have approval privileges.' : 'View-only mode.'}
      </div>
    </div>
  );
};

export default Review;