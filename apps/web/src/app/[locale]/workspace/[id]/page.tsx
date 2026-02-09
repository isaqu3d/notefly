'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
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
import { toast } from 'sonner';

export default function WorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.id as string;

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
      console.log('[Workspace] Pages response:', response);

      // Backend returns { data: [...], meta: {...} }
      const pages = response.data || [];
      const workspacePages = pages.filter((p) => p.workspaceId === workspaceId && !p.parentId);
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
      console.log('[Workspace] Creating page:', { title: newPageTitle, workspaceId });
      const response = await api.post('/pages', {
        title: newPageTitle,
        workspaceId,
        visibility: 'WORKSPACE',
      });
      console.log('[Workspace] Page created:', response);
      setNewPageTitle('');
      setShowCreateDialog(false);
      toast.success('Page created!');
      loadPages();
    } catch (error) {
      console.error('Failed to create page:', error);
      toast.error('Failed to create page');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar workspaces={workspaces} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto notion-scrollbar">
          <main className="max-w-4xl mx-auto px-24 py-12">
            {/* Workspace Header */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-2">
                {workspace?.icon && <span className="text-6xl">{workspace.icon}</span>}
              </div>
              <h1 className="text-4xl font-bold mb-1">{workspace?.name}</h1>
              <p className="text-sm text-muted-foreground">
                {pages.length} {pages.length === 1 ? 'page' : 'pages'}
              </p>
            </div>

            {/* Pages List */}
            <div className="space-y-1">
              {pages.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground mb-6">
                    No pages yet. Create your first page to get started.
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Page
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

                  {/* Quick Add Button */}
                  <button
                    onClick={() => setShowCreateDialog(true)}
                    className="flex items-center gap-2 px-2 py-1.5 -mx-2 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors w-full"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-sm">New page</span>
                  </button>
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Create Page Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePage}>
            <div className="py-4">
              <Input
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                placeholder="Page title"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  setNewPageTitle('');
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
