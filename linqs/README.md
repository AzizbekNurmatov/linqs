# Linqs - Event Discovery & Community Platform

Linqs is a modern web application for discovering local events and connecting with micro-communities. Built with React and Vite, it provides an intuitive interface for browsing events, filtering by categories, exploring genres, and engaging with community posts. The application features full authentication, database integration with Supabase, saved events functionality, and community/group management.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- A Supabase account and project

### Environment Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Note your project URL and anon key from the project settings

2. **Configure Environment Variables**
   - Create a `.env` file in the root directory (`linqs/.env`)
   - Add the following variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   - **Important**: Never commit the `.env` file to version control

3. **Set Up Supabase Database Tables**
   The application requires the following tables in your Supabase database:
   - `events` - Stores event information
   - `communities` - Stores community/group data
   - `community_members` - Tracks user memberships in communities
   - `discussion_posts` - Stores community discussion posts
   - `community_media` - Stores media files for communities
   - `profiles` - User profile information (extends auth.users)

   See the Database Schema section below for table structures.

4. **Set Up Supabase Storage**
   - Create a storage bucket named `event-banners` in your Supabase project
   - Configure the bucket with public access for reading images
   - Set up appropriate RLS (Row Level Security) policies

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
linqs/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and other assets
│   ├── components/        # Reusable React components
│   │   ├── AddMediaModal.jsx      # Modal for uploading media to communities
│   │   ├── CategoryModal.jsx      # Full-screen category filter modal
│   │   ├── EventCard.jsx          # Individual event card component
│   │   ├── EventDetailModal.jsx   # Modal showing full event details
│   │   ├── EventForm.jsx          # Form for creating/editing events
│   │   ├── EventList.jsx          # Grid container for event cards
│   │   ├── FeaturesBentoGrid.jsx  # Feature showcase grid
│   │   ├── FilterBar.jsx          # Category filter pills bar
│   │   ├── Footer.jsx             # Site footer component
│   │   ├── Header.jsx             # Navigation header with auth
│   │   ├── HeroSection.jsx        # Home page hero section
│   │   ├── Layout.jsx             # Page layout wrapper
│   │   ├── Login.jsx              # User login page
│   │   ├── Logout.jsx             # Logout component
│   │   ├── Register.jsx           # User registration page
│   │   └── SavedEventsDrawer.jsx  # Side drawer for saved events
│   ├── context/           # React Context providers
│   │   ├── AuthContext.jsx        # Authentication state management
│   │   ├── EventsContext.jsx      # Events state (legacy, for backward compatibility)
│   │   └── SavedEventsContext.jsx # Saved events state with localStorage
│   ├── lib/               # Utility libraries
│   │   └── supabase.js    # Supabase client configuration
│   ├── pages/             # Page components (routes)
│   │   ├── Community.jsx          # Community feed page
│   │   ├── Explore.jsx            # Genre exploration page
│   │   ├── GenreDetail.jsx        # Genre-specific event page
│   │   ├── GroupDetail.jsx        # Individual community/group detail page
│   │   └── Home.jsx               # Home page with event listings
│   ├── App.jsx            # Main app component with routing
│   ├── main.jsx           # Application entry point
│   ├── index.css          # Global styles
│   └── App.css            # App-specific styles
├── .env                   # Environment variables (not in git)
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── eslint.config.js       # ESLint configuration
```

## 📄 File Descriptions

### Entry Points

#### `index.html`
- The HTML template that serves as the entry point for the application
- Contains the root `<div id="root">` where React mounts
- Links to the main JavaScript module

#### `src/main.jsx`
- **Purpose**: Application entry point that initializes React
- **What it does**: 
  - Imports global CSS styles
  - Creates a React root and renders the `App` component
  - Wraps the app in `StrictMode` for development warnings

### Core Application Files

#### `src/App.jsx`
- **Purpose**: Main application component that sets up routing and context
- **What it does**:
  - Wraps the entire app in multiple context providers:
    - `AuthProvider` - Manages user authentication state
    - `EventsProvider` - Legacy event state (for backward compatibility)
    - `SavedEventsProvider` - Manages saved events with localStorage persistence
  - Sets up React Router with `BrowserRouter`
  - Configures React Hot Toast for notifications
  - Defines all application routes:
    - `/login` - User login page
    - `/register` - User registration page
    - `/` - Home page (protected by Layout)
    - `/explore` - Explore events by genre
    - `/explore/:genre` - Genre-specific event page
    - `/community` - Community feed page
    - `/group/:id` - Individual community/group detail page
  - Uses `Layout` component to provide consistent header/footer structure

#### `src/lib/supabase.js`
- **Purpose**: Supabase client configuration and initialization
- **What it does**:
  - Creates and exports a Supabase client instance
  - Reads environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`)
  - Throws an error if environment variables are missing
  - Used throughout the app for database operations and authentication

#### `src/context/AuthContext.jsx`
- **Purpose**: Global authentication state management using React Context
- **What it does**:
  - Manages user session and authentication state
  - Provides `user`, `session`, and `loading` state
  - Exports authentication methods:
    - `signUp(email, password, metadata)` - Register new users
    - `signIn(email, password)` - Sign in existing users
    - `signOut()` - Sign out current user
  - Listens to Supabase auth state changes in real-time
  - Exports `useAuth()` hook for accessing auth state throughout the app

#### `src/context/EventsContext.jsx`
- **Purpose**: Legacy event state management (maintained for backward compatibility)
- **What it does**:
  - Provides a centralized store for events (currently using mock data)
  - Contains initial mock event data (6 sample events)
  - Exports `EventsProvider` component that wraps the app
  - Exports `useEvents` hook for accessing events and `handleAddEvent` function
  - Formats dates and times when new events are added
  - **Note**: Most components now fetch events directly from Supabase instead

#### `src/context/SavedEventsContext.jsx`
- **Purpose**: Manages saved/bookmarked events with localStorage persistence
- **What it does**:
  - Stores saved events in localStorage for persistence across sessions
  - Provides `savedEvents` array and helper functions:
    - `toggleSaveEvent(event)` - Add or remove event from saved list
    - `isEventSaved(event)` - Check if an event is saved
  - Automatically syncs with localStorage on changes
  - Exports `useSavedEvents()` hook for accessing saved events state

### Page Components (`src/pages/`)

#### `src/pages/Home.jsx`
- **Purpose**: Main landing page of the application
- **What it does**:
  - Fetches events from Supabase database on component mount
  - Displays the hero section with tagline and call-to-action buttons
  - Shows a features bento grid showcasing key platform features
  - Renders a filterable list of events using `EventList` component
  - Manages category filtering state (selected categories)
  - Handles event card clicks to open detail modals
  - Provides "Interested" button that saves/unsaves events using `SavedEventsContext`
  - Provides "Boost" button handler (placeholder for future functionality)
  - Filters events based on selected categories by searching event title/description
  - Maps Supabase event data (snake_case) to component-friendly format (camelCase)
  - Handles loading states and error handling for database queries
  - Formats time ranges (start_time and end_time) for display

#### `src/pages/Explore.jsx`
- **Purpose**: Genre exploration page with visual category cards
- **What it does**:
  - Fetches events from Supabase database on component mount
  - Displays a bento box grid layout with genre cards (Live Music, Tech, Food, Sports, Arts, Nightlife)
  - Each card links to a genre-specific detail page (`/explore/:genre`)
  - Features animated hover effects and custom fonts per genre
  - Shows a "Featured" card with live indicator badge
  - Uses gradient backgrounds and icons (from lucide-react) for each genre
  - Includes custom CSS animations (pulse-dot, glitch effects)
  - Maps Supabase event data to component format
  - Handles loading states for database queries

#### `src/pages/GenreDetail.jsx`
- **Purpose**: Displays events for a specific genre
- **What it does**:
  - Uses URL parameter (`:genre`) to determine which genre to display
  - Fetches events from Supabase filtered by genre/category
  - Maps genre slugs to display names, gradients, and fonts
  - Displays filtered events in a grid layout
  - Provides a back button to return to the Explore page
  - Uses genre-specific styling (colors and fonts) based on the genre config
  - Shows empty state if no events found for the genre

#### `src/pages/Community.jsx`
- **Purpose**: Community feed page with posts and groups
- **What it does**:
  - Fetches communities from Supabase database
  - Displays a three-column layout:
    - Left: "My Tribes" sidebar showing user's joined groups (from `community_members` table)
    - Center: "The City Wall" feed with community cards
    - Right: "Discover" sidebar with suggested groups to join
  - Shows community cards with cover images, member counts, and descriptions
  - Links to individual group detail pages (`/group/:id`)
  - Handles authentication state (shows login prompt if not authenticated)
  - Features responsive design with mobile-friendly layout

#### `src/pages/GroupDetail.jsx`
- **Purpose**: Individual community/group detail page with tabs for Discussion, Events, Members, and Media
- **What it does**:
  - Fetches community data from Supabase (`communities` table)
  - Displays community hero section with cover image, logo, description, and stats
  - Implements tabbed interface with four sections:
    - **Discussion**: Shows discussion posts with create post widget
    - **Events**: Lists upcoming events for the community
    - **Members**: Displays community members with avatars
    - **Media**: Shows uploaded photos and media
  - Handles join/leave community functionality
  - Allows authenticated users to create events within the community
  - Allows authenticated users to upload media to the community
  - Fetches and displays:
    - Community events from `events` table filtered by `community_id`
    - Discussion posts from `discussion_posts` table
    - Members from `community_members` table with profile data
    - Media from `community_media` table
  - Includes post creation widget with anonymous posting option
  - Shows member count and events this week statistics

### Layout Components

#### `src/components/Layout.jsx`
- **Purpose**: Wrapper component that provides consistent page structure
- **What it does**:
  - Renders the `Header` component at the top
  - Uses React Router's `Outlet` to render child route components
  - Manages saved events drawer state and rendering
  - Passes `handleAddEvent` function to Header for event creation
  - Passes saved events drawer open/close handlers to Header
  - Renders `SavedEventsDrawer` component when open
  - Provides a flex layout structure for the entire app

#### `src/components/Header.jsx`
- **Purpose**: Navigation header with floating design and authentication
- **What it does**:
  - Displays a floating navbar with rounded corners
  - Shows brand logo ("Linqs") on the left
  - Navigation links (Home, Explore, Community) in the center (hidden on mobile)
  - "Create Event" button that opens the event form modal (requires authentication)
  - Saved Events button that opens the saved events drawer
  - Mobile menu toggle button for responsive navigation
  - Authentication-aware UI:
    - Shows user email (truncated) and logout button when authenticated
    - Shows login link when not authenticated
  - Manages state for showing/hiding the event form modal
  - Renders `EventForm` component in a modal overlay when "Create Event" is clicked
  - Uses `useAuth()` hook to access authentication state

#### `src/components/Login.jsx`
- **Purpose**: User authentication login page
- **What it does**:
  - Displays a centered login form with email and password fields
  - Uses `useAuth()` hook to handle sign-in
  - Validates form inputs
  - Shows error messages for failed login attempts
  - Redirects to home page on successful login
  - Includes link to registration page
  - Features modern gradient design matching the app aesthetic

#### `src/components/Register.jsx`
- **Purpose**: User registration page
- **What it does**:
  - Displays a registration form with email and password fields
  - Uses `useAuth()` hook to handle user sign-up
  - Validates form inputs and password requirements
  - Shows error messages for failed registration attempts
  - Redirects to home page on successful registration
  - Includes link to login page
  - Features modern gradient design matching the app aesthetic

#### `src/components/Logout.jsx`
- **Purpose**: Logout button component
- **What it does**:
  - Provides a logout button that calls `signOut()` from `AuthContext`
  - Handles logout errors gracefully
  - Used in Header component for authenticated users

#### `src/components/SavedEventsDrawer.jsx`
- **Purpose**: Side drawer component for displaying saved/bookmarked events
- **What it does**:
  - Slides in from the right side of the screen
  - Fetches saved events from `SavedEventsContext`
  - Displays events in a scrollable list with thumbnails
  - Shows event title, location, and formatted date
  - Sorts events by most recently saved first
  - Allows clicking events to view full details in `EventDetailModal`
  - Shows empty state when no events are saved
  - Persists saved events in localStorage via `SavedEventsContext`
  - Includes backdrop blur and smooth animations

#### `src/components/AddMediaModal.jsx`
- **Purpose**: Modal for uploading media (photos) to communities
- **What it does**:
  - Allows authenticated users to upload images to a community
  - Supports drag & drop or file picker for image selection
  - Uploads images to Supabase Storage
  - Inserts media records into `community_media` table
  - Shows upload progress and success/error states
  - Refreshes media gallery after successful upload
  - Validates file types and sizes

#### `src/components/Footer.jsx`
- **Purpose**: Site footer with copyright and links
- **What it does**:
  - Displays copyright information
  - Shows links to Privacy Policy, Terms of Service, and Contact (placeholders)
  - Responsive layout (stacks on mobile, horizontal on desktop)

### Feature Components

#### `src/components/HeroSection.jsx`
- **Purpose**: Hero section on the home page
- **What it does**:
  - Displays the main tagline: "Real life is better together. Discover local events and micro-communities."
  - Shows call-to-action buttons ("Get Started" and "Watch Demo")
  - Features a floating ecosystem visualization on the right:
    - Central hero card with event preview
    - Chat bubble satellite showing social interaction
    - Community pill showing friends going to events
    - Location map card with pulsing pin
  - Renders the `FilterBar` component below the hero content
  - Passes category selection handlers to FilterBar

#### `src/components/FilterBar.jsx`
- **Purpose**: Category filter bar with priority pills
- **What it does**:
  - Displays scrollable priority category pills (top 6 featured tags)
  - Shows active/inactive states for selected categories
  - Includes a filter button that opens the `CategoryModal`
  - Uses gradient masks for smooth scrolling effect
  - Handles category toggle when pills are clicked

#### `src/components/CategoryModal.jsx`
- **Purpose**: Full-screen modal for selecting multiple categories
- **What it does**:
  - Displays categories organized by sections:
    - By Vibe (Chill, Party, Networking, Intense)
    - By Topic (Tech, Art, Music, Business)
    - By Campus (UNC, NYU, Main Quad)
    - By Activities (Hiking, Yoga, Gaming, etc.)
    - By Social (Dating, Friendship, Study Group, etc.)
  - Shows selected categories with gradient styling
  - Provides "Clear All" and "Apply Filters" buttons
  - Closes on Escape key press
  - Prevents body scroll when open
  - Exports `featuredTags` array used by FilterBar

#### `src/components/FeaturesBentoGrid.jsx`
- **Purpose**: Showcases platform features in a bento grid layout
- **What it does**:
  - Displays an infinite scrolling tag ticker at the top (#NightLife, #TechTalks, etc.)
  - Shows three feature cards:
    - "Discover Locally" - Large card with map visualization and pulsing location pins
    - "Micro-Communities" - Card showing stacked avatars representing groups
    - "Instant Chat" - Card with chat bubble preview
  - Uses deterministic color assignment for tags based on hash function

#### `src/components/EventList.jsx`
- **Purpose**: Container component that renders a grid of event cards
- **What it does**:
  - Takes an array of events as props
  - Maps over events and renders `EventCard` components
  - Passes event data and handler functions (onInterested, onBoost, onCardClick) to each card
  - Uses responsive grid layout (1 column on mobile, 3 columns on desktop)

#### `src/components/EventCard.jsx`
- **Purpose**: Individual event card component
- **What it does**:
  - Displays event image with date badge overlay (day and month)
  - Shows category badge in top-right corner
  - Renders event title, description, location, and time
  - Includes a face pile showing 3 mock attendee avatars
  - Provides action buttons:
    - Heart icon for "Interested" (saves/unsaves event)
    - Lightning icon for "Boost" (promotes event)
  - Handles click events to open event detail modal
  - Extracts category from event title/description using keyword matching
  - Includes hover effects and transitions

#### `src/components/EventDetailModal.jsx`
- **Purpose**: Modal that displays detailed information about an event
- **What it does**:
  - Shows full event image as header
  - Displays event title, host information, date, time, and location
  - Renders full event description
  - Generates and displays colorful hashtags based on event content
  - Closes on Escape key or backdrop click
  - Prevents body scroll when open
  - Includes smooth open/close animations
  - Uses a hash function to assign consistent colors to tags

#### `src/components/EventForm.jsx`
- **Purpose**: Comprehensive form component for creating new events with Supabase integration
- **What it does**:
  - Collects event information:
    - Title (required)
    - Description (optional)
    - Location/Meeting Link (required, conditional on online/in-person)
    - Start Date (required)
    - End Date (optional, can be added)
    - Start Time (required)
    - End Time (optional, can be added)
    - Image upload (drag & drop or file picker) or URL input
    - Category selection (dropdown with icons): Social Activities, Hobbies, Wellness, Tech, Business, Culture, Food
    - Tags (optional) - can add custom tags by typing and pressing Enter
    - Online/In-person toggle
  - **Supabase Integration**:
    - Requires user authentication (checks for logged-in user)
    - Uploads images to Supabase Storage (`event-banners` bucket)
    - Inserts event data into `events` table
    - Supports `community_id` parameter for community-specific events
    - Handles image file uploads with unique file naming
  - Validates form before submission (date/time ranges, required fields)
  - Shows success state with animated checkmark after submission
  - Provides context-aware date/time layout (single-day vs multi-day)
  - Shows selected tags with remove buttons
  - Uses deterministic tag colors matching the design system
  - Handles loading states during submission
  - Refreshes page after successful event creation to show new event

## 🔄 Application Flow

### User Journey

1. **Authentication** (`/login` or `/register`)
   - New users register with email and password
   - Existing users sign in with credentials
   - Authentication state is managed by `AuthContext` and Supabase
   - Users are redirected to home page after successful authentication

2. **Landing on Home Page** (`/`)
   - Events are fetched from Supabase database on page load
   - User sees hero section with tagline
   - Views features bento grid
   - Sees list of events from database
   - Can filter events using category pills or filter modal
   - Can save events by clicking the "Interested" (heart) button

3. **Filtering Events**
   - Click category pills in FilterBar to toggle filters
   - Click filter button to open CategoryModal
   - Select multiple categories across different sections
   - Events are filtered in real-time based on selected categories
   - Filtering works on events fetched from Supabase

4. **Viewing Event Details**
   - Click any event card to open EventDetailModal
   - View full event information, tags, and details
   - See online event links or physical location addresses
   - Close modal by clicking X, backdrop, or pressing Escape

5. **Saving Events**
   - Click heart icon on any event card
   - Event is saved to `SavedEventsContext` and localStorage
   - Click saved events button in header to view all saved events
   - Saved events persist across browser sessions

6. **Creating an Event**
   - Click "Create Event" button in header (requires authentication)
   - Fill out EventForm with event details:
     - Upload banner image (drag & drop or file picker)
     - Enter title, description, date, time
     - Select category from dropdown
     - Add tags
     - Choose online or in-person event
   - Image is uploaded to Supabase Storage
   - Event data is inserted into `events` table
   - Success state shown with animated checkmark
   - Page refreshes to show new event

7. **Exploring Genres** (`/explore`)
   - View genre cards in bento grid layout
   - Events are fetched from Supabase
   - Click a genre card to navigate to genre detail page
   - See genre-specific styling and filtered events

8. **Community Feed** (`/community`)
   - View communities fetched from Supabase
   - See "My Tribes" (joined groups) in left sidebar
   - Browse community cards in center feed
   - Discover suggested groups in right sidebar
   - Click any community to view detail page

9. **Group Detail Page** (`/group/:id`)
   - View community information, cover image, and stats
   - Browse tabs: Discussion, Events, Members, Media
   - Join or leave the community (requires authentication)
   - Create discussion posts
   - Create events within the community
   - Upload media to the community gallery

### Data Flow

1. **Authentication Flow**:
   - User credentials are sent to Supabase Auth
   - Session is stored and managed by Supabase
   - `AuthContext` listens to auth state changes
   - Components use `useAuth()` hook to access user state
   - Protected routes check authentication before rendering

2. **Events Data Management**:
   - Events are fetched from Supabase `events` table on component mount
   - Home, Explore, and GroupDetail pages fetch events independently
   - Event data is transformed from snake_case (database) to camelCase (components)
   - Time formatting handles both single times and time ranges
   - Events are filtered client-side based on category selections
   - New events are inserted directly into Supabase via `EventForm`

3. **Saved Events Management**:
   - Saved events are stored in `SavedEventsContext`
   - State is persisted to localStorage automatically
   - Events are saved/unsaved via `toggleSaveEvent()` function
   - Saved events drawer displays events sorted by save date
   - No database integration (local-only feature)

4. **Category Filtering**:
   - Selected categories are stored in component state (Home, Explore)
   - Categories are passed down to `FilterBar` and `HeroSection`
   - Filtering logic searches event titles and descriptions for category keywords
   - Filtering happens client-side after events are fetched from database

5. **Event Creation Flow**:
   - User fills out `EventForm`
   - Form validates required fields and date/time ranges
   - If image file is provided, it's uploaded to Supabase Storage first
   - Event data (including image URL) is inserted into `events` table
   - Success state is shown, then page refreshes to display new event
   - If `community_id` is provided, event is associated with that community

6. **Community Data Flow**:
   - Communities are fetched from `communities` table
   - User memberships are checked via `community_members` table
   - Discussion posts are fetched from `discussion_posts` table
   - Media is fetched from `community_media` table
   - All data is joined with `profiles` table for user information

## 🗄️ Database Schema

The application uses Supabase (PostgreSQL) with the following main tables:

### `events`
Stores event information:
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `title` (text, required)
- `description` (text, nullable)
- `start_date` (date, required)
- `start_time` (time, required)
- `end_date` (date, nullable)
- `end_time` (time, nullable)
- `category` (text) - e.g., "Social Activities", "Tech", "Food"
- `tags` (text array, nullable)
- `is_online` (boolean, default false)
- `address` (text, nullable) - Physical location for in-person events
- `location_link` (text, nullable) - Meeting link for online events
- `image_url` (text, nullable) - URL to event banner image
- `community_id` (uuid, nullable, foreign key to communities)
- `created_at` (timestamp)

### `communities`
Stores community/group information:
- `id` (uuid, primary key)
- `host_user_id` (uuid, foreign key to auth.users)
- `name` (text, required)
- `short_description` (text, nullable)
- `long_description` (text, nullable)
- `banner_image_url` (text, nullable)
- `created_at` (timestamp)

### `community_members`
Tracks user memberships in communities:
- `id` (uuid, primary key)
- `community_id` (uuid, foreign key to communities)
- `user_id` (uuid, foreign key to auth.users)
- `role` (text, default 'member') - e.g., "member", "admin"
- `joined_at` (timestamp)

### `discussion_posts`
Stores community discussion posts:
- `id` (uuid, primary key)
- `community_id` (uuid, foreign key to communities)
- `user_id` (uuid, foreign key to auth.users)
- `content` (text, required)
- `created_at` (timestamp)

### `community_media`
Stores media files for communities:
- `id` (uuid, primary key)
- `community_id` (uuid, foreign key to communities)
- `user_id` (uuid, foreign key to auth.users)
- `image_url` (text, required)
- `uploaded_at` (timestamp)

### `profiles`
Extends Supabase auth.users with additional user information:
- `id` (uuid, primary key, foreign key to auth.users)
- `username` (text, nullable)
- `avatar_url` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Supabase Storage Buckets
- `event-banners` - Stores event banner images
  - Public read access
  - Path structure: `public/{user_id}/{filename}`

## 🛠️ Technologies Used

- **React 19.2.0** - UI library
- **React Router DOM 7.10.1** - Client-side routing
- **Vite 7.2.5** (rolldown-vite) - Build tool and dev server
- **Tailwind CSS 3.4.14** - Utility-first CSS framework
- **Lucide React 0.562.0** - Icon library
- **@supabase/supabase-js 2.89.0** - Database client and authentication
- **react-hot-toast 2.6.0** - Toast notifications
- **PostCSS** - CSS processing
- **ESLint** - Code linting

## 🎨 Design System

### Colors
- Primary Gradient: `#6C5CE7` to `#FF7675` (indigo to rose)
- Text Main: `#2D3436`
- Text Muted: `#636E72`
- Accent: `#00CEC9`

### Typography
- Headings: Poppins, Outfit, system-ui
- Body: Inter, DM Sans, system-ui

### Key Design Patterns
- Floating navigation bar with rounded corners
- Glassmorphism effects (backdrop blur)
- Gradient backgrounds and buttons
- Smooth transitions and hover effects
- Responsive grid layouts
- Modal overlays with backdrop blur

## 📝 Notes

### Current Implementation Status

- **Database Integration**: ✅ Fully integrated with Supabase
  - Events are stored in and fetched from Supabase database
  - User authentication is fully functional
  - Communities, posts, and media are stored in database
  - Image uploads to Supabase Storage are working

- **Authentication**: ✅ Complete
  - User registration and login implemented
  - Session management via Supabase Auth
  - Protected routes and authentication-aware UI

- **Event Management**: ✅ Functional
  - Events are created and stored in Supabase
  - Events are fetched from database on page load
  - Event images are uploaded to Supabase Storage
  - Support for online and in-person events
  - Multi-day events with start/end dates and times

- **Saved Events**: ✅ Implemented
  - Events can be saved/bookmarked
  - Saved events persist in localStorage
  - Saved events drawer displays all saved events

- **Community Features**: ✅ Functional
  - Communities are stored in Supabase
  - Users can join/leave communities
  - Discussion posts are stored in database
  - Media uploads to communities are working
  - Community-specific events can be created

- **Event Filtering**: Category filtering works by searching event titles and descriptions for keyword matches (client-side filtering).

- **Genre Pages**: Genre detail pages (`/explore/:genre`) fetch and display events filtered by category/genre from Supabase.

- **Responsive Design**: The application is fully responsive with mobile-first design principles.

### Environment Variables Required

The application requires the following environment variables in a `.env` file:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

### Database Setup Required

Before running the application, ensure your Supabase database has:
1. All required tables (see Database Schema section)
2. Appropriate Row Level Security (RLS) policies
3. Storage bucket `event-banners` with public read access
4. Foreign key relationships properly configured

## 🔮 Future Enhancements

Potential areas for expansion:
- Real-time event updates using Supabase Realtime
- Advanced search functionality with full-text search
- Event RSVP functionality with attendee tracking
- User profile pages with edit capabilities
- Location-based event discovery with geolocation
- Event recommendations based on user interests
- Email notifications for saved events
- Social features (comments, likes, shares)
- Event analytics and insights
- Payment integration for paid events
- Calendar integration (Google Calendar, iCal)
