'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import type { User, Workspace } from '@/types';
import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Settings as SettingsIcon, User as UserIcon, Moon, LogOut, Camera, Globe } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';
import { routing } from '@/i18n/routing';

const languageNames: Record<string, string> = {
  en: 'English',
  pt: 'Português',
  es: 'Español',
};

export default function SettingsPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('settings');
  const tc = useTranslations('common');
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.refreshToken();
    const token = api.getToken();

    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadUser();
    loadWorkspaces();
  }, [router]);

  const loadUser = async () => {
    try {
      const userData = await api.get<User>('/users/me');
      setUser(userData);
      setName(userData.name || '');
      setEmail(userData.email || '');
      localStorage.setItem('user', JSON.stringify(userData));
    } catch {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setName(userData.name || '');
        setEmail(userData.email || '');
      }
    }
  };

  const loadWorkspaces = async () => {
    try {
      const data = await api.get<Workspace[]>('/workspaces');
      setWorkspaces(data);
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedUser = await api.put<User>('/users/me', { name });
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success(t('profileUpdated'));
    } catch {
      toast.error(t('profileUpdateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const uploadResult = await api.uploadFile<{ url: string }>('/media/upload', file);
      const updatedUser = await api.put<User>('/users/me', { avatar: uploadResult.url });
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success(t('avatarUpdated'));
    } catch {
      toast.error(t('avatarUploadFailed'));
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleLogout = () => {
    api.setToken(null);
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleLanguageChange = (newLocale: string) => {
    router.replace('/settings', { locale: newLocale as 'en' | 'pt' | 'es' });
  };

  const getInitials = (n: string) =>
    n.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar workspaces={workspaces} />

      <main className="flex-1 overflow-auto notion-scrollbar">
        <div className="max-w-3xl mx-auto px-12 py-16">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>

          <div className="space-y-8">
            {/* Profile Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <UserIcon className="h-5 w-5" />
                <h2 className="text-2xl font-semibold">{t('profile')}</h2>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="relative group">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.avatar || undefined} alt={user?.name || 'User'} />
                    <AvatarFallback className="text-lg">
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="h-5 w-5 text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                <div>
                  <p className="font-medium">{user?.name || t('noNameSet')}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  {uploadingAvatar && (
                    <p className="text-xs text-muted-foreground mt-1">{t('uploading')}</p>
                  )}
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">{t('nameLabel')}</label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('namePlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">{t('emailLabel')}</label>
                  <Input id="email" type="email" value={email} disabled placeholder="your@email.com" />
                  <p className="text-xs text-muted-foreground">{t('emailCantChange')}</p>
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? tc('saving') : tc('save')}
                </Button>
              </form>
            </section>

            <div className="border-t pt-8" />

            {/* Appearance Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Moon className="h-5 w-5" />
                <h2 className="text-2xl font-semibold">{t('appearance')}</h2>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">{t('theme')}</p>
                  <p className="text-sm text-muted-foreground">{t('themeDesc')}</p>
                </div>
                <ThemeToggle />
              </div>
            </section>

            <div className="border-t pt-8" />

            {/* Language Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5" />
                <h2 className="text-2xl font-semibold">{t('language')}</h2>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-3">{t('languageDesc')}</p>
                <div className="grid grid-cols-3 gap-2">
                  {routing.locales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => handleLanguageChange(loc)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        locale === loc
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'hover:bg-accent'
                      }`}
                    >
                      {languageNames[loc]}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <div className="border-t pt-8" />

            {/* Account Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <SettingsIcon className="h-5 w-5" />
                <h2 className="text-2xl font-semibold">{t('account')}</h2>
              </div>

              <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                <h3 className="font-medium mb-2">{t('dangerZone')}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t('logoutDesc')}</p>
                <Button variant="outline" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  {tc('logout')}
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
