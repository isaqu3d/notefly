'use client';

import { useEffect, useState } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import { api } from '@/lib/api';
import type { Page, Workspace } from '@/types';
import { Sidebar } from '@/components/sidebar';
import { Input } from '@/components/ui/input';
import { Search, FileText, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function SearchPage() {
  const router = useRouter();
  const t = useTranslations('search');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [allPages, setAllPages] = useState<Page[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Page[]>([]);

  useEffect(() => {
    api.refreshToken();
    const token = api.getToken();

    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadData();
  }, [router]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = allPages.filter((page) =>
        page.title.toLowerCase().includes(query)
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allPages]);

  const loadData = async () => {
    try {
      const [workspacesData, pagesResponse] = await Promise.all([
        api.get<Workspace[]>('/workspaces'),
        api.get<{ data: Page[]; meta: { total: number } }>('/pages'),
      ]);
      setWorkspaces(workspacesData);
      setAllPages(pagesResponse.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar workspaces={workspaces} />

      <main className="flex-1 overflow-auto notion-scrollbar">
        <div className="max-w-4xl mx-auto px-12 py-16">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
            <p className="text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {searchQuery.trim() === '' ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center mb-6">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">{t('searchYourPages')}</h2>
              <p className="text-muted-foreground max-w-sm">
                {t('typeToSearch')}
              </p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('noResults', { query: searchQuery })}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-4">
                {searchResults.length} {searchResults.length === 1 ? t('result') : t('results')}
              </p>
              {searchResults.map((page) => (
                <Link
                  key={page.id}
                  href={`/page/${page.id}`}
                  className="group flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                    {page.icon ? (
                      <span className="text-xl">{page.icon}</span>
                    ) : (
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium group-hover:text-foreground transition-colors truncate">
                      {page.title}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {t('updated')} {new Date(page.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
