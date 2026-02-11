import { useState, useEffect } from 'react';
import { Calendar, Users, Sparkles, Coffee, Code, Briefcase, ChevronDown, Loader2 } from 'lucide-react';
import EventCard from '../components/EventCard';
import EventDetailModal from '../components/EventDetailModal';
import { supabase } from '../lib/supabase';
import { getJoinedEventIds } from '../lib/eventAttendeesService';
import { useAuth } from '../context/AuthContext';

// Custom minimalist SVG icons matching lucide-react style
const WellnessIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CultureIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <rect x="7" y="7" width="10" height="10" />
  </svg>
);

/**
 * Checks if an event date falls within the given date filter range.
 * @param {string} eventDate - Event date (ISO string or YYYY-MM-DD)
 * @param {string} filterType - 'any' | 'today' | 'this_week' | 'this_weekend'
 * @returns {boolean}
 */
function isDateInRange(eventDate, filterType) {
  if (!eventDate || filterType === 'any') return true;

  const date = new Date(eventDate);
  if (isNaN(date.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDay = new Date(date);
  eventDay.setHours(0, 0, 0, 0);

  if (filterType === 'today') {
    return eventDay.getTime() === today.getTime();
  }

  if (filterType === 'this_week') {
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + mondayOffset);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    return eventDay >= weekStart && eventDay <= weekEnd;
  }

  if (filterType === 'this_weekend') {
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return eventDay >= friday && eventDay <= sunday;
  }

  return false;
}

const FoodIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v0" />
    <path d="M21 15v7" />
  </svg>
);

function Explore() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openFilter, setOpenFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState('All events');
  const [dateFilter, setDateFilter] = useState('any');
  const [joinedEventIds, setJoinedEventIds] = useState(new Set());
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    day: 'Any day',
    type: 'Any type',
    distance: 'Any distance',
    price: 'Any price',
  });

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleInterested = (event) => {
    console.log(`Interested in event: ${event.title}`);
  };

  const handleBoost = (event) => {
    console.log(`Boosted event: ${event.title}`);
  };

  const handleDelete = (eventId) => {
    // Optimistically remove the event from the UI
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };

  // Fetch events and joined status from Supabase
  useEffect(() => {
    let isMounted = true; // Cleanup flag
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch events and joined event IDs in parallel
        const [eventsResult, joinedIdsResult] = await Promise.all([
          supabase
            .from('events')
            .select('*')
            .order('created_at', { ascending: false }),
          user ? getJoinedEventIds() : Promise.resolve({ data: [], error: null })
        ]);

        // Only update state if component is still mounted
        if (!isMounted) return;

        const { data: eventsData, error: eventsError } = eventsResult;
        const { data: joinedIds, error: joinedError } = joinedIdsResult;

        if (eventsError) {
          console.error('Error fetching events:', eventsError);
          setEvents([]);
          return;
        }

        if (joinedError) {
          console.error('Error fetching joined events:', joinedError);
        }

        // Create Set of joined event IDs for O(1) lookup
        const joinedSet = new Set(joinedIds || []);
        setJoinedEventIds(joinedSet);

        // Map snake_case to camelCase for EventCard component
        const mappedEvents = eventsData.map((event) => {
          // Format time - combine start_time and end_time if both exist
          let timeDisplay = event.start_time || '';
          if (event.start_time && event.end_time) {
            // Format time from HH:MM to readable format
            const formatTime = (timeStr) => {
              if (!timeStr) return '';
              const [hours, minutes] = timeStr.split(':');
              const hour = parseInt(hours, 10);
              const ampm = hour >= 12 ? 'PM' : 'AM';
              const displayHour = hour % 12 || 12;
              return `${displayHour}:${minutes} ${ampm}`;
            };
            timeDisplay = `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`;
          } else if (event.start_time) {
            const [hours, minutes] = event.start_time.split(':');
            const hour = parseInt(hours, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            timeDisplay = `${displayHour}:${minutes} ${ampm}`;
          }

          return {
            id: event.id,
            title: event.title,
            description: event.description || '',
            // Date mapping - use start_date as date, and end_date if exists
            date: event.start_date,
            startDate: event.start_date,
            endDate: event.end_date || null,
            // Time mapping
            time: timeDisplay,
            startTime: event.start_time || null,
            endTime: event.end_time || null,
            // Image mapping
            image: event.image_url || null,
            imageUrl: event.image_url || null,
            // Location mapping
            location: event.is_online ? null : (event.address || null),
            meetingLink: event.is_online ? (event.location_link || null) : null,
            // URL mapping (for clickable links in EventCard)
            // For online events, location_link is the meeting link
            // For in-person events, we don't have a separate URL field
            url: event.location_link || null,
            website: event.location_link || null,
            // Category and other fields
            category: event.category || 'Social Activities',
            tags: event.tags || [],
            isOnline: event.is_online || false,
            // Recurring event fields
            is_recurring: event.is_recurring || false,
            isRecurring: event.is_recurring || false,
            recurring_days: event.recurring_days || null,
            recurringDays: event.recurring_days || null,
            // Keep original data for reference
            ...event,
          };
        });

        if (isMounted) {
          setEvents(mappedEvents);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (isMounted) setEvents([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Dummy events data - commented out (keeping for reference)
  // const dummyEvents = [
  //   {
  //     title: "Summer Music Festival",
  //     description: "Join us for an unforgettable weekend of live music featuring local and international artists across multiple stages.",
  //     location: "Central Park",
  //     date: "July 15, 2024",
  //     time: "2:00 PM - 10:00 PM",
  //     image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=200&fit=crop"
  //   },
  //   // ... other dummy events
  // ];

  // Category icons
  const categories = [
    { name: 'All events', icon: Calendar },
    { name: 'New Groups', icon: Users },
    { name: 'Social Activities', icon: Coffee },
    { name: 'Hobbies', icon: Sparkles },
    { name: 'Tech', icon: Code },
    { name: 'Business', icon: Briefcase },
    { name: 'Wellness', icon: WellnessIcon },
    { name: 'Culture', icon: CultureIcon },
    { name: 'Food', icon: FoodIcon },
  ];

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
  };

  // Filter options
  const filterOptions = {
    day: ['Any day', 'Today', 'Tomorrow', 'This Weekend', 'This Week', 'Next Week'],
    type: ['Any type', 'Online', 'In Person', 'Hybrid'],
    distance: ['Any distance', 'Within 1 mile', 'Within 5 miles', 'Within 10 miles', 'Within 25 miles'],
    price: ['Any price', 'Free', 'Under $20', 'Under $50'],
  };

  const handleFilterClick = (filterName) => {
    setOpenFilter(openFilter === filterName ? '' : filterName);
  };

  const handleFilterSelect = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
    setOpenFilter('');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.filter-dropdown')) {
        setOpenFilter('');
      }
    };

    if (openFilter) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openFilter]);

  // FilterDropdown component - Neo-Brutalist Style
  const FilterDropdown = ({ label, filterName, options }) => {
    const isOpen = openFilter === filterName;
    const selectedValue = filters[filterName];

    return (
      <div className="relative filter-dropdown">
        <button
          onClick={() => handleFilterClick(filterName)}
          className={`flex items-center gap-1 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm font-bold text-black px-3 py-2 transition-all duration-200 ${
            isOpen ? 'rounded-sm' : 'rounded-sm'
          } hover:bg-yellow-200`}
        >
          {selectedValue} <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute top-full mt-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-sm z-20 w-48">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleFilterSelect(filterName, option)}
                className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${
                  option === selectedValue 
                    ? 'bg-black text-white' 
                    : 'text-black hover:bg-yellow-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Filter events based on active category AND date filter
  const filteredEvents = events.filter((event) => {
    // Check 1: Category filter
    const categoryMatch =
      activeCategory === 'All events'
        ? true
        : activeCategory === 'New Groups'
        ? true
        : (() => {
            const eventCategory = (event.category || '').toLowerCase().trim();
            const activeCategoryLower = activeCategory.toLowerCase().trim();
            return (
              eventCategory === activeCategoryLower ||
              eventCategory.includes(activeCategoryLower) ||
              activeCategoryLower.includes(eventCategory)
            );
          })();

    // Check 2: Date filter
    const eventDate = event.startDate || event.date;
    const dateMatch = isDateInRange(eventDate, dateFilter);

    return categoryMatch && dateMatch;
  });

  return (
    <div className="bg-[#F6F7F8] pt-32 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filter Section */}
        <div className="mb-8">
          {/* Top Row */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Events near{' '}
              <button className="underline hover:text-gray-700">
                Charleston, SC
              </button>
            </h1>
          </div>

          {/* Category Icons Row - Neo-Brutalist Tile Buttons */}
          <div className="overflow-x-auto scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0">
            <div className="flex gap-4 pb-2">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                const isActive = activeCategory === category.name;
                return (
                  <button
                    key={index}
                    onClick={() => handleCategoryClick(category.name)}
                    className={`flex flex-col items-center gap-2 border-2 border-black p-3 min-w-[100px] transition-all duration-200 text-black ${
                      isActive
                        ? 'bg-yellow-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-100 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    <IconComponent className="w-6 h-6 text-current" />
                    <span className="text-xs font-bold uppercase whitespace-nowrap">
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Filter Row */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { value: 'any', label: 'Any Time' },
              { value: 'today', label: 'Today' },
              { value: 'this_week', label: 'This Week' },
              { value: 'this_weekend', label: 'This Weekend' },
            ].map(({ value, label }) => {
              const isActive = dateFilter === value;
              return (
                <button
                  key={value}
                  onClick={() => setDateFilter(value)}
                  className={`px-4 py-2 text-sm font-bold uppercase border-[2px] border-black transition-all duration-200 ${
                    isActive
                      ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                  style={{ borderRadius: '2px' }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {events.length === 0
                ? 'No events found'
                : `No ${activeCategory === 'All events' ? '' : activeCategory.toLowerCase() + ' '}events found${dateFilter !== 'any' ? ` for ${dateFilter === 'today' ? 'Today' : dateFilter === 'this_week' ? 'This Week' : 'This Weekend'}` : ''}.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEvents.map((event) => {
              const isJoined = joinedEventIds.has(event.id);
              return (
                <EventCard 
                  key={event.id || event.title}
                  event={event}
                  isJoined={isJoined}
                  onInterested={() => handleInterested(event)}
                  onBoost={() => handleBoost(event)}
                  onCardClick={() => handleCardClick(event)}
                  onDelete={handleDelete}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Hide scrollbar styles */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* Event Detail Modal */}
      <EventDetailModal 
        isOpen={isModalOpen}
        event={selectedEvent}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default Explore;

