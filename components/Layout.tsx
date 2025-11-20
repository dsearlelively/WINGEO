import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ChevronLeft, User as UserIcon } from 'lucide-react';
import { APP_NAME } from '../constants';
import { User } from '../types';
import { logout } from '../services/auth';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    onLogout();
    navigate('/login');
  };

  const isDashboard = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm h-16">
        <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            {!isDashboard && (
              <button 
                onClick={() => navigate('/')}
                className="p-1.5 -ml-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <h1 className="font-bold text-lg text-slate-800 tracking-tight hidden xs:block sm:block">
                {APP_NAME}
              </h1>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-sm font-medium text-slate-700">{user.displayName}</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">{user.role}</span>
              </div>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-md focus:outline-none transition-colors"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && user && (
        <div className="fixed inset-0 top-16 z-40 bg-slate-900/50 md:hidden" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="bg-white w-full p-4 shadow-xl border-b border-slate-200 flex flex-col gap-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="bg-slate-200 p-2 rounded-full">
                <UserIcon size={20} className="text-slate-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">{user.displayName}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>

            <div className="h-px bg-slate-100 my-1" />

            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-3 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 pb-20">
        {children}
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. Field Data Management.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;