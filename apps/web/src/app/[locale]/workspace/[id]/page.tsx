'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import type { Workspace, Page } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, FileText } from 'lucide-react';
import { Link, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function WorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.id as string;
  const t = useTranslations('workspace');
  const tc = useTranslations('common');

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');

  useEffect(() => {
    api.refreshToken();
    const token = api.getToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadWorkspace();
    loadPages();
    loadWorkspaces();
  }, [workspaceId, router]);

  const loadWorkspace = async () => {
    try {
      const data = await api.get<Workspace>(`/workspaces/${workspaceId}`);
      setWorkspace(data);
    } catch (error) {
      console.error('Failed to load workspace:', error);
    }
  };

  const loadPages = async () => {
    try {
      const response = await api.get<{ data: Page[]; meta: { total: number } }>('/pages');
      const allPages = response.data || [];
      const workspacePages = allPages.filter((p) => p.workspaceId === workspaceId && !p.parentId);
      setPages(workspacePages);
    } catch (error) {
      console.error('Failed to load pages:', error);
      setPages([]);
    } finally {
      setLoading(false);
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

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;

    try {
      await api.post('/pages', {
        title: newPageTitle,
        workspaceId,
        visibility: 'WORKSPACE',
      });
      setNewPageTitle('');
      setShowCreateDialog(false);
      toast.success(t('pageCreated'));
      loadPages();
    } catch (error) {
      console.error('Failed to create page:', error);
      toast.error(t('pageCreateFailed'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{tc('loading')}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar workspaces={workspaces} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto notion-scrollbar">
          <main className="max-w-4xl mx-auto px-24 py-12">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-2">
                {workspace?.icon && <span className="text-6xl">{workspace.icon}</span>}
              </div>
              <h1 className="text-4xl font-bold mb-1">{workspace?.name}</h1>
              <p className="text-sm text-muted-foreground">
                {pages.length} {pages.length === 1 ? tc('page') : tc('pages')}
              </p>
            </div>

            <div className="space-y-1">
              {pages.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground mb-6">{t('noPagesYet')}</p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('createFirstPage')}
                  </Button>
                </div>
              ) : (
                <>
                  {pages.map((page) => (
                    <Link
                      key={page.id}
                      href={`/page/${page.id}`}
                      className="group flex items-center gap-2 px-2 py-1.5 -mx-2 rounded-md hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {page.icon ? (
                          <span className="text-lg flex-shrink-0">{page.icon}</span>
                        ) : (
                          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className="truncate">{page.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        {formatRelativeTime(page.updatedAt)}
                      </span>
                    </Link>
                  ))}

                  <button
                    onClick={() => setShowCreateDialog(true)}
                    className="flex items-center gap-2 px-2 py-1.5 -mx-2 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors w-full"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-sm">{t('newPage')}</span>
                  </button>
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('createNewPage')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePage}>
            <div className="py-4">
              <Input
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                placeholder={t('pageTitle')}
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => { setShowCreateDialog(false); setNewPageTitle(''); }}
              >
                {tc('cancel')}
              </Button>
              <Button type="submit">{tc('create')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
