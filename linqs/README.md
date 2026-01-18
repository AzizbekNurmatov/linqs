# Linqs

**A full-stack event discovery platform connecting users with local communities and micro-events.**

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2.5-646CFF?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel)](https://vercel.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.14-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## 🎯 Overview

Linqs is a production-ready event discovery platform built with modern web technologies. The application enables users to discover local events, join micro-communities, create and manage events, and interact with community-driven content. Built with performance and security as core principles, featuring optimized React patterns, Row Level Security policies, and a scalable PostgreSQL architecture.

**Live Demo:** [linqs-sand.vercel.app](https://linqs-sand.vercel.app/)

---

## 🛠️ Tech Stack

- **Frontend:** React 19.2.0, Vite 7.2.5, Tailwind CSS 3.4.14
- **Backend:** Supabase (PostgreSQL), Supabase Auth, Supabase Storage
- **Routing:** React Router DOM 7.10.1
- **Deployment:** Vercel
- **State Management:** React Context API, Custom Hooks
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

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
