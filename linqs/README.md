# Linqs

**A full-stack event discovery platform connecting users with local communities and micro-events.**

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2.5-646CFF?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel)](https://vercel.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.14-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## Interview technical summary

High-level reference for software engineering interviews. Aligned with the **current** repository layout and dependencies.

### Complete tech stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React 19, Vite (rolldown-vite 7.x), JavaScript/JSX (plus a few `.tsx` modal components) |
| **Styling** | Tailwind CSS 3, global CSS in `src/index.css` |
| **Routing** | React Router DOM 7 (`BrowserRouter`, nested routes under a layout) |
| **Maps (dependency present)** | `react-map-gl`, `mapbox-gl` (installed; wire-up may vary by branch) |
| **Backend** | **None as a separate service.** The app talks directly to **Supabase** (managed BaaS). |
| **Database** | **PostgreSQL** (hosted by Supabase) |
| **Auth** | Supabase Auth (email/password; session via `supabase.auth`) |
| **Storage** | Supabase Storage (e.g. `event-banners`, `board-uploads`, `community-content`) |
| **Realtime** | Supabase Realtime (e.g. `postgres_changes` on `notifications` where used) |
| **Analytics** | Vercel Analytics (`@vercel/analytics`) |
| **Toasts** | `react-hot-toast` |
| **Icons** | `lucide-react` |
| **Hosting** | **Vercel** (SPA rewrite: all routes → `index.html` per `vercel.json`) |
| **Env** | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (and any optional `VITE_*` keys such as Mapbox if used) |

### Core architecture: how the frontend talks to “backend” and database

1. **Single-page application (SPA)** built with Vite; there is **no custom Node/Express API** in this repo.
2. **`src/lib/supabase.js`** creates one **Supabase JS client** using the anon key (browser-safe, RLS-enforced).
3. **Data access** is **direct from React**: pages and services call `supabase.from('...')`, `supabase.storage`, `supabase.auth`, and (where implemented) **Realtime channels** for live updates.
4. **Security model** is **Row Level Security (RLS)** and auth-aware policies on Supabase—not hidden API routes in this codebase.
5. **Deployment**: static build output; Vercel serves the app and rewrites unknown paths to `index.html` for client-side routing.

### Main data models / database schema (inferred from code)

Tables and buckets referenced in the codebase include (not exhaustive of every column):

| Area | Tables / buckets |
|------|-------------------|
| **Events** | `events`, `featured_picks`, `event_attendees`, `saved_events` |
| **Auth / users** | Supabase Auth users; `profiles` |
| **Communities** (some routes may be commented in `App.jsx`) | `communities`, `community_members`, `discussion_posts`, `community_media` |
| **Board** | `yaps`, `flashes`, `bites`, `barters` (+ aggregation in `boardService.js`) |
| **Notifications** | `notifications` (e.g. `recipient_id`, `message`, `is_read`, `created_at`) |
| **Storage** | Buckets such as `event-banners`, `board-uploads`, `community-content` |

Schema details (exact columns and constraints) live in **Supabase** (SQL migrations / dashboard), not necessarily as `.sql` files in this repo.

### State management approach

- **React Context**
  - **`AuthContext`**: `user`, `session`, `loading`, plus `signUp` / `signIn` / `signOut` wrapping Supabase Auth.
  - **`EventsContext`**: holds event list state and `handleAddEvent` (also contains legacy placeholder seed data—real listings often come from Supabase in pages like `Home` / `Explore`).
  - **`SavedEventsContext`**: saved event IDs + full saved events, sync with Supabase on load and on auth changes; **optimistic updates** for save/unsave.
- **Local component state** for UI (modals, filters, forms).
- **Custom hooks**
  - e.g. **`useEventAttendance`**: loads join state from `event_attendees`, toggles join/leave with optimistic UI and toasts.
- **No Redux/Zustand** in `package.json`; complexity is handled with context + hooks + service modules under `src/lib/`.

### Complex UI rendering logic (brief)

- **Event discovery**: `Explore.jsx` fetches from Supabase, maps DB fields to card-friendly shape, applies category + date filters client-side.
- **Board**: `TheBoard.jsx` uses **`react-masonry-css`** for a Pinterest-style column layout over heterogeneous post types (`YapCard`, `FlashCard`, etc.).
- **Event creation**: **`EventForm.jsx`** is a large, multi-section form (dates, recurring days, time pickers, online vs in-person, image upload to Storage, then insert into `events`).
- **Modals**: several modals (e.g. event detail, create event) use fixed positioning, scroll regions, and keyboard handling.
- **Design system**: neo-brutalist styling (thick borders, hard shadows) implemented mostly with Tailwind utility classes.

### Most technically complex feature / integration (and why)

**Strong candidates:**

1. **`src/components/EventForm.jsx` (plus Supabase Storage + `events` insert)**  
   - Long form with branching logic (recurring vs one-off, multi-day, end times, category dropdown, tags).  
   - **Image pipeline**: file → Storage bucket → public URL → persist on `events`.  
   - **Edge cases**: validation across fields, time ordering, Supabase errors, success state and reload.  
   - **Why it’s hard**: not algorithmic complexity, but **integration surface area** (auth, storage, DB, UX) in one component.

2. **`src/lib/boardService.js` + Board UI**  
   - Multiple post types and tables; **`fetchAllPosts`** merges/aggregates several sources into one feed.  
   - **Why it’s hard**: coordinating **consistent shape**, ordering, and error handling across heterogeneous entities.

3. **`GroupDetail.jsx` (community hub)**  
   - Many related queries (members, events, posts, media, profiles).  
   - **Why it’s hard**: **N+1-style patterns**, loading states, and permissions across joined data.

4. **`NotificationBell.jsx` + Realtime** (if present on your branch)  
   - Initial fetch + **Realtime subscription** + optimistic read state.  
   - **Why it’s hard**: subscription lifecycle, duplicate events, and staying in sync with RLS.

For most interviews, **`EventForm.jsx`** or **`boardService.js`** are the clearest “deep dive” files.

---

## 🎯 Overview

Linqs is a production-ready event discovery platform built with modern web technologies. The application enables users to discover local events, join micro-communities, create and manage events, and interact with community-driven content. Built with performance and security as core principles, featuring optimized React patterns, Row Level Security policies, and a scalable PostgreSQL architecture.

**Live Demo:** [linqs-sand.vercel.app](https://linqs-sand.vercel.app/)

---

## 🛠️ Tech Stack

- **Frontend:** React 19.2.0, Vite 7.2.5, Tailwind CSS 3.4.14
- **Backend:** Supabase (PostgreSQL), Supabase Auth, Supabase Storage, Supabase Realtime (where used)
- **Routing:** React Router DOM 7.10.1
- **Maps (deps):** `react-map-gl`, `mapbox-gl`
- **Deployment:** Vercel
- **Analytics:** Vercel Analytics (`@vercel/analytics`)
- **State Management:** React Context API, Custom Hooks
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

For a **concise interview-oriented breakdown** (architecture, schema overview, state management, hardest parts), see **[Interview technical summary](#interview-technical-summary)** above.

---

## ✨ Key Features

### 🔐 Authentication & Security
- **Secure Authentication:** Implemented via Supabase Auth with email/password authentication
- **Row Level Security (RLS):** Database-level security policies written in SQL ensure users can only access and modify their own data
  - Users can only edit their own profiles and events
  - Community membership and permissions enforced at the database level
  - Protected routes with authentication-aware UI components

### ⚡ Performance Optimization
- **Optimized React Hooks:** Comprehensive `useEffect` cleanup patterns prevent memory leaks and unnecessary re-renders
- **Dependency Auditing:** All hooks audited and fixed to prevent infinite loops and database over-fetching
- **Cleanup Functions:** Proper cleanup flags (`isMounted`) prevent state updates after component unmount
- **Parallel Data Fetching:** Strategic use of `Promise.all()` for concurrent database queries
- **Optimistic UI Updates:** Immediate feedback for user interactions (save events, join communities) with rollback on error

### 🗄️ Database Architecture
- **PostgreSQL via Supabase:** Relational database with proper foreign key constraints
- **Core Tables:**
  - `events` - Event listings with metadata (dates, times, categories, tags, location)
  - `communities` - Micro-community groups with host management
  - `profiles` - Extended user profiles linked to Supabase Auth
  - `community_members` - Many-to-many relationship for community membership
  - `discussion_posts` - Community discussion threads
  - `community_media` - Media gallery for communities
  - `featured_picks` - Curated featured events
- **Storage:** Supabase Storage buckets for event banners and community media

### 🎨 User Experience
- **Neo-Brutalist Design System:** Bold, high-contrast UI with hard shadows and sharp edges
- **Responsive Design:** Mobile-first approach with breakpoint optimization
- **Real-time Auth State:** Supabase auth state subscriptions for seamless login/logout
- **Event Discovery:** Category-based filtering, search, and exploration
- **Community Features:** Join/leave communities, create posts, upload media
- **Event Management:** Create, edit, and manage events with image uploads

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd linqs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Database**
   - Create tables: `events`, `communities`, `profiles`, `community_members`, `discussion_posts`, `community_media`, `featured_picks`
   - Configure Row Level Security (RLS) policies
   - Create storage bucket `event-banners` with public read access

5. **Run development server**
```bash
npm run dev
```
   Application will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
linqs/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── EventCard.jsx
│   │   ├── EventForm.jsx
│   │   ├── Header.jsx
│   │   └── ...
│   ├── pages/            # Route components
│   │   ├── Home.jsx
│   │   ├── Explore.jsx
│   │   ├── Community.jsx
│   │   └── ...
│   ├── context/          # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── SavedEventsContext.jsx
│   ├── hooks/            # Custom React hooks
│   │   └── useEventAttendance.js
│   ├── lib/              # Utility functions
│   │   ├── supabase.js
│   │   ├── eventAttendeesService.js
│   │   └── savedEventsService.js
│   └── App.jsx           # Main app component
├── package.json
└── vite.config.js
```

---

## 🔒 Security Implementation

- **Row Level Security (RLS):** All database tables protected with SQL policies
- **Authentication:** Supabase Auth handles secure session management
- **Authorization:** User permissions enforced at database level
- **Input Validation:** Client-side validation with server-side enforcement
- **Secure Storage:** Environment variables for sensitive keys

---

## 🎯 Technical Highlights

- **Performance:** Optimized React hooks with cleanup patterns to prevent memory leaks
- **Scalability:** PostgreSQL database with proper indexing and relationships
- **Type Safety:** Consistent data transformation (snake_case ↔ camelCase)
- **Error Handling:** Comprehensive error boundaries and user feedback
- **Code Quality:** ESLint configuration with React hooks rules

---

## 📄 License

Private project - All rights reserved

---

## 👤 Author

Built as a portfolio project demonstrating full-stack development capabilities.
