# Notely

A modern, full-stack note-taking and task management application, inspired by Notion.

## 🏗️ Tech Stack

### Monorepo Management
- **pnpm** - Fast, disk space efficient package manager
- **Turborepo** - High-performance build system for JavaScript/TypeScript monorepos

### Applications
- **Web** - Next.js 15 with App Router (coming soon)
- **Mobile** - React Native with Expo (coming soon)
- **API** - NestJS backend (coming soon)

### Shared Packages
- `@notely/types` - Shared TypeScript types
- `@notely/validators` - Zod validation schemas
- `@notely/utils` - Common utility functions
- `@notely/ui` - Shared UI components (coming soon)
- `@notely/api-client` - Type-safe API client (coming soon)
- `@notely/tsconfig` - Shared TypeScript configurations

### Tooling
- `@notely/eslint-config` - Shared ESLint configuration
- `@notely/prettier-config` - Shared Prettier configuration

## 📦 Project Structure

```
monorepo/
├── apps/
│   ├── web/         # Next.js 15 web application
│   ├── mobile/      # React Native mobile app
│   └── api/         # NestJS backend API
├── packages/
│   ├── types/       # Shared TypeScript types
│   ├── validators/  # Zod validation schemas
│   ├── utils/       # Utility functions
│   ├── ui/          # Shared UI components
│   ├── api-client/  # API client library
│   └── tsconfig/    # TypeScript configurations
├── tooling/
│   ├── eslint/      # ESLint configurations
│   └── prettier/    # Prettier configuration
└── .github/
    └── workflows/   # CI/CD pipelines
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.0.0
- pnpm >= 9.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run all apps in development mode
pnpm dev
```

### Available Scripts

```bash
# Development
pnpm dev          # Start all apps in dev mode

# Build
pnpm build        # Build all packages and apps

# Linting & Formatting
pnpm lint         # Lint all packages
pnpm format       # Format all files with Prettier
pnpm format:check # Check formatting

# Type Checking
pnpm typecheck    # Type check all packages

# Testing
pnpm test         # Run tests

# Clean
pnpm clean        # Clean all build artifacts
```

## 📝 Features (Planned)

- ✅ User authentication (JWT)
- ✅ Rich text editing
- ✅ Hierarchical page structure
- ✅ Block-based content editor
- ✅ Real-time collaboration
- ✅ Offline support
- ✅ Full-text search
- ✅ Image uploads
- ✅ Dark mode
- ✅ Mobile apps (iOS & Android)

## 🛠️ Development Workflow

### Adding a New Package

1. Create a new directory under `packages/`
2. Add `package.json` with workspace protocol dependencies
3. Update `pnpm-workspace.yaml` if needed
4. Run `pnpm install` to link dependencies

### Adding a New App

1. Create a new directory under `apps/`
2. Initialize with the appropriate framework CLI
3. Configure to use shared packages (`@notely/*`)
4. Update `turbo.json` pipelines if needed

## 📚 Documentation

Detailed documentation for each package and app will be available in their respective directories.

## 🤝 Contributing

This is currently a personal project. Contributions, issues, and feature requests are welcome!

## 📄 License

MIT License - feel free to use this project for learning and personal use.

---

Built with ❤️ using modern web technologies
