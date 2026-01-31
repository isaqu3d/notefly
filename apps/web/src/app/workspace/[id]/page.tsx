'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Workspace, Page } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

export default function WorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.id as string;

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');

  useEffect(() => {
    const token = api.getToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadWorkspace();
    loadPages();
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
      const data = await api.get<Page[]>('/pages');
      const workspacePages = data.filter((p) => p.workspaceId === workspaceId && !p.parentId);
      setPages(workspacePages);
    } catch (error) {
      console.error('Failed to load pages:', error);
    } finally {
      setLoading(false);
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
      setShowCreateModal(false);
      loadPages();
    } catch (error) {
      console.error('Failed to create page:', error);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              ← Back
            </Link>
            <div className="flex items-center gap-2">
              {workspace?.icon && <span className="text-2xl">{workspace.icon}</span>}
              <h1 className="text-2xl font-bold">{workspace?.name}</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Pages</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + New Page
          </button>
        </div>

        {pages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No pages yet. Create your first page to get started.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create First Page
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {pages.map((page) => (
              <Link
                key={page.id}
                href={`/page/${page.id}`}
                className="block p-4 bg-white dark:bg-gray-900 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-center gap-3">
                  {page.icon && <span className="text-xl">{page.icon}</span>}
                  <div className="flex-1">
                    <h3 className="font-semibold">{page.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Updated {formatRelativeTime(page.updatedAt)}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
                    {page.visibility.toLowerCase()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Create New Page</h3>
            <form onSubmit={handleCreatePage}>
              <input
                type="text"
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                placeholder="Page title"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg mb-4 dark:bg-gray-800"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewPageTitle('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
