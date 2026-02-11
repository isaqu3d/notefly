import { z } from 'zod';
import { BlockType, PageVisibility } from '@notely/types';

// Auth validators
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

// User validators
export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  avatar: z.string().url().optional(),
});

// Workspace validators
export const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Workspace name is required').max(100),
  icon: z.string().emoji().optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  icon: z.string().emoji().optional(),
});

// Page validators
export const createPageSchema = z.object({
  title: z.string().min(1, 'Page title is required').max(200).default('Untitled'),
  workspaceId: z.string().uuid(),
  parentId: z.string().uuid().optional(),
  icon: z.string().emoji().optional(),
  coverImage: z.string().url().optional(),
  visibility: z.nativeEnum(PageVisibility).default(PageVisibility.PRIVATE),
});

export const updatePageSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  icon: z.string().emoji().optional(),
  coverImage: z.string().url().optional(),
  visibility: z.nativeEnum(PageVisibility).optional(),
  parentId: z.string().uuid().nullable().optional(),
  position: z.number().int().nonnegative().optional(),
});

// Block validators
export const baseBlockSchema = z.object({
  type: z.nativeEnum(BlockType),
  pageId: z.string().uuid(),
  parentId: z.string().uuid().nullable().optional(),
  position: z.number().int().nonnegative().optional(),
});

export const createTextBlockSchema = baseBlockSchema.extend({
  type: z.literal(BlockType.TEXT),
  content: z.string(),
});

export const createHeadingBlockSchema = baseBlockSchema.extend({
  type: z.enum([BlockType.HEADING_1, BlockType.HEADING_2, BlockType.HEADING_3]),
  content: z.string(),
});

export const createListBlockSchema = baseBlockSchema.extend({
  type: z.enum([BlockType.BULLET_LIST, BlockType.NUMBERED_LIST]),
  content: z.string(),
});

export const createTodoBlockSchema = baseBlockSchema.extend({
  type: z.literal(BlockType.TODO),
  content: z.string(),
  checked: z.boolean().default(false),
});

export const createImageBlockSchema = baseBlockSchema.extend({
  type: z.literal(BlockType.IMAGE),
  url: z.string().url(),
  caption: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export const createCodeBlockSchema = baseBlockSchema.extend({
  type: z.literal(BlockType.CODE),
  content: z.string(),
  language: z.string().optional(),
});

export const createCalloutBlockSchema = baseBlockSchema.extend({
  type: z.literal(BlockType.CALLOUT),
  content: z.string(),
  icon: z.string().emoji().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
});

export const createBlockSchema = z.discriminatedUnion('type', [
  createTextBlockSchema,
  createHeadingBlockSchema,
  createListBlockSchema,
  createTodoBlockSchema,
  createImageBlockSchema,
  createCodeBlockSchema,
  createCalloutBlockSchema,
]);

export const updateBlockSchema = z.object({
  type: z.nativeEnum(BlockType).optional(),
  content: z.string().optional(),
  checked: z.boolean().optional(),
  position: z.number().int().nonnegative().optional(),
  parentId: z.string().uuid().nullable().optional(),
  url: z.string().url().optional(),
  caption: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  language: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
});

// Pagination validators
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Search validators
export const searchSchema = z.object({
  query: z.string().min(1),
  workspaceId: z.string().uuid().optional(),
});

// Type exports for inference
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
export type CreateBlockInput = z.infer<typeof createBlockSchema>;
export type UpdateBlockInput = z.infer<typeof updateBlockSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
