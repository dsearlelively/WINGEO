import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MODULES } from '../constants';
import { ArrowRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1 mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Modules</h2>
        <p className="text-slate-500">Select a module to begin data entry or review.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {MODULES.map((module) => (
          <button
            key={module.id}
            onClick={() => navigate(module.path)}
            className={`
              group relative flex items-start p-6 rounded-2xl border transition-all duration-300
              bg-white hover:shadow-lg hover:-translate-y-1 text-left w-full
              ${module.bgGradient}
            `}
          >
            <div className={`
              p-3 rounded-xl bg-white shadow-sm mr-5 shrink-0
              ${module.color}
            `}>
              <module.icon size={28} strokeWidth={2} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                {module.name}
              </h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                {module.description}
              </p>
            </div>

            <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <ArrowRight className="text-slate-400" size={20} />
            </div>
          </button>
        ))}
      </div>

      {/* Quick Actions / Recent Activity Placeholder */}
      <div className="mt-10 pt-8 border-t border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Projects</h3>
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="flex flex-col">
                <span className="font-medium text-slate-900">Project #{202400 + i} - Highway Extension</span>
                <span className="text-xs text-slate-500">Last updated 2 hours ago</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;