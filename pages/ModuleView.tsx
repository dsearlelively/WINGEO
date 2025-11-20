import React from 'react';
import { useParams } from 'react-router-dom';
import { MODULES } from '../constants';
import { Construction, Plus, Search, Filter } from 'lucide-react';

const ModuleView: React.FC = () => {
  // In a real app, we'd use nested routes or separate components for each module.
  // For this demo structure, we determine the module from the path or passed props, 
  // but since we are using a single generic component in App.tsx for simplicity:
  
  const path = window.location.hash.replace('#', '');
  const activeModule = MODULES.find(m => m.path === path) || MODULES[0];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-slate-50 ${activeModule.color}`}>
            <activeModule.icon size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{activeModule.name}</h1>
            <p className="text-slate-500">{activeModule.description}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
             <Filter size={18} />
             Filter
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-md">
            <Plus size={18} />
            New Entry
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-brand-500 focus:border-brand-500 bg-white shadow-sm"
          placeholder={`Search ${activeModule.name} records...`}
        />
      </div>

      {/* Content Placeholder */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-slate-50 p-4 rounded-full mb-4">
          <Construction size={48} className="text-slate-300" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">Module Under Construction</h3>
        <p className="text-slate-500 max-w-md mt-2">
          This is a placeholder view for <strong>{activeModule.name}</strong>. 
          In the production environment, this would connect to the <code>{activeModule.id}</code> Firestore collection.
        </p>
        <div className="mt-8 w-full max-w-md space-y-3">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-slate-300 w-3/4 rounded-full"></div>
          </div>
           <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-slate-200 w-1/2 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleView;