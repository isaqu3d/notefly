# Notely Web

Frontend web application for Notely - A modern notes and workspace application built with Next.js 15.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 3** - Styling
- **Zod** - Runtime validation

## Features

### Authentication
- User registration and login
- JWT token management
- Automatic token refresh
- Protected routes

### Workspaces
- Create and manage workspaces
- Workspace icons
- Navigate between workspaces

### Pages
- Create pages within workspaces
- Hierarchical page structure
- Page titles and icons
- Cover images
- Visibility settings (Private/Workspace/Public)

### Block Editor
- 12 block types:
  - Text
  - Heading 1, 2, 3
  - To-do (with checkboxes)
  - Bulleted List
  - Numbered List
  - Code
  - Quote
  - Callout
  - Divider
  - Image
- Real-time updates
- Inline editing
- Keyboard shortcuts (Enter to create, Backspace to delete)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Notely API running on http://localhost:3001

### Installation

```bash
# From monorepo root
pnpm install

# Run development server
pnpm --filter @notely/web dev
```

The app will be available at http://localhost:3000

### Build

```bash
# Production build
pnpm --filter @notely/web build

# Start production server
pnpm --filter @notely/web start
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── auth/                 # Authentication pages
│   │   ├── login/            # Login page
│   │   └── register/         # Registration page
│   ├── dashboard/            # Workspace dashboard
│   ├── workspace/[id]/       # Workspace detail
│   ├── page/[id]/            # Page editor
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
├── components/               # Reusable components
│   └── editor/               # Editor components
│       └── BlockEditor.tsx   # Block editor component
├── lib/                      # Utilities
│   ├── api.ts                # API client
│   └── utils.ts              # Helper functions
└── types/                    # TypeScript types
    └── index.ts              # Shared types
```

## Features Implementation

### Authentication Flow

1. User registers or logs in
2. API returns access_token and refresh_token
3. Tokens stored in localStorage
4. Access token sent with every request
5. Auto-redirect to dashboard on success

### Workspace Management

- List all user workspaces
- Create new workspaces
- Navigate to workspace detail
- View all pages in workspace

### Page Editor

- Notion-like editing experience
- Add/remove blocks dynamically
- Keyboard shortcuts for productivity
- Auto-save on content change
- Multiple block types with custom rendering

### Block Types

1. **Text** - Plain paragraph text
2. **Heading 1/2/3** - Different heading levels
3. **To-do** - Checkbox with strike-through
4. **Bulleted List** - Bullet points
5. **Numbered List** - Numbered items
6. **Code** - Monospace code block
7. **Quote** - Italicized quote with border
8. **Callout** - Highlighted information box
9. **Divider** - Horizontal rule
10. **Image** - Display images from URL

## API Integration

The app communicates with the Notely API:

- Base URL: `http://localhost:3001/api/v1`
- Authentication: Bearer token in headers
- Automatic error handling
- Type-safe requests with TypeScript

## Development

### Code Quality

- TypeScript strict mode
- ESLint with Next.js config
- Consistent formatting
- Type-safe API calls

### Best Practices

- Client-side components with `'use client'`
- Server components where possible
- Proper error boundaries
- Loading states
- Optimistic UI updates

## Keyboard Shortcuts

- **Enter** - Create new block below
- **Backspace** (empty block) - Delete block
- **Shift + Enter** - New line (in text blocks)

## Future Enhancements

- Real-time collaboration (WebSockets)
- Drag and drop blocks
- Rich text formatting
- File uploads
- Search functionality
- Dark mode toggle
- Mobile responsive improvements
- Offline support

---

**Built with Next.js 15 and React 19**
