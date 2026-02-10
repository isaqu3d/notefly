'use client';

import { BlockEditor } from '@/components/editor/BlockEditor';
import { Sidebar } from '@/components/sidebar';
import { Link, useRouter } from '@/i18n/navigation';
import { api } from '@/lib/api';
import type { Block, BlockType, Page, Workspace } from '@/types';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function PageEditorPage() {
  const router = useRouter();
  const t = useTranslations('editor');
  const tc = useTranslations('common');
  const params = useParams();
  const pageId = params.id as string;

  const [page, setPage] = useState<Page | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null);
  const updateTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    api.refreshToken();
    const token = api.getToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadPage();
    loadBlocks();
    loadWorkspaces();

    // Cleanup function to clear all pending timeouts
    return () => {
      Object.values(updateTimeoutRef.current).forEach((timeout) => {
        clearTimeout(timeout);
      });
      updateTimeoutRef.current = {};
    };
  }, [pageId, router]);

  const loadPage = async () => {
    try {
      const data = await api.get<Page>(`/pages/${pageId}`);
      setPage(data);
      setTitle(data.title);

      // Load workspace info
      if (data.workspaceId) {
        const workspaceData = await api.get<Workspace>(
          `/workspaces/${data.workspaceId}`
        );
        setWorkspace(workspaceData);
      }
    } catch (error) {
      console.error('Failed to load page:', error);
    }
  };

  const loadBlocks = async () => {
    try {
      const data = await api.get<Block[]>(`/blocks?pageId=${pageId}`);
      const pageBlocks = data.filter((b) => !b.parentId);
      pageBlocks.sort((a, b) => a.position - b.position);
      setBlocks(pageBlocks);
    } catch (error) {
      console.error('Failed to load blocks:', error);
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

  const handleTitleChange = async (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleTitleBlur = async () => {
    setIsEditingTitle(false);
    if (page && title !== page.title) {
      try {
        await api.put(`/pages/${page.id}`, { title });
        setPage({ ...page, title });
      } catch (error) {
        console.error('Failed to update title:', error);
        toast.error('Failed to update title');
        setTitle(page.title);
      }
    }
  };

  const handleUpdateBlock = useCallback(
    (
      blockId: string,
      content: string,
      properties?: Record<string, unknown>
    ) => {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === blockId ? { ...b, content, ...(properties || {}) } : b
        )
      );

      if (updateTimeoutRef.current[blockId]) {
        clearTimeout(updateTimeoutRef.current[blockId]);
      }

      updateTimeoutRef.current[blockId] = setTimeout(async () => {
        try {
          await api.put(`/blocks/${blockId}`, { content, ...properties });
          console.log('[Editor] Block updated:', blockId);
        } catch (error) {
          console.error('Failed to update block:', error);
          toast.error('Failed to save changes');
        }
        delete updateTimeoutRef.current[blockId];
      }, 1500);
    },
    []
  );

  const handleDeleteBlock = async (blockId: string) => {
    try {
      await api.delete(`/blocks/${blockId}`);
      setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    } catch (error) {
      console.error('Failed to delete block:', error);
      toast.error('Failed to delete block');
    }
  };

  const handleCreateBlock = async (
    type: BlockType = 'TEXT',
    afterBlockId?: string
  ) => {
    try {
      if (afterBlockId) {
        const currentBlock = blocks.find((b) => b.id === afterBlockId);

        if (currentBlock && !currentBlock.content.trim()) {
          console.log(
            '[Editor] Prevented: current block is empty, not creating another'
          );
          return;
        }
      }

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

      setBlocks((prev) =>
        [...prev, newBlock].sort((a, b) => a.position - b.position)
      );
    } catch (error) {
      console.error('Failed to create block:', error);
      toast.error('Failed to create block');
    }
  };

  const handleChangeBlockType = useCallback(
    async (blockId: string, newType: BlockType) => {
      try {
        await api.put(`/blocks/${blockId}`, { type: newType });
        setBlocks((prev) =>
          prev.map((b) => (b.id === blockId ? { ...b, type: newType } : b))
        );
        console.log('[Editor] Block type changed:', blockId, newType);
      } catch (error) {
        console.error('Failed to change block type:', error);
      }
    },
    []
  );

  const handleDuplicateBlock = useCallback(
    async (blockId: string) => {
      try {
        const blockToDuplicate = blocks.find((b) => b.id === blockId);
        if (!blockToDuplicate) return;

        // Increment positions of blocks after the duplicated one
        const newPosition = blockToDuplicate.position + 1;

        const newBlock = await api.post<Block>('/blocks', {
          type: blockToDuplicate.type,
          content: blockToDuplicate.content,
          pageId,
          position: newPosition,
          checked: blockToDuplicate.checked,
          language: blockToDuplicate.language,
          icon: blockToDuplicate.icon,
          color: blockToDuplicate.color,
          url: blockToDuplicate.url,
          caption: blockToDuplicate.caption,
        });

        setBlocks((prev) =>
          [...prev, newBlock].sort((a, b) => a.position - b.position)
        );
        console.log('[Editor] Block duplicated:', blockId, '->', newBlock.id);
      } catch (error) {
        console.error('Failed to duplicate block:', error);
      }
    },
    [blocks, pageId]
  );

  const handleReorderBlocks = useCallback(
    async (draggedBlockId: string, targetBlockId: string) => {
      try {
        const draggedBlock = blocks.find((b) => b.id === draggedBlockId);
        const targetBlock = blocks.find((b) => b.id === targetBlockId);

        if (!draggedBlock || !targetBlock) return;

        // Calculate new position
        const newPosition = targetBlock.position;

        // Update local state immediately for responsive UI
        setBlocks((prev) => {
          const filtered = prev.filter((b) => b.id !== draggedBlockId);
          const targetIndex = filtered.findIndex((b) => b.id === targetBlockId);
          const newBlocks = [
            ...filtered.slice(0, targetIndex),
            { ...draggedBlock, position: newPosition },
            ...filtered.slice(targetIndex),
          ];
          // Recalculate positions
          return newBlocks.map((b, index) => ({ ...b, position: index }));
        });

        // Update position on server
        await api.put(`/blocks/${draggedBlockId}`, { position: newPosition });
        console.log(
          '[Editor] Block reordered:',
          draggedBlockId,
          'to position',
          newPosition
        );
      } catch (error) {
        console.error('Failed to reorder blocks:', error);
        // Reload blocks to restore correct order
        loadBlocks();
      }
    },
    [blocks]
  );

  const handleDragStart = useCallback((blockId: string) => {
    setDraggingBlockId(blockId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingBlockId(null);
  }, []);

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
            {/* Breadcrumb */}
            {workspace && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
                <Link
                  href={`/workspace/${workspace.id}`}
                  className="hover:text-foreground transition-colors"
                >
                  {workspace.icon && (
                    <span className="mr-1">{workspace.icon}</span>
                  )}
                  {workspace.name}
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground">
                  {page?.icon && <span className="mr-1">{page.icon}</span>}
                  {title || t('untitled')}
                </span>
              </div>
            )}

            {/* Cover Image */}
            {page?.coverImage && (
              <div className="mb-12 -mx-24">
                <img
                  src={page.coverImage}
                  alt="Cover"
                  className="w-full h-52 object-cover"
                />
              </div>
            )}

            {/* Page Icon & Title */}
            <div className="mb-8">
              {page?.icon && (
                <div className="mb-4">
                  <span className="text-6xl">{page.icon}</span>
                </div>
              )}

              {isEditingTitle ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  onBlur={handleTitleBlur}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTitleBlur();
                    }
                  }}
                  placeholder={t('untitled')}
                  className="w-full text-5xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/30"
                  autoFocus
                />
              ) : (
                <h1
                  onClick={() => setIsEditingTitle(true)}
                  className="text-5xl font-bold cursor-text hover:bg-accent/30 rounded px-2 -mx-2 transition-colors"
                >
                  {title || t('untitled')}
                </h1>
              )}
            </div>

            {/* Blocks */}
            <div className="space-y-1">
              {blocks.length === 0 ? (
                <div className="py-2">
                  <button
                    onClick={() => handleCreateBlock()}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {t('startWriting')}
                  </button>
                </div>
              ) : (
                blocks.map((block) => (
                  <BlockEditor
                    key={block.id}
                    block={block}
                    onUpdate={handleUpdateBlock}
                    onDelete={handleDeleteBlock}
                    onNewBlock={() => handleCreateBlock('TEXT', block.id)}
                    onChangeType={handleChangeBlockType}
                    onDuplicate={handleDuplicateBlock}
                    onReorder={handleReorderBlocks}
                    isDragging={draggingBlockId === block.id}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
