import React, { useState } from 'react';
import { 
  Building2, 
  Map, 
  Plus, 
  Save, 
  Settings, 
  Trash2, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type AdminTab = 'create-job' | 'specs';
type MaterialType = 'soil' | 'asphalt' | 'concrete' | 'grout';

interface LocationSpec {
  id: string;
  name: string;
  // Soil/Asphalt
  minCompaction?: number;
  maxCompaction?: number;
  minMoisture?: number;
  maxMoisture?: number;
  // Concrete/Grout
  minPsi?: number;
}

// Mock Jobs
const JOBS = [
  { id: 'J-24-101', name: 'Highway 101 Extension' },
  { id: 'J-24-105', name: 'Downtown Plaza Foundation' },
];

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('create-job');

  // Create Job State
  const [jobName, setJobName] = useState('');
  const [jobNumber, setJobNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [address, setAddress] = useState('');
  const [mapsLink, setMapsLink] = useState('');

  // Specs State
  const [selectedJob, setSelectedJob] = useState(JOBS[0].id);
  const [specMaterial, setSpecMaterial] = useState<MaterialType>('soil');
  const [locations, setLocations] = useState<LocationSpec[]>([
    { id: '1', name: 'Building Pad', minCompaction: 95, minMoisture: -2, maxMoisture: 2 }
  ]);

  const handleSaveJob = () => {
    const newId = `J-24-${Math.floor(Math.random() * 1000)}`;
    alert(`Job Created! ID: ${newId}`);
    // Reset
    setJobName('');
    setJobNumber('');
    setClientName('');
    setAddress('');
    setMapsLink('');
  };

  const handleAddLocation = () => {
    if (locations.length >= 50) {
      alert("Maximum of 50 locations allowed.");
      return;
    }
    const newLoc: LocationSpec = {
      id: Date.now().toString(),
      name: '',
      minCompaction: 95,
      minMoisture: -2,
      maxMoisture: 2,
      minPsi: 3000
    };
    setLocations([...locations, newLoc]);
  };

  const removeLocation = (id: string) => {
    setLocations(locations.filter(l => l.id !== id));
  };

  const updateLocation = (id: string, field: keyof LocationSpec, value: any) => {
    setLocations(locations.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const handleSaveSpecs = () => {
    alert(`Specifications saved for ${selectedJob} (${specMaterial})`);
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
              <h1 className="text-2xl font-bold text-slate-900">Project Admin</h1>
              <p className="text-slate-500 text-sm">Manage projects and technical specifications.</p>
            </div>
          </div>
          
          <div className="bg-slate-100 p-1 rounded-xl flex w-full md:w-auto">
            <button
              onClick={() => setActiveTab('create-job')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'create-job' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Building2 size={16} />
              Create Job
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'specs' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Settings size={16} />
              Specifications
            </button>
          </div>
        </div>
      </div>

      {/* CREATE JOB VIEW */}
      {activeTab === 'create-job' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Building2 size={18} className="text-slate-500" />
                Project Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Job Number</label>
                  <input 
                    type="text" 
                    value={jobNumber}
                    onChange={e => setJobNumber(e.target.value)}
                    placeholder="e.g. 24-1050"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-slate-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Job Name</label>
                  <input 
                    type="text" 
                    value={jobName}
                    onChange={e => setJobName(e.target.value)}
                    placeholder="Project Title"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-slate-500 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Client Name</label>
                  <input 
                    type="text" 
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="Client / Developer"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-slate-500 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Site Address</label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="123 Construction Way, City, State"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-slate-500 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Google Maps Link</label>
                  <div className="relative">
                    <Map className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      value={mapsLink}
                      onChange={e => setMapsLink(e.target.value)}
                      placeholder="https://maps.google.com/..."
                      className="w-full pl-9 p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-slate-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 sticky top-20">
              <button
                onClick={handleSaveJob}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-semibold shadow-md transition-all active:scale-[0.98]"
              >
                <Save size={20} />
                Create Project
              </button>
              <p className="text-xs text-slate-400 text-center">
                A unique Job ID will be generated automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SPECIFICATIONS VIEW */}
      {activeTab === 'specs' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
          {/* Controls */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Select Project</label>
                <select 
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-slate-500 outline-none"
                >
                  {JOBS.map(job => (
                    <option key={job.id} value={job.id}>{job.id} - {job.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Material Type</label>
                <div className="flex bg-slate-100 p-1 rounded-lg overflow-x-auto">
                  {['soil', 'asphalt', 'concrete', 'grout'].map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setSpecMaterial(m as MaterialType);
                        // Reset mock locations for demo feeling
                        setLocations([]);
                      }}
                      className={`flex-1 px-3 py-1.5 rounded text-xs font-semibold transition-all capitalize whitespace-nowrap ${
                        specMaterial === m
                          ? 'bg-white text-slate-900 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {m === 'asphalt' ? 'Bituminous' : m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Location List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-semibold text-slate-900">Locations & Targets</h3>
                <span className="text-xs text-slate-400">{locations.length} / 50 Locations</span>
              </div>

              {locations.length === 0 && (
                 <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                   <p>No locations defined for this material yet.</p>
                 </div>
              )}

              {locations.map((loc, index) => (
                <div key={loc.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-4">
                      <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Location Name</label>
                      <input 
                        type="text" 
                        value={loc.name}
                        onChange={e => updateLocation(loc.id, 'name', e.target.value)}
                        placeholder="e.g. Parking Lot A"
                        className="w-full p-2 bg-white border border-slate-200 rounded text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                      />
                    </div>

                    {(specMaterial === 'soil' || specMaterial === 'asphalt') && (
                      <>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Min Comp %</label>
                          <input 
                            type="number" 
                            value={loc.minCompaction}
                            onChange={e => updateLocation(loc.id, 'minCompaction', parseFloat(e.target.value))}
                            className="w-full p-2 bg-white border border-slate-200 rounded text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Max Comp %</label>
                          <input 
                            type="number" 
                            value={loc.maxCompaction} // Optional usually
                            onChange={e => updateLocation(loc.id, 'maxCompaction', parseFloat(e.target.value))}
                            placeholder="-"
                            className="w-full p-2 bg-white border border-slate-200 rounded text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                          />
                        </div>
                      </>
                    )}

                    {specMaterial === 'soil' && (
                      <>
                         <div className="md:col-span-2">
                          <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Min Moist %</label>
                          <input 
                            type="number" 
                            value={loc.minMoisture}
                            onChange={e => updateLocation(loc.id, 'minMoisture', parseFloat(e.target.value))}
                            className="w-full p-2 bg-white border border-slate-200 rounded text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                          />
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Max</label>
                          <input 
                            type="number" 
                            value={loc.maxMoisture}
                            onChange={e => updateLocation(loc.id, 'maxMoisture', parseFloat(e.target.value))}
                            className="w-full p-2 bg-white border border-slate-200 rounded text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                          />
                        </div>
                      </>
                    )}

                    {(specMaterial === 'concrete' || specMaterial === 'grout') && (
                      <div className="md:col-span-3">
                          <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Min Strength (PSI)</label>
                          <input 
                            type="number" 
                            value={loc.minPsi}
                            onChange={e => updateLocation(loc.id, 'minPsi', parseFloat(e.target.value))}
                            className="w-full p-2 bg-white border border-slate-200 rounded text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                          />
                        </div>
                    )}

                    <div className="md:col-span-1 flex justify-end pb-1">
                      <button 
                        onClick={() => removeLocation(loc.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors bg-white border border-slate-200 rounded-lg shadow-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={handleAddLocation}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-medium hover:border-brand-400 hover:text-brand-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Add Location Specification
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={handleSaveSpecs}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all"
              >
                <Save size={18} />
                Save Specifications
              </button>
            </div>

          </section>
        </div>
      )}
    </div>
  );
};

export default Admin;