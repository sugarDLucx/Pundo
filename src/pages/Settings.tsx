import React from 'react';
import { Card } from '../components/ui/Card';
import { useThemeStore } from '../store/themeStore';

export const Settings: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-on-surface">Settings</h1>
        <p className="mt-1 text-on-surface-variant">Manage your app preferences.</p>
      </div>

      <div className="max-w-2xl">
        <Card className="flex flex-col gap-6 p-6">
          <h3 className="text-xl font-semibold text-on-surface">Appearance</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-on-surface">Dark Mode</p>
              <p className="text-sm text-on-surface-variant mt-1">
                Toggle between light and dark themes.
              </p>
            </div>
            
            {/* Simple Toggle Switch */}
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDarkMode ? 'bg-primary' : 'bg-surface-container-highest'
              }`}
            >
              <span className="sr-only">Toggle dark mode</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
