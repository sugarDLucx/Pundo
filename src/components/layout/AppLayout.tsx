import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Icon } from '../ui/Icon';
import { cn } from '../../lib/utils';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/', icon: 'dashboard' },
    { name: 'Transactions', href: '/transactions', icon: 'receipt_long' },
    { name: 'Goals', href: '/goals', icon: 'track_changes' },
    { name: 'Settings', href: '/settings', icon: 'settings' },
  ];

  const signOut = useAuthStore((state) => state.signOut);

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-md antialiased">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-surface-container-low bg-surface shadow-sm fixed left-0 top-0 h-screen z-20 md:flex">
        <div className="flex flex-col h-full py-6 px-4">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden shrink-0 flex items-center justify-center text-primary font-bold text-lg">
              {useAuthStore.getState().user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="font-headline-sm text-headline-sm font-bold text-primary">Pundo</h1>
              <p className="font-label-md text-label-md text-on-surface-variant">Wealth Manager</p>
            </div>
          </div>
          <nav className="flex-1 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-label-md text-label-md",
                    isActive
                      ? "text-primary font-bold border-r-4 border-primary bg-surface-container-high scale-[0.98]"
                      : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon name={item.icon} fill={isActive} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto pt-4 border-t border-surface-container-low">
            <button 
              onClick={() => signOut()}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors font-label-md text-label-md"
            >
              <Icon name="logout" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-1 flex-col overflow-hidden md:ml-64">
        <header className="flex h-16 items-center border-b border-surface-container-low bg-surface px-4 md:hidden">
          <span className="text-xl font-bold text-primary">Pundo</span>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-on-surface-variant hover:text-primary ml-auto"
          >
            <Icon name="menu" className="h-6 w-6" />
          </button>
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
