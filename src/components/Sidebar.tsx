import { NavLink } from 'react-router';
import { FileText, Home, Shield, History, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

export function Sidebar() {
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: FileText, label: 'Documents', path: '/documents' },
    { icon: History, label: 'Compare', path: '/compare' },
    { icon: Shield, label: 'Privacy', path: '/privacy' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-full flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl">
            N
          </div>
          <span className="font-semibold text-lg text-white tracking-wide">NyayaLens AI</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
              isActive 
                ? "bg-white/10 text-white font-medium shadow-sm" 
                : "hover:bg-white/5 hover:text-slate-100"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-slate-800 rounded-xl p-4 text-xs space-y-2 border border-slate-700/50">
          <p className="font-medium text-slate-200">Legal Disclaimer</p>
          <p className="text-slate-400">NyayaLens AI provides informational analysis and is not a substitute for legal advice.</p>
        </div>
      </div>
    </aside>
  );
}
