import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import { Icon } from '../ui/Icon';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut, user } = useAuthStore();
  const { profile } = useProfileStore();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (profile?.language) {
      const i18nCode = profile.language === 'English (United States)' ? 'en' : profile.language === 'Spanish (Spain)' ? 'es' : 'fr';
      if (i18n.language !== i18nCode) {
        i18n.changeLanguage(i18nCode);
      }
    }
  }, [profile?.language, i18n]);

  const navItems = [
    { name: t('sidebar.dashboard', 'Dashboard'), href: '/', icon: 'dashboard' },
    { name: t('sidebar.transactions', 'Transactions'), href: '/transactions', icon: 'receipt_long' },
    { name: t('sidebar.goals', 'Goals'), href: '/goals', icon: 'track_changes' },
    { name: t('sidebar.settings', 'Settings'), href: '/settings', icon: 'settings' },
  ];

  // Parse First and Last Name
  const fullName = profile?.full_name || '';
  const nameParts = fullName.split(' ');
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : (fullName || user?.email?.split('@')[0] || 'User');
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-md antialiased">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-surface-container-low bg-surface/80 backdrop-blur-xl shadow-sm fixed left-0 top-0 h-screen z-20 md:flex">
        <div className="flex flex-col h-full py-6 px-4">
          <div className="flex items-center space-x-3 px-4 mb-10">
            <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-primary overflow-hidden shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Icon name="person" className="text-[24px]" />
              )}
            </div>
            <div className="overflow-hidden">
              <h1 className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight truncate" title={lastName}>{lastName}</h1>
              <p className="font-label-md text-label-md text-on-surface-variant truncate" title={firstName}>{firstName}</p>
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
              onClick={signOut}
              className="flex w-full items-center space-x-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-error-container/30 hover:text-error transition-colors font-body-md text-body-md mt-2"
            >
              <LogOut className="h-5 w-5" />
              <span>{t('sidebar.logout', 'Log out')}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <nav className="md:hidden w-full h-16 sticky top-0 z-40 bg-surface/80 backdrop-blur-xl shadow-sm flex justify-between items-center px-4 border-b border-surface-container-low">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-primary-container overflow-hidden shrink-0 flex items-center justify-center text-primary">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Icon name="person" className="text-[20px]" />
            )}
          </div>
          <div className="overflow-hidden">
            <span className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight truncate">{lastName}</span>
          </div>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Header (Hidden as we now use Mobile Navigation) */}
      <div className="flex flex-1 flex-col overflow-hidden md:ml-64">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mx-auto max-w-container-max"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
