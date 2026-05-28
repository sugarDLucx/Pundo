import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useProfileStore } from '../store/profileStore';
import { Icon } from '../components/ui/Icon';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

export const Settings: React.FC = () => {
  const { session, changePassword, fetchLoginHistory } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { profile, updateProfile, loading: profileLoading, uploadAvatar } = useProfileStore();
  const { t, i18n } = useTranslation();

  const [activeSection, setActiveSection] = useState('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Local state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('English (United States)');
  const [currency, setCurrency] = useState('₱');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Security state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone_number || '');
      setLanguage(profile.language || 'English (United States)');
      setCurrency(profile.currency || '₱');
      setEmailNotifs(profile.email_notifications ?? true);
    }
  }, [profile]);

  useEffect(() => {
    fetchLoginHistory();
  }, [fetchLoginHistory]);

  useEffect(() => {
    // Scrollspy Observer Setup
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      let active = '';
      let maxVisible = 0;
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxVisible) {
          active = entry.target.id;
          maxVisible = entry.intersectionRatio;
        }
      });
      if (active) setActiveSection(active);
    };
    
    observer.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    const sections = ['profile', 'security', 'notifications', 'preferences'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.current?.observe(el);
    });

    return () => {
      observer.current?.disconnect();
    };
  }, []);

  const handleScrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({
        full_name: fullName,
        phone_number: phone,
        language,
        currency,
        email_notifications: emailNotifs
      });
      alert(t('settings.saved', 'Settings saved successfully!'));
    } catch (e: any) {
      alert('Error saving settings: ' + e.message);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg(t('settings.password_mismatch', 'New passwords do not match.'));
      return;
    }
    try {
      await changePassword(oldPassword, newPassword);
      setPasswordMsg(t('settings.password_updated', 'Password updated successfully.'));
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      setPasswordMsg('Error updating password: ' + e.message);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingAvatar(true);
    try {
      await uploadAvatar(file);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    const i18nCode = newLang === 'English (United States)' ? 'en' : newLang === 'Spanish (Spain)' ? 'es' : 'fr';
    i18n.changeLanguage(i18nCode);
  };

  const menuItems = [
    { id: 'profile', label: 'Profile Information', icon: 'person' },
    { id: 'security', label: 'Security', icon: 'shield_lock' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications_active' },
    { id: 'preferences', label: 'Preferences', icon: 'tune' },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]">
      <header className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">{t('settings.title', 'Settings')}</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">{t('settings.subtitle', 'Manage your account preferences, security, and notifications.')}</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 flex-1 pb-32">
        <aside className="w-full lg:w-64 flex-shrink-0 z-30 sticky top-16 lg:top-24 bg-background pt-2 pb-2 lg:p-0">
          <nav className="lg:sticky lg:top-24 bg-surface-container-lowest lg:rounded-xl shadow-sm lg:p-3 border-y lg:border border-surface-container-low -mx-4 px-4 lg:mx-0 overflow-x-auto no-scrollbar">
            <ul className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1 w-max lg:w-auto py-3 lg:py-0">
              {menuItems.map(item => (
                <li key={item.id} className="shrink-0">
                  <button
                    onClick={() => handleScrollTo(item.id)}
                    className={cn(
                      "flex w-full items-center space-x-2 lg:space-x-3 px-4 py-2.5 lg:py-3 rounded-full lg:rounded-lg font-body-md text-body-md transition-colors",
                      activeSection === item.id 
                        ? "bg-primary-container text-primary font-bold" 
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface bg-surface border lg:border-transparent border-surface-container-high"
                    )}
                  >
                    <Icon name={item.icon} className="text-[18px] lg:text-[24px]" />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="flex-1 space-y-12">
          
          {/* Profile Section */}
          <section id="profile" className="bg-surface-container-lowest rounded-xl p-6 md:p-8 card-shadow border border-surface-container-low scroll-mt-24">
            <div className="mb-6">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Profile Information</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-surface-container-high border-4 border-surface overflow-hidden relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  {uploadingAvatar ? (
                    <div className="w-full h-full flex items-center justify-center bg-primary-container"><Icon name="sync" className="animate-spin" /></div>
                  ) : profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-container text-on-primary-container"><Icon name="person" className="text-[64px]" /></div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30"><Icon name="photo_camera" className="text-white" /></div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block">Full Name</label>
                  <input className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary" type="text" value={fullName} onChange={e => setFullName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block">Email</label>
                  <input className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-3 text-on-surface-variant opacity-70 cursor-not-allowed" type="email" value={session?.user.email || ''} disabled />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block">Phone Number</label>
                  <input className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section id="security" className="bg-surface-container-lowest rounded-xl p-6 md:p-8 card-shadow border border-surface-container-low scroll-mt-24">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">Security</h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
              <input type="password" placeholder="Current Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full p-3 rounded-lg border bg-surface" />
              <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-3 rounded-lg border bg-surface" />
              <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-3 rounded-lg border bg-surface" />
              <button type="submit" className="bg-primary text-on-primary px-6 py-2 rounded-lg">Change Password</button>
            </form>
            {passwordMsg && <p className="mt-4 text-tertiary">{passwordMsg}</p>}
          </section>

          {/* Notifications Section */}
          <section id="notifications" className="bg-surface-container-lowest rounded-xl p-6 md:p-8 scroll-mt-24">
            <h2 className="font-headline-sm">Notifications</h2>
            <div className="flex items-center justify-between py-6">
              <span>Email Notifications</span>
              <button onClick={() => setEmailNotifs(!emailNotifs)} className={cn("w-11 h-6 rounded-full relative transition-colors duration-200", emailNotifs ? 'bg-primary' : 'bg-surface-container-highest')}>
                <span className={cn("absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200", emailNotifs ? 'translate-x-5' : 'translate-x-0')} />
              </button>
            </div>
          </section>

          {/* Preferences Section */}
          <section id="preferences" className="bg-surface-container-lowest rounded-xl p-6 md:p-8 card-shadow border border-surface-container-low scroll-mt-24">
            <div className="mb-6">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Preferences</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-surface-container-low mb-6">
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block">Language</label>
                <div className="relative">
                  <select 
                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-on-surface appearance-none focus:outline-none focus:border-primary"
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                  >
                    <option value="English (United States)">English (United States)</option>
                    <option value="Spanish (Spain)">Spanish (Spain)</option>
                    <option value="French (France)">French (France)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-on-surface-variant">
                    <Icon name="expand_more" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block">Base Currency</label>
                <div className="relative">
                  <select 
                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-on-surface appearance-none focus:outline-none focus:border-primary"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="₱">PHP (₱) - Philippine Peso</option>
                    <option value="$">USD ($) - US Dollar</option>
                    <option value="€">EUR (€) - Euro</option>
                    <option value="£">GBP (£) - British Pound</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-on-surface-variant">
                    <Icon name="expand_more" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-body-md text-body-md text-on-surface font-medium">Dark Mode</h3>
              </div>
              <button onClick={toggleDarkMode} className={cn("w-11 h-6 rounded-full relative transition-colors duration-200", isDarkMode ? 'bg-primary' : 'bg-surface-container-highest')}>
                <span className={cn("absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200", isDarkMode ? 'translate-x-5' : 'translate-x-0')} />
              </button>
            </div>
          </section>

        </div>
      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-0 right-0 w-full lg:w-[calc(100%-16rem)] p-2 md:p-4 bg-surface/90 backdrop-blur-xl border-t border-surface-container-low z-30 flex justify-end shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-container-max w-full flex justify-end gap-3 px-2">
          <button 
            onClick={() => {
              if (profile) {
                setFullName(profile.full_name || '');
                setPhone(profile.phone_number || '');
                handleLanguageChange(profile.language || 'English (United States)');
                setCurrency(profile.currency || '₱');
                setEmailNotifs(profile.email_notifications ?? true);
              }
            }}
            className="px-4 py-2 text-sm md:text-base md:px-6 md:py-2.5 rounded-full border border-outline text-on-surface hover:bg-surface-container-low transition-colors"
          >
            Reset
          </button>
          <button 
            onClick={handleUpdateProfile}
            disabled={profileLoading}
            className="px-5 py-2 text-sm md:text-base md:px-6 md:py-2.5 rounded-full bg-primary text-on-primary hover:brightness-110 shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Icon name="save" className="text-[18px] md:text-[20px]" />
            {profileLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};
