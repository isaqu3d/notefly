export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface Workspace {
  id: string;
  name: string;
  icon: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: string;
  title: string;
  icon: string | null;
  coverImage: string | null;
  parentId: string | null;
  workspaceId: string;
  visibility: 'PRIVATE' | 'WORKSPACE' | 'PUBLIC';
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export type BlockType =
  | 'TEXT'
  | 'HEADING_1'
  | 'HEADING_2'
  | 'HEADING_3'
  | 'TODO'
  | 'BULLETED_LIST'
  | 'NUMBERED_LIST'
  | 'CODE'
  | 'QUOTE'
  | 'DIVIDER'
  | 'IMAGE'
  | 'CALLOUT';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  position: number;
  parentBlockId: string | null;
  pageId: string;
  properties: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceDto {
  name: string;
  icon?: string;
}

export interface UpdateWorkspaceDto {
  name?: string;
  icon?: string;
}

export interface CreatePageDto {
  title: string;
  workspaceId: string;
  parentId?: string;
  icon?: string;
  coverImage?: string;
  visibility?: 'PRIVATE' | 'WORKSPACE' | 'PUBLIC';
}

export interface UpdatePageDto {
  title?: string;
  icon?: string;
  coverImage?: string;
  visibility?: 'PRIVATE' | 'WORKSPACE' | 'PUBLIC';
}

export interface CreateBlockDto {
  type: BlockType;
  content: string;
  pageId: string;
  position?: number;
  parentBlockId?: string;
  properties?: Record<string, unknown>;
}

export interface UpdateBlockDto {
  type?: BlockType;
  content?: string;
  position?: number;
  parentBlockId?: string;
  properties?: Record<string, unknown>;
}
