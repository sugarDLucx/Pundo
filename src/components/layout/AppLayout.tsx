import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Receipt, Target, Settings, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';

export const AppLayout: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const signOut = useAuthStore((state) => state.signOut);

  return (
    <div className="flex h-screen bg-bg-color font-sans text-text-color">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-slate-200 dark:border-[#20201F] bg-white dark:bg-[#131313] md:flex">
        <div className="flex h-16 items-center border-b border-slate-200 dark:border-[#20201F] px-6">
          <h1 className="text-2xl font-bold tracking-tight text-primary">Pundo.</h1>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-100 dark:bg-[#20201F] text-primary"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#20201F] hover:text-slate-900 dark:hover:text-white"
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-200 dark:border-[#20201F] p-4">
          <button 
            onClick={() => signOut()}
            className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#20201F] hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile Header (TODO: Add hamburger menu) */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center border-b border-slate-200 dark:border-[#20201F] bg-white dark:bg-[#131313] px-4 md:hidden">
          <span className="text-xl font-bold text-primary">Pundo.</span>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
          <div className="mx-auto max-w-container-max">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
