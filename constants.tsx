import { 
  Activity, 
  Beaker, 
  ClipboardCheck, 
  FileText, 
  FlaskConical, 
  HardHat 
} from 'lucide-react';
import { AppModule } from './types';

export const APP_NAME = "FieldOps Pro";

export const MODULES: AppModule[] = [
  {
    id: 'density',
    name: 'Density Testing',
    description: 'Record soil compaction and nuclear gauge readings.',
    icon: Activity, // Using Activity as a proxy for density waves
    path: '/density',
    color: 'text-amber-600',
    bgGradient: 'from-amber-50 to-amber-100 border-amber-200',
  },
  {
    id: 'sampling',
    name: 'Sampling',
    description: 'Log material samples, tags, and chain of custody.',
    icon: FlaskConical,
    path: '/sampling',
    color: 'text-emerald-600',
    bgGradient: 'from-emerald-50 to-emerald-100 border-emerald-200',
  },
  {
    id: 'activities',
    name: 'Activities',
    description: 'Daily field logs, timesheets, and site observations.',
    icon: HardHat,
    path: '/activities',
    color: 'text-blue-600',
    bgGradient: 'from-blue-50 to-blue-100 border-blue-200',
  },
  {
    id: 'admin',
    name: 'Project Admin',
    description: 'Manage project details, contacts, and contracts.',
    icon: FileText,
    path: '/admin',
    color: 'text-slate-600',
    bgGradient: 'from-slate-50 to-slate-100 border-slate-200',
  },
  {
    id: 'lims',
    name: 'LIMS',
    description: 'Laboratory Information Management System access.',
    icon: Beaker,
    path: '/lims',
    color: 'text-purple-600',
    bgGradient: 'from-purple-50 to-purple-100 border-purple-200',
  },
  {
    id: 'review',
    name: 'Review',
    description: 'QA/QC approval workflows and final report checks.',
    icon: ClipboardCheck,
    path: '/review',
    color: 'text-rose-600',
    bgGradient: 'from-rose-50 to-rose-100 border-rose-200',
  },
];