# Linqs - Event Discovery & Community Platform

Linqs is a modern web application for discovering local events and connecting with micro-communities. Built with React and Vite, it provides an intuitive interface for browsing events, filtering by categories, exploring genres, and engaging with community posts.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

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
│   ├── context/           # React Context providers
│   ├── pages/             # Page components (routes)
│   ├── App.jsx            # Main app component with routing
│   ├── main.jsx           # Application entry point
│   ├── index.css          # Global styles
│   └── App.css            # App-specific styles
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── postcss.config.js      # PostCSS configuration
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
  - Wraps the entire app in `EventsProvider` to share event data globally
  - Sets up React Router with `BrowserRouter`
  - Defines all application routes:
    - `/` - Home page
    - `/explore` - Explore events by genre
    - `/explore/:genre` - Genre-specific event page
    - `/community` - Community feed page
  - Uses `Layout` component to provide consistent header/footer structure

#### `src/context/EventsContext.jsx`
- **Purpose**: Global state management for events using React Context
- **What it does**:
  - Provides a centralized store for all events in the application
  - Contains initial mock event data (6 sample events)
  - Exports `EventsProvider` component that wraps the app
  - Exports `useEvents` hook for accessing events and `handleAddEvent` function
  - Formats dates and times when new events are added
  - Currently stores events in memory (not persisted to a database)

### Page Components (`src/pages/`)

#### `src/pages/Home.jsx`
- **Purpose**: Main landing page of the application
- **What it does**:
  - Displays the hero section with tagline and call-to-action buttons
  - Shows a features bento grid showcasing key platform features
  - Renders a filterable list of events using `EventList` component
  - Manages category filtering state (selected categories)
  - Handles event card clicks to open detail modals
  - Provides "Interested" and "Boost" button handlers (currently console.log)
  - Filters events based on selected categories by searching event title/description

#### `src/pages/Explore.jsx`
- **Purpose**: Genre exploration page with visual category cards
- **What it does**:
  - Displays a bento box grid layout with genre cards (Live Music, Tech, Food, Sports, Arts, Nightlife)
  - Each card links to a genre-specific detail page (`/explore/:genre`)
  - Features animated hover effects and custom fonts per genre
  - Shows a "Featured" card with live indicator badge
  - Uses gradient backgrounds and icons (from lucide-react) for each genre
  - Includes custom CSS animations (pulse-dot, glitch effects)

#### `src/pages/GenreDetail.jsx`
- **Purpose**: Displays events for a specific genre
- **What it does**:
  - Uses URL parameter (`:genre`) to determine which genre to display
  - Maps genre slugs to display names, gradients, and fonts
  - Currently shows an empty state message (no events implemented yet)
  - Provides a back button to return to the Explore page
  - Uses genre-specific styling (colors and fonts) based on the genre config

#### `src/pages/Community.jsx`
- **Purpose**: Community feed page with posts and groups
- **What it does**:
  - Displays a three-column layout:
    - Left: "My Tribes" sidebar showing user's joined groups
    - Center: "The City Wall" feed with posts (sticky notes, polaroids, announcements)
    - Right: "Discover" sidebar with suggested groups to join
  - Supports creating new posts (sticky note style)
  - Shows different post types:
    - Sticky notes (yellow background, rotated)
    - Polaroids (photo posts with captions)
    - Announcements (gradient background with neon text)
  - Features a concrete texture background
  - Includes sample data for tribes, groups, and posts

### Layout Components

#### `src/components/Layout.jsx`
- **Purpose**: Wrapper component that provides consistent page structure
- **What it does**:
  - Renders the `Header` component at the top
  - Uses React Router's `Outlet` to render child route components
  - Passes `handleAddEvent` function to Header for event creation
  - Provides a flex layout structure for the entire app

#### `src/components/Header.jsx`
- **Purpose**: Navigation header with floating design
- **What it does**:
  - Displays a floating navbar with rounded corners
  - Shows brand logo ("Linqs") on the left
  - Navigation links (Home, Explore, Community) in the center (hidden on mobile)
  - "Create Event" button that opens the event form modal
  - Mobile menu toggle button for responsive navigation
  - Login link (placeholder)
  - Manages state for showing/hiding the event form modal
  - Renders `EventForm` component in a modal overlay when "Create Event" is clicked

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
- **Purpose**: Form component for creating new events
- **What it does**:
  - Collects event information:
    - Title (required)
    - Description (required)
    - Location (required)
    - Date (required)
    - Time (required)
    - Image URL (optional)
    - Genre selection (required) - buttons for Music, Tech, Food, Sports, Arts, Nightlife
    - Tags (optional) - can add custom tags or select from suggested tags
  - Validates form before submission
  - Formats date and time before passing to `handleAddEvent`
  - Shows selected tags with remove buttons
  - Provides suggested tags (#Party, #Networking, #Free, etc.)
  - Uses genre-specific gradient styling for selected genre buttons

## 🔄 Application Flow

### User Journey

1. **Landing on Home Page** (`/`)
   - User sees hero section with tagline
   - Views features bento grid
   - Sees list of events
   - Can filter events using category pills or filter modal

2. **Filtering Events**
   - Click category pills in FilterBar to toggle filters
   - Click filter button to open CategoryModal
   - Select multiple categories across different sections
   - Events are filtered in real-time based on selected categories

3. **Viewing Event Details**
   - Click any event card to open EventDetailModal
   - View full event information, tags, and details
   - Close modal by clicking X, backdrop, or pressing Escape

4. **Creating an Event**
   - Click "Create Event" button in header
   - Fill out EventForm with event details
   - Select genre and optional tags
   - Submit form to add event to the list

5. **Exploring Genres** (`/explore`)
   - View genre cards in bento grid layout
   - Click a genre card to navigate to genre detail page
   - See genre-specific styling and empty state (events not yet implemented)

6. **Community Feed** (`/community`)
   - View "My Tribes" (joined groups) in left sidebar
   - Browse "The City Wall" feed with various post types
   - Create new posts using the input field
   - Discover suggested groups in right sidebar

### Data Flow

1. **Events State Management**:
   - Events are stored in `EventsContext`
   - Initial events are hardcoded in the context
   - New events are added via `handleAddEvent` function
   - All components access events through `useEvents()` hook

2. **Category Filtering**:
   - Selected categories are stored in `Home` component state
   - Categories are passed down to `FilterBar` and `HeroSection`
   - Filtering logic searches event titles and descriptions for category keywords

3. **Event Creation**:
   - User fills out `EventForm`
   - Form data is passed to `handleAddEvent` from context
   - Date and time are formatted before adding to events array
   - New event appears in the event list immediately

## 🛠️ Technologies Used

- **React 19.2.0** - UI library
- **React Router DOM 7.10.1** - Client-side routing
- **Vite 7.2.5** (rolldown-vite) - Build tool and dev server
- **Tailwind CSS 3.4.14** - Utility-first CSS framework
- **Lucide React 0.562.0** - Icon library
- **@supabase/supabase-js 2.89.0** - Database client (configured but not actively used yet)
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

- **Current State**: The application uses mock data stored in memory. Events are not persisted to a database yet, though Supabase is included as a dependency.
- **Event Filtering**: Category filtering works by searching event titles and descriptions for keyword matches.
- **Genre Pages**: Genre detail pages (`/explore/:genre`) currently show empty states. Event filtering by genre is not yet implemented.
- **Community Posts**: Posts in the Community page are stored in component state and reset on page refresh.
- **Responsive Design**: The application is fully responsive with mobile-first design principles.

## 🔮 Future Enhancements

Potential areas for expansion:
- Connect to Supabase for persistent data storage
- Implement user authentication
- Add real-time event updates
- Implement genre-based event filtering
- Add search functionality
- Connect community posts to a backend
- Add event RSVP functionality
- Implement user profiles
- Add location-based event discovery
