// User types
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Workspace types
export interface Workspace {
  id: string;
  name: string;
  icon: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Page types
export enum PageVisibility {
  PRIVATE = 'PRIVATE',
  WORKSPACE = 'WORKSPACE',
  PUBLIC = 'PUBLIC',
}

export interface Page {
  id: string;
  title: string;
  icon: string | null;
  coverImage: string | null;
  workspaceId: string;
  parentId: string | null;
  authorId: string;
  visibility: PageVisibility;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PageWithChildren extends Page {
  children: PageWithChildren[];
}

// Block types
export enum BlockType {
  TEXT = 'TEXT',
  HEADING_1 = 'HEADING_1',
  HEADING_2 = 'HEADING_2',
  HEADING_3 = 'HEADING_3',
  BULLET_LIST = 'BULLET_LIST',
  NUMBERED_LIST = 'NUMBERED_LIST',
  TODO = 'TODO',
  TOGGLE = 'TOGGLE',
  QUOTE = 'QUOTE',
  DIVIDER = 'DIVIDER',
  IMAGE = 'IMAGE',
  CODE = 'CODE',
  CALLOUT = 'CALLOUT',
}

export interface BaseBlock {
  id: string;
  type: BlockType;
  pageId: string;
  parentId: string | null;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TextBlock extends BaseBlock {
  type: BlockType.TEXT;
  content: string;
}

export interface HeadingBlock extends BaseBlock {
  type: BlockType.HEADING_1 | BlockType.HEADING_2 | BlockType.HEADING_3;
  content: string;
}

export interface ListBlock extends BaseBlock {
  type: BlockType.BULLET_LIST | BlockType.NUMBERED_LIST;
  content: string;
}

export interface TodoBlock extends BaseBlock {
  type: BlockType.TODO;
  content: string;
  checked: boolean;
}

export interface ImageBlock extends BaseBlock {
  type: BlockType.IMAGE;
  url: string;
  caption: string | null;
  width: number | null;
  height: number | null;
}

export interface CodeBlock extends BaseBlock {
  type: BlockType.CODE;
  content: string;
  language: string | null;
}

export interface CalloutBlock extends BaseBlock {
  type: BlockType.CALLOUT;
  content: string;
  icon: string | null;
  color: string | null;
}

export type Block =
  | TextBlock
  | HeadingBlock
  | ListBlock
  | TodoBlock
  | ImageBlock
  | CodeBlock
  | CalloutBlock;

// API Response types
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// WebSocket types
export enum WebSocketEvent {
  BLOCK_CREATED = 'block.created',
  BLOCK_UPDATED = 'block.updated',
  BLOCK_DELETED = 'block.deleted',
  PAGE_UPDATED = 'page.updated',
  PAGE_DELETED = 'page.deleted',
}

export interface WebSocketMessage<T = any> {
  event: WebSocketEvent;
  payload: T;
}
