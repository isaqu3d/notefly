'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import {
  FileText,
  Home,
  Search,
  Settings,
  Plus,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  workspaces?: Array<{ id: string; name: string }>;
}

export function Sidebar({ workspaces = [] }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showWorkspaces, setShowWorkspaces] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Settings', href: '/settings', icon: Settings },
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
            <span>Workspaces</span>
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
                  New workspace
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="border-t p-3 space-y-2">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-9 w-9"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
