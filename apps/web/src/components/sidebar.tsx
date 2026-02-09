'use client';

import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  FileText,
  Home,
  Search,
  Settings,
  Plus,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { User } from '@/types';

interface SidebarProps {
  workspaces?: Array<{ id: string; name: string }>;
}

export function Sidebar({ workspaces = [] }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('common');
  const [showWorkspaces, setShowWorkspaces] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navigation = [
    { name: t('home'), href: '/dashboard', icon: Home },
    { name: t('search'), href: '/search', icon: Search },
    { name: t('settings'), href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-full w-60 flex-col border-r bg-sidebar">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-foreground flex items-center justify-center">
            <FileText className="h-4 w-4 text-background" />
          </div>
          <span className="text-lg font-semibold">Notely</span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto notion-scrollbar p-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 ${
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-accent/50'
                }`}
                size="sm"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}

        <div className="pt-4">
          <button
            onClick={() => setShowWorkspaces(!showWorkspaces)}
            className="flex w-full items-center justify-between px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <span>{t('workspaces')}</span>
            <ChevronDown
              className={`h-3 w-3 transition-transform ${
                showWorkspaces ? 'rotate-0' : '-rotate-90'
              }`}
            />
          </button>

          {showWorkspaces && (
            <div className="mt-1 space-y-1">
              {workspaces.map((workspace) => {
                const isActive = pathname.includes(`/workspace/${workspace.id}`);
                return (
                  <Link key={workspace.id} href={`/workspace/${workspace.id}`}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-3 pl-8 ${
                        isActive
                          ? 'bg-accent text-accent-foreground'
                          : 'text-sidebar-foreground hover:bg-accent/50'
                      }`}
                      size="sm"
                    >
                      <FileText className="h-3 w-3" />
                      <span className="truncate">{workspace.name}</span>
                    </Button>
                  </Link>
                );
              })}

              <Link href="/workspace/new">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 pl-8 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  size="sm"
                >
                  <Plus className="h-3 w-3" />
                  {t('newWorkspace')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="border-t p-3">
        <div className="flex items-center gap-2">
          <Link href="/settings" className="flex items-center gap-2 flex-1 min-w-0">
            <Avatar className="h-7 w-7">
              <AvatarImage src={user?.avatar || undefined} alt={user?.name || 'User'} />
              <AvatarFallback className="text-xs">
                {user?.name ? getInitials(user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm truncate">{user?.name || 'User'}</span>
          </Link>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-7 w-7 flex-shrink-0"
            title={t('logout')}
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
