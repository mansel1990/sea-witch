# Sea Witch - Technical Architecture

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| React | v19 |
| Auth | Better Auth (email/password + Google OAuth) |
| Database | MongoDB Atlas (database: `sea-witch`) |
| State (server) | TanStack React Query v5 |
| State (client) | Zustand |
| Styling | Tailwind CSS v4, Radix UI primitives |
| External API | Python backend on Railway |

## Architecture

```
Browser
  |
  v
Next.js 15 (App Router)
  ├── Better Auth (cookie-based sessions)
  │     └── MongoDB Atlas (sea-witch db)
  │           └── Collections: user, session, account, verification
  └── API calls (fetch) ──> Python Backend (Railway)
                                ├── TMDB integration (movie data)
                                ├── Ratings & Watchlist (CRUD)
                                ├── AI Recommendations
                                ├── Semantic Search
                                └── User Summary (AI-generated)
```

Auth is handled entirely by Next.js + Better Auth + MongoDB. All movie data, ratings, watchlist, recommendations, and AI features are served by the external Python backend.

## Project Structure

```
sea-witch/
├── app/
│   ├── layout.tsx                  # Root layout (ReactQueryProvider, ToastProvider, Header)
│   ├── page.tsx                    # Home - Banner, sliders, user summary
│   ├── sign-in/page.tsx            # Sign in / sign up page
│   ├── search/page.tsx             # Regular + semantic search
│   ├── watchlist/page.tsx          # User's watchlist (protected)
│   ├── my-reviews/page.tsx         # User's ratings (protected)
│   ├── movie/[id]/
│   │   ├── page.tsx                # Movie detail page
│   │   ├── MovieHero.tsx           # Hero banner
│   │   ├── MovieActions.tsx        # Watchlist/viewed buttons
│   │   └── MovieRating.tsx         # Rating widget
│   └── api/auth/[...all]/route.ts  # Better Auth API handler
├── components/
│   ├── Header.tsx                  # Navigation, auth UI, search bar
│   ├── Banner.tsx                  # Auto-rotating movie carousel
│   ├── Slider.tsx                  # Horizontal scrollable movie grid
│   ├── RecommendedSlider.tsx       # Personalized recommendations
│   ├── UserPreferencesSlider.tsx   # Preference-based movie categories
│   ├── UserSummary.tsx             # AI-generated user profile
│   ├── SearchBar.tsx               # Debounced search with dropdown
│   ├── RatingStars.tsx             # Interactive star rating (half-star)
│   ├── Cards.tsx                   # Movie card component
│   ├── ReactQueryProvider.tsx      # React Query client provider
│   ├── tmdb.ts                     # TMDB image URL utility
│   └── ui/                         # Radix UI primitives (button, avatar, dropdown, toast, etc.)
├── lib/
│   ├── auth.ts                     # Better Auth server config
│   ├── auth-client.ts              # Better Auth React client (useSession, signIn, signOut)
│   ├── db.ts                       # MongoDB connection singleton
│   ├── constants.ts                # API_BASE_URL (Python backend)
│   ├── store.ts                    # Zustand global state (userId)
│   ├── types/
│   │   ├── user.ts                 # AddUserRequest, AddUserResponse
│   │   └── movie.ts                # Movie interface
│   ├── api/                        # All fetch()-based API functions
│   │   ├── addUser.ts
│   │   ├── fetchMovies.ts
│   │   ├── fetchMovieById.ts
│   │   ├── fetchPopularRecentMovies.ts
│   │   ├── rateMovie.ts
│   │   ├── getUserRatings.ts
│   │   ├── deleteUserRating.ts
│   │   ├── addToWatchlist.ts
│   │   ├── getUserWatchlist.ts
│   │   ├── removeFromWatchlist.ts
│   │   ├── searchMovies.ts         # Regular + semantic search
│   │   ├── getUserSummary.ts
│   │   └── getUserPreferences.ts
│   └── hooks/
│       ├── useAddUser.ts           # React Query mutation
│       └── useMovies.ts            # React Query query
├── middleware.ts                    # Route protection (cookie check)
├── .env.local                      # Environment variables (not in git)
└── next.config.ts                  # TMDB image domain allowlist
```

## Key Patterns

### Authentication
- **Server:** `lib/auth.ts` configures Better Auth with MongoDB adapter + Google OAuth
- **Client:** `lib/auth-client.ts` exports `authClient` with `useSession()`, `signIn`, `signUp`, `signOut`
- **Middleware:** Checks for session cookie on protected routes, redirects to `/sign-in`
- **Session access:** `const { data: session } = authClient.useSession()` then `session.user.id`, `.name`, `.email`, `.image`

### Data Fetching
- All API calls use native `fetch()` in `lib/api/` files
- React Query wraps some calls (movies, user registration) via hooks in `lib/hooks/`
- Debounced search (500ms) with `AbortController` for cancellation

### State Management
- **Zustand** (`lib/store.ts`): Stores `userId` globally for components that need it outside of React Query (RecommendedSlider, UserPreferencesSlider)
- **React Query**: Server state caching for movie lists

### Python Backend Endpoints
Base URL: `https://trailer-production.up.railway.app`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/add_user` | Register new user |
| GET | `/movies` | All movies |
| GET | `/movie/{id}` | Single movie |
| GET | `/movies/popular/recent` | Popular recent movies |
| GET | `/movies/upcoming` | Upcoming movies |
| POST | `/ratings` | Submit rating |
| GET | `/ratings/{userId}` | Get user ratings |
| DELETE | `/ratings/delete` | Delete rating |
| POST | `/watchlist` | Add to watchlist |
| GET | `/watchlist/{userId}` | Get watchlist |
| DELETE | `/remove_from_watchlist` | Remove from watchlist |
| GET | `/search?q=&user_id=` | Search by title |
| POST | `/semantic-search` | AI semantic search |
| GET | `/recommendations/{userId}` | Personalized recs |
| GET | `/user_preferences_movies/{userId}` | Preference categories |
| GET | `/user_summary/{userId}` | AI user profile |

## Environment Variables

```
MONGODB_URI          # MongoDB Atlas connection string
BETTER_AUTH_SECRET   # 32-char secret for session signing
BETTER_AUTH_URL      # App URL (http://localhost:3000 in dev)
GOOGLE_CLIENT_ID     # Google OAuth client ID
GOOGLE_CLIENT_SECRET # Google OAuth client secret
```
