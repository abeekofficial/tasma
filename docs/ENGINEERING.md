# Tasma - Engineering Standards & Project Structure

This document outlines the exhaustive engineering standards, architectural decisions, and project structures for the **Tasma AI Video Studio**. As a platform combining heavy media processing, real-time collaboration, and AI pipelines, strict adherence to these standards is mandatory to ensure scalability, maintainability, and reliability.

## Core Engineering Principles
- **SOLID & Clean Architecture**: Systems are decoupled into independent layers. Business logic does not depend on frameworks or databases.
- **Domain-Driven Design (DDD) & Feature-Based Architecture**: Code is grouped by business domain (e.g., `projects`, `videos`, `billing`), not just technical role.
- **Strict TypeScript**: 100% type safety. `any` is strictly prohibited.
- **Atomic Design**: UI components are broken down into atoms, molecules, organisms, and templates.
- **Composition over Inheritance**: Build complex behaviors by composing small, focused functions and components.

---

## 1. Monorepo Structure

Tasma uses a Turborepo + pnpm workspace structure. This enables efficient caching, seamless code sharing, and unified tooling across frontend, backend, and workers.

### Directory Layout
```text
tasma/
├── apps/
│   ├── web/                 # Next.js Frontend Application
│   ├── api/                 # Express Backend API Server
│   └── worker/              # BullMQ Media Processing Worker
├── packages/
│   ├── config/              # Shared configuration (ESLint, TS, Prettier, Tailwind)
│   ├── constants/           # Global enums, application constants
│   ├── types/               # Shared TypeScript interfaces & models
│   ├── utils/               # Shared pure functions (e.g., date parsing, math)
│   ├── validators/          # Zod schemas used by both API and Web
│   └── ui/                  # Shared UI components (if micro-frontends expand)
├── tooling/
│   ├── scripts/             # CI/CD and DB migration scripts
│   └── docker/              # Dockerfiles and docker-compose.yml
├── .husky/                  # Git hooks
├── turbo.json               # Turborepo configuration
├── pnpm-workspace.yaml      # pnpm workspace definition
└── package.json             # Root dependencies
```

### Package Dependency Graph
```mermaid
graph TD
    A[apps/web] --> P1[@tasma/types]
    A --> P2[@tasma/validators]
    A --> P3[@tasma/constants]
    A --> P4[@tasma/utils]
    A --> P5[@tasma/config]

    B[apps/api] --> P1
    B --> P2
    B --> P3
    B --> P4
    B --> P5

    C[apps/worker] --> P1
    C --> P3
    C --> P4
    C --> P5
    
    P2 --> P1
    P4 --> P1
```

---

## 2. Frontend Folder Structure

The `apps/web` directory uses the Next.js App Router, architected around **Feature-Driven Design** and **Atomic Design**.

```text
apps/web/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Route group for authentication
│   ├── (dashboard)/            # Route group for authenticated dashboard
│   ├── api/                    # Next.js API routes (BFF pattern if needed)
│   ├── layout.tsx              # Root layout
│   └── global.css              # Tailwind entrypoint
├── src/
│   ├── components/             # Atomic Design UI Components
│   │   ├── atoms/              # Buttons, Inputs, Typography
│   │   ├── molecules/          # Form fields, Search bars
│   │   ├── organisms/          # Header, Sidebar, VideoPlayer
│   │   └── templates/          # Page layouts (e.g., TwoColumnLayout)
│   ├── features/               # Domain-specific modules (See Section 4)
│   │   ├── projects/
│   │   ├── editor/
│   │   └── billing/
│   ├── hooks/                  # Global shared hooks (e.g., useDebounce, useWindowSize)
│   ├── lib/                    # Core library wrappers
│   │   ├── api-client.ts       # Axios/Fetch wrapper
│   │   ├── query-client.ts     # TanStack Query setup
│   │   └── tw.ts               # Tailwind merge utils
│   ├── providers/              # React Context / Theme Providers
│   ├── stores/                 # Redux Toolkit global stores (auth, theme)
│   └── types/                  # Web-specific types (e.g., React component props)
├── tailwind.config.ts          # Tailwind CSS configuration
└── next.config.mjs             # Next.js configuration
```

---

## 3. Backend Folder Structure

The `apps/api` directory is a Node.js/Express server structured using **Clean Architecture** and **Domain-Driven Design**.

```text
apps/api/
├── src/
│   ├── config/                 # Environment variables (Zod validated)
│   ├── infrastructure/         # External systems (DB, Cache, Storage)
│   │   ├── database/           # Prisma client and extensions
│   │   ├── cache/              # Redis connection
│   │   ├── queue/              # BullMQ configuration
│   │   └── storage/            # Cloudflare R2 client setup
│   ├── modules/                # Feature Modules (Domain Layer)
│   │   ├── auth/
│   │   ├── users/
│   │   ├── videos/
│   │   ├── projects/
│   │   └── ai/
│   ├── shared/                 # Cross-cutting concerns
│   │   ├── decorators/         # Express custom decorators
│   │   ├── errors/             # Custom Error classes (AppError)
│   │   ├── middlewares/        # Auth, Rate limiting, Error Handling
│   │   └── utils/              # Backend-specific utils (e.g., hashing)
│   ├── app.ts                  # Express App configuration
│   └── server.ts               # HTTP Server entrypoint
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # SQL migrations
└── tsconfig.json
```

---

## 4. Feature Structure Breakdown

Both frontend and backend group logic by **Feature (Domain)** rather than technical role. This ensures a feature can be developed or extracted independently.

### Frontend Feature Module Example (`src/features/videos/`)
```text
videos/
├── api/                        # TanStack Query hooks and API calls
│   ├── use-get-videos.ts
│   └── use-create-video.ts
├── components/                 # Feature-specific UI components
│   ├── video-card.tsx
│   └── video-list.tsx
├── hooks/                      # Feature-specific hooks
│   └── use-video-player.ts
├── stores/                     # Local feature state (Redux slice or Zustand)
│   └── video-slice.ts
├── types/                      # Feature-specific interfaces
│   └── index.ts
└── utils/                      # Feature-specific helpers
    └── format-duration.ts
```

### Backend Feature Module Example (`src/modules/videos/`)
```text
videos/
├── videos.controller.ts        # Express Route Handlers (Req/Res logic)
├── videos.routes.ts            # Router configuration
├── videos.service.ts           # Core Business Logic
├── videos.repository.ts        # Database Abstraction Layer (Prisma queries)
├── videos.types.ts             # Domain-specific DTOs and Interfaces
└── tests/
    ├── videos.controller.spec.ts
    └── videos.service.spec.ts
```

---

## 5. Shared Libraries

Packages located in `packages/` ensure absolute consistency across the monorepo.

| Package | Purpose | Example Contents |
|---------|---------|------------------|
| `@tasma/types` | Centralized TS interfaces representing Domain Models. | `User`, `Project`, `VideoTrack`, `ExportSettings` |
| `@tasma/validators` | Zod schemas used for form validation (FE) & body validation (BE). | `CreateProjectSchema`, `LoginSchema` |
| `@tasma/constants` | Shared enums, magic numbers, string constants. | `ROLES`, `SUPPORTED_VIDEO_FORMATS`, `MAX_UPLOAD_SIZE` |
| `@tasma/utils` | Shared pure functions. | `formatBytes()`, `generateId()`, `slugify()` |
| `@tasma/config` | Tooling configurations. | `eslint-preset.js`, `tailwind-preset.ts`, `tsconfig.base.json` |

---

## 6. Naming Conventions

Strict naming conventions reduce cognitive load and simplify text searching.

| Entity | Convention | Example |
|--------|------------|---------|
| **Directories** | kebab-case | `user-profile/`, `auth-module/` |
| **Files (General)** | kebab-case | `format-date.ts`, `app-error.ts` |
| **Backend Files** | kebab-case with type suffix | `user.controller.ts`, `video.service.ts` |
| **React Components** | PascalCase | `VideoPlayer.tsx`, `SubmitButton.tsx` |
| **Types/Interfaces** | PascalCase (No `I` prefix preferred unless ambiguous) | `UserProfile`, `ProjectConfig` |
| **Enums** | PascalCase | `UserRole`, `VideoStatus` |
| **Variables/Functions** | camelCase | `getUserData()`, `isActive` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| **Database Tables** | snake_case, plural | `users`, `project_assets` |
| **API Endpoints** | kebab-case, plural nouns | `GET /api/v1/video-projects` |
| **Environment Vars** | UPPER_SNAKE_CASE | `NEXT_PUBLIC_API_URL`, `REDIS_PASSWORD` |

---

## 7. Coding Standards

### TypeScript Strict Mode
TypeScript is compiled with `strict: true`. Use of `any`, `@ts-ignore`, and non-null assertions (`!`) is blocked by ESLint. Use `unknown` and type guards for untyped data.

### ESLint & Prettier
Code formatting is enforced via Prettier. Linting via ESLint (with `@typescript-eslint`).
- **Import Ordering**: Enforced via `eslint-plugin-simple-import-sort`. Built-ins -> External -> Internal Monorepo -> Relative.

### Error Handling
- **Backend**: Use custom `AppError` class. Never expose raw database or stack traces to the client. A global error middleware catches and formats all errors into a standard `{ success: false, error: { code, message } }` payload.
- **Frontend**: Handle API errors globally via Axios Interceptors / TanStack Query error callbacks. Use React Error Boundaries for rendering crashes.

### Git Conventions
- **Branches**: `feature/ticket-name`, `bugfix/ticket-name`, `hotfix/issue`, `chore/task`
- **Commits**: Conventional Commits format required (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).
- **PRs**: Require 1 approval, passing CI (Lint, Typecheck, Tests), and standard PR template completion.

---

## 8. Development Guidelines

### Adding a New Feature (End-to-End)
1. **Model**: Update `prisma/schema.prisma` -> generate client -> create migration.
2. **Types**: Add Domain Models to `@tasma/types`.
3. **Validation**: Add Zod schemas to `@tasma/validators`.
4. **Backend Layering**: 
   - Create `module/{feature}/feature.repository.ts` (DB logic)
   - Create `feature.service.ts` (Business logic)
   - Create `feature.controller.ts` (HTTP layer)
   - Register routes in `feature.routes.ts` and `app.ts`.
5. **Frontend API**: Add TanStack queries in `apps/web/src/features/{feature}/api/`.
6. **Frontend UI**: Build Atomic components in `components/`, then assemble the page in `app/`.

### Testing Strategy
- **Unit Tests** (Vitest): Business logic (Services, Utils).
- **Integration Tests** (Supertest/Testcontainers): API Endpoints and Database queries.
- **E2E Tests** (Playwright): Critical user journeys (e.g., Video Export, Signup, Billing).

---

## 9. Tech Stack Decisions

| Technology | Role | Justification | Alternatives Rejected |
|------------|------|---------------|-----------------------|
| **Next.js** | Frontend | Best-in-class SSR/SSG, File-based routing, App Router optimizations. Solves SEO and initial load times for the studio dashboard. | Vite/React (No SSR out of the box). |
| **Node/Express** | Backend API | Lightweight, mature, massive ecosystem for video/media libraries. Perfect for bridging HTTP to background worker queues. | NestJS (too much overhead/boilerplate for our specific feature-driven structure). |
| **Prisma + PostgreSQL** | Database | Type-safe ORM. PostgreSQL handles complex relational queries and JSONB for editor timeline data. | TypeORM (poor TS inference), MongoDB (lacks strict ACID relational integrity). |
| **Redis + BullMQ** | Queues | Video rendering is async. BullMQ handles concurrency, retries, and job tracking flawlessly. | RabbitMQ (harder to manage), SQS (latency). |
| **Cloudflare R2** | Storage | S3-compatible but with ZERO egress fees. Critical for a video platform moving gigabytes of media. | AWS S3 (Egress costs too high). |
| **FFmpeg/Whisper**| Media/AI | Industry standard for video manipulation and transcription. Running via Docker ensures environment consistency. | Cloud APIs (too expensive at scale). |
| **Better Auth** | Authentication | Modern, open-source, easily plugs into standard databases, great TS support. | NextAuth (too tightly coupled to Next.js), Auth0 (expensive). |

---

## 10. Dependency Rules

To prevent spaghetti architecture, strict boundaries are enforced using `eslint-plugin-boundaries`:

1. **Backend Layer Rule**: Controllers can only import Services. Services can only import Repositories or other Services. Repositories can only import Prisma Client.
2. **Frontend Feature Rule**: A feature in `src/features/A` **CANNOT** import from `src/features/B`. Shared logic must be moved to `src/shared/` or `src/components/`.
3. **Monorepo Rule**: Apps (`web`, `api`) can import Packages (`@tasma/*`), but Packages CANNOT import Apps. Packages cannot have circular dependencies.

---

## 11. Future Expansion Strategy

The architecture is explicitly designed to handle future scale:

- **Adding New AI Providers**: The AI module uses the Strategy Pattern. `AILlMService` defines an interface; we currently implement `OpenAILlMService`. Adding Anthropic just requires creating `AnthropicLlMService` and injecting it.
- **Microservices Extraction**: Because the backend is strictly separated by Domain Modules (e.g., `modules/rendering`), if the rendering engine needs to scale independently, that folder can be lifted and shifted into its own Express/Fastify service with minimal refactoring.
- **Multi-Platform (Mobile)**: Since API responses, Validation Schemas, and Types are isolated in `@tasma/*`, building an Expo/React Native app in `apps/mobile` requires zero backend changes and allows UI/logic reuse.
- **Geographic Expansion**: Stateless backend and session-less Auth (JWT/stateless tokens) allow horizontal scaling across Coolify nodes in different regions. Data is synced via PG logical replication if necessary.
- **Plugin System**: The Editor feature uses an Event Emitter and Redux Middleware. Future third-party plugins can inject reducers and listen to timeline events without modifying core source code.
