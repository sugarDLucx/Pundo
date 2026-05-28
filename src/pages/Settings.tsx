import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useProfileStore } from '../store/profileStore';
import { Icon } from '../components/ui/Icon';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

export const Settings: React.FC = () => {
  const { session, changePassword, fetchLoginHistory, loginHistory } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { profile, updateProfile, loading: profileLoading, uploadAvatar } = useProfileStore();
  const { t } = useTranslation();

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: 'person' },
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

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 flex-1 pb-20">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <nav className="sticky top-24 bg-surface-container-lowest rounded-xl shadow-sm p-3 border border-surface-container-low">
            <ul className="space-y-1">
              {menuItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "flex w-full items-center space-x-3 px-4 py-3 rounded-lg font-body-md text-body-md transition-colors",
                      activeSection === item.id 
                        ? "bg-surface-container-low text-primary font-medium" 
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                    )}
                  >
                    <Icon name={item.icon} />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="flex-1 space-y-8">
          {activeSection === 'profile' && (
            <section className="bg-surface-container-lowest rounded-xl p-6 md:p-8 card-shadow border border-surface-container-low">
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
                <form onSubmit={handleUpdateProfile} className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
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
                  <button type="submit" disabled={profileLoading} className="px-6 py-3 rounded-full bg-primary text-on-primary">Save Changes</button>
                </form>
              </div>
            </section>
          )}

          {activeSection === 'security' && (
            <section className="bg-surface-container-lowest rounded-xl p-6 md:p-8 card-shadow border border-surface-container-low">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">Security</h2>
              <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
                <input type="password" placeholder="Current Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full p-3 rounded-lg border bg-surface" />
                <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-3 rounded-lg border bg-surface" />
                <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-3 rounded-lg border bg-surface" />
                <button type="submit" className="bg-primary text-on-primary px-6 py-2 rounded-lg">Change Password</button>
              </form>
              {passwordMsg && <p className="mt-4 text-tertiary">{passwordMsg}</p>}
            </section>
          )}

          {activeSection === 'notifications' && (
            <section className="bg-surface-container-lowest rounded-xl p-6 md:p-8">
              <h2 className="font-headline-sm">Notifications</h2>
              <div className="flex items-center justify-between py-6">
                <span>Email Notifications</span>
                <button onClick={() => setEmailNotifs(!emailNotifs)} className={cn("w-11 h-6 rounded-full", emailNotifs ? 'bg-primary' : 'bg-surface-container-highest')} />
              </div>
            </section>
          )}

          {activeSection === 'preferences' && (
            <section className="bg-surface-container-lowest rounded-xl p-6 md:p-8 card-shadow border border-surface-container-low">
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
                      onChange={async (e) => {
                        const newLang = e.target.value;
                        setLanguage(newLang);
                        const i18nCode = newLang === 'English (United States)' ? 'en' : newLang === 'Spanish (Spain)' ? 'es' : 'fr';
                        await i18n.changeLanguage(i18nCode);
                        await updateProfile({ language: newLang });
                      }}
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
                      onChange={async (e) => {
                        const newCur = e.target.value;
                        setCurrency(newCur);
                        await updateProfile({ currency: newCur });
                      }}
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
                <button 
                  onClick={toggleDarkMode}
                  className={cn(
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    isDarkMode ? 'bg-primary' : 'bg-surface-container-highest'
                  )}
                >
                  <span className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    isDarkMode ? 'translate-x-5' : 'translate-x-0'
                  )} />
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
