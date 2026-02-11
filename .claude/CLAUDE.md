# CLAUDE.md - Project Rules for Sea Witch

## Project Overview

Sea Witch is a movie discovery and recommendation app. Next.js 15 frontend with a Python backend for movie data and AI features. Auth and user sessions are handled by Better Auth with MongoDB.

## Commands

- `npm run dev` - Start dev server (Turbopack)
- `npm run build` - Production build
- `npm run lint` - Run ESLint

## Architecture Rules

### Authentication
- Auth is handled by Better Auth (`lib/auth.ts` server, `lib/auth-client.ts` client)
- Use `authClient.useSession()` in client components to get the current user
- Session shape: `session.user.id`, `session.user.name`, `session.user.email`, `session.user.image`
- Never import from `@clerk/nextjs` - that was the old auth system and has been fully removed
- Protected routes (`/watchlist`, `/my-reviews`) are guarded by middleware cookie check

### Data Fetching
- All backend API calls go through functions in `lib/api/` using native `fetch()`
- The Python backend base URL is in `lib/constants.ts`
- Use React Query (`@tanstack/react-query`) for data that benefits from caching; hooks go in `lib/hooks/`
- Debounce search inputs (500ms) and use `AbortController` for cancellable requests

### State Management
- **Zustand** (`lib/store.ts`): Only for `userId` - used by components that need the user ID outside of session context (RecommendedSlider, UserPreferencesSlider)
- **React Query**: For server state (movie lists, ratings, etc.)
- Do not add new global state to Zustand unless truly needed; prefer React Query or component state

### Naming Conventions
- User identifier field is `userId` (TypeScript) / `user_id` (API payloads/JSON)
- Never use `clerkUserId` or `clerk_user_id` - those are legacy
- API function parameters use camelCase (`userId`, `movieId`)
- API request/response bodies use snake_case (`user_id`, `movie_id`) to match the Python backend

### File Organization
- Pages go in `app/` (Next.js App Router)
- Reusable components go in `components/`
- API functions go in `lib/api/` (one function per file, default export)
- Types go in `lib/types/`
- React Query hooks go in `lib/hooks/`
- UI primitives (Radix-based) go in `components/ui/`

### Styling
- Tailwind CSS v4 (no config file needed)
- Dark theme (Netflix-inspired): black background, red (#e50914) primary, gray-800/900 surfaces
- All pages use `"use client"` directive since they rely on auth hooks and interactivity
- Use existing Radix UI components from `components/ui/` (Button, Avatar, DropdownMenu, etc.)

### MongoDB
- Database name: `sea-witch` (in the existing Atlas cluster)
- Connection singleton in `lib/db.ts` - uses `globalThis` caching in dev
- Better Auth manages its own collections: `user`, `session`, `account`, `verification`
- Additional collections for app data will be added as we migrate endpoints from Python

### Python Backend
- Base URL: `https://trailer-production.up.railway.app`
- Handles: movie data (TMDB), ratings, watchlist, search, recommendations, AI features
- We are gradually migrating endpoints from Python to Next.js API routes
- When creating new Next.js API routes, put them under `app/api/`

### What NOT to Do
- Do not install or reference `@clerk/nextjs`
- Do not use `pages/` router - this is App Router only
- Do not hardcode the Python backend URL - always use `API_BASE_URL` from `lib/constants.ts`
- Do not add MongoDB connection code outside of `lib/db.ts`
- Do not store sensitive data in client-side state
