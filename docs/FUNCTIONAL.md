# Sea Witch - Functional Overview

Sea Witch is a movie discovery and recommendation platform. Users sign up, rate movies, build watchlists, and receive AI-powered personalized recommendations.

## Features

### For All Visitors (No Sign-In Required)
- **Home Page** - Browse popular recent movies and trending/upcoming titles via horizontal sliders
- **Movie Banner** - Auto-rotating carousel of featured movies
- **Movie Details** - View full details for any movie (poster, overview, release date)

### For Signed-In Users
- **Rate Movies** - Half-star precision (0.5-5) rating system on any movie page
- **Watchlist** - Save movies to watch later; add/remove from any movie page or the watchlist view
- **My Reviews** - Browse all movies you've rated, with search/filter
- **Search** - Find movies by title with debounced search and keyboard navigation
- **Semantic Search** - Describe what you're looking for in natural language (e.g., "a thrilling action movie with car chases") and get AI-matched results
- **Personalized Recommendations** - "Handpicked For You" slider based on your rating history
- **Preference-Based Browsing** - Movie categories tailored to your taste profile
- **User Summary** - AI-generated profile summary describing your movie preferences

## User Flows

### Sign Up / Sign In
1. Click "Sign In" in the header
2. Create an account with email/password, or sign in with Google
3. On first sign-in, user is auto-registered with the backend

### Rating a Movie
1. Navigate to any movie (via search, slider, or direct link)
2. Click stars to rate (supports half-stars)
3. Rating is saved immediately; can be deleted with the trash icon

### Managing Watchlist
1. On a movie page, click "Add to Watchlist"
2. View all watchlisted movies at `/watchlist`
3. Remove movies from watchlist via the trash icon on hover

### Searching
1. Use the search bar in the header (desktop) or navigate to `/search`
2. Toggle between "Regular Search" (title match) and "Free Word Search" (semantic/AI)
3. Click any result to view the movie

## Protected Routes
- `/watchlist` and `/my-reviews` require sign-in (redirects to `/sign-in`)
- All other pages are accessible without an account
