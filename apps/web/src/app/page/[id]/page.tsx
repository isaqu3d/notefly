'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Page, Block, BlockType } from '@/types';
import { BlockEditor } from '@/components/editor/BlockEditor';

export default function PageEditorPage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;

  const [page, setPage] = useState<Page | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [showBlockMenu, setShowBlockMenu] = useState(false);

  useEffect(() => {
    const token = api.getToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadPage();
    loadBlocks();
  }, [pageId, router]);

  const loadPage = async () => {
    try {
      const data = await api.get<Page>(`/pages/${pageId}`);
      setPage(data);
      setTitle(data.title);
    } catch (error) {
      console.error('Failed to load page:', error);
    }
  };

  const loadBlocks = async () => {
    try {
      const data = await api.get<Block[]>('/blocks');
      const pageBlocks = data.filter((b) => b.pageId === pageId && !b.parentBlockId);
      pageBlocks.sort((a, b) => a.position - b.position);
      setBlocks(pageBlocks);
    } catch (error) {
      console.error('Failed to load blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = async (newTitle: string) => {
    setTitle(newTitle);
    if (page) {
      try {
        await api.put(`/pages/${page.id}`, { title: newTitle });
      } catch (error) {
        console.error('Failed to update title:', error);
      }
    }
  };

  const handleUpdateBlock = async (
    blockId: string,
    content: string,
    properties?: Record<string, unknown>
  ) => {
    try {
      await api.put(`/blocks/${blockId}`, { content, properties });
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === blockId ? { ...b, content, properties: properties || b.properties } : b
        )
      );
    } catch (error) {
      console.error('Failed to update block:', error);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    try {
      await api.delete(`/blocks/${blockId}`);
      setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    } catch (error) {
      console.error('Failed to delete block:', error);
    }
  };

  const handleCreateBlock = async (type: BlockType = 'TEXT', afterBlockId?: string) => {
    try {
      const position =
        afterBlockId !== undefined
          ? (blocks.find((b) => b.id === afterBlockId)?.position || 0) + 1
          : blocks.length;

      const newBlock = await api.post<Block>('/blocks', {
        type,
        content: '',
        pageId,
        position,
      });

      setBlocks((prev) => [...prev, newBlock].sort((a, b) => a.position - b.position));
      setShowBlockMenu(false);
    } catch (error) {
      console.error('Failed to create block:', error);
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
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/workspace/${page?.workspaceId}`}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              ← Back
            </Link>
            <button
              onClick={() => setShowBlockMenu(true)}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              + Add Block
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {page?.coverImage && (
          <img
            src={page.coverImage}
            alt="Cover"
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
        )}

        <div className="mb-8">
          {page?.icon && <span className="text-6xl mb-4 block">{page.icon}</span>}
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Untitled"
            className="w-full text-5xl font-bold bg-transparent border-none outline-none placeholder-gray-300 dark:placeholder-gray-700"
          />
        </div>

        <div className="space-y-2 pl-8">
          {blocks.length === 0 ? (
            <button
              onClick={() => handleCreateBlock()}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              Click to add your first block...
            </button>
          ) : (
            blocks.map((block) => (
              <BlockEditor
                key={block.id}
                block={block}
                onUpdate={handleUpdateBlock}
                onDelete={handleDeleteBlock}
                onNewBlock={() => handleCreateBlock('TEXT', block.id)}
              />
            ))
          )}
        </div>
      </main>

      {showBlockMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add Block</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleCreateBlock('TEXT')}
                className="p-3 text-left border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="font-medium">Text</div>
                <div className="text-xs text-gray-500">Plain text</div>
              </button>
              <button
                onClick={() => handleCreateBlock('HEADING_1')}
                className="p-3 text-left border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="font-medium">Heading 1</div>
                <div className="text-xs text-gray-500">Big heading</div>
              </button>
              <button
                onClick={() => handleCreateBlock('HEADING_2')}
                className="p-3 text-left border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="font-medium">Heading 2</div>
                <div className="text-xs text-gray-500">Medium heading</div>
              </button>
              <button
                onClick={() => handleCreateBlock('HEADING_3')}
                className="p-3 text-left border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="font-medium">Heading 3</div>
                <div className="text-xs text-gray-500">Small heading</div>
              </button>
              <button
                onClick={() => handleCreateBlock('TODO')}
                className="p-3 text-left border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="font-medium">To-do</div>
                <div className="text-xs text-gray-500">Checkbox list</div>
              </button>
              <button
                onClick={() => handleCreateBlock('BULLETED_LIST')}
                className="p-3 text-left border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="font-medium">Bulleted List</div>
                <div className="text-xs text-gray-500">Simple list</div>
              </button>
              <button
                onClick={() => handleCreateBlock('CODE')}
                className="p-3 text-left border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="font-medium">Code</div>
                <div className="text-xs text-gray-500">Code snippet</div>
              </button>
              <button
                onClick={() => handleCreateBlock('QUOTE')}
                className="p-3 text-left border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="font-medium">Quote</div>
                <div className="text-xs text-gray-500">Blockquote</div>
              </button>
              <button
                onClick={() => handleCreateBlock('CALLOUT')}
                className="p-3 text-left border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="font-medium">Callout</div>
                <div className="text-xs text-gray-500">Highlighted box</div>
              </button>
              <button
                onClick={() => handleCreateBlock('DIVIDER')}
                className="p-3 text-left border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="font-medium">Divider</div>
                <div className="text-xs text-gray-500">Visual separator</div>
              </button>
            </div>
            <button
              onClick={() => setShowBlockMenu(false)}
              className="w-full mt-4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
