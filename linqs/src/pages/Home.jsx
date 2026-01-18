import { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesBentoGrid from '../components/FeaturesBentoGrid';
import EventList from '../components/EventList';
import EventCard from '../components/EventCard';
import EventDetailModal from '../components/EventDetailModal';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { getJoinedEventIds } from '../lib/eventAttendeesService';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

function Home() {
  const [events, setEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [joinedEventIds, setJoinedEventIds] = useState(new Set());
  const { user } = useAuth();

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleCategoryClick = (category) => {
    // Toggle the category when clicking on priority bar pills
    handleCategoryToggle(category);
  };

  // Fetch events and joined status from Supabase
  useEffect(() => {
    let isMounted = true; // Cleanup flag
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch featured pick, events, and joined event IDs in parallel
        const [featuredResult, eventsResult, joinedIdsResult] = await Promise.all([
          supabase
            .from('featured_picks')
            .select('*, events(*)')
            .order('created_at', { ascending: false })
            .limit(1)
            .single(),
          supabase
            .from('events')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(8),
          user ? getJoinedEventIds() : Promise.resolve({ data: [], error: null })
        ]);

        // Only update state if component is still mounted
        if (!isMounted) return;

        const { data: featuredData, error: featuredError } = featuredResult;
        const { data: eventsData, error: eventsError } = eventsResult;
        const { data: joinedIds, error: joinedError } = joinedIdsResult;

        // Handle featured pick (ignore error if no featured pick exists)
        if (!featuredError && featuredData && featuredData.events) {
          const featuredEventData = featuredData.events;
          // Transform featured event to match EventCard format
          let featuredTimeDisplay = featuredEventData.start_time || '';
          if (featuredEventData.start_time && featuredEventData.end_time) {
            const formatTime = (timeStr) => {
              if (!timeStr) return '';
              const [hours, minutes] = timeStr.split(':');
              const hour = parseInt(hours, 10);
              const ampm = hour >= 12 ? 'PM' : 'AM';
              const displayHour = hour % 12 || 12;
              return `${displayHour}:${minutes} ${ampm}`;
            };
            featuredTimeDisplay = `${formatTime(featuredEventData.start_time)} - ${formatTime(featuredEventData.end_time)}`;
          } else if (featuredEventData.start_time) {
            const [hours, minutes] = featuredEventData.start_time.split(':');
            const hour = parseInt(hours, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            featuredTimeDisplay = `${displayHour}:${minutes} ${ampm}`;
          }

          const transformedFeaturedEvent = {
            id: featuredEventData.id,
            title: featuredEventData.title,
            description: featuredEventData.description || '',
            date: featuredEventData.start_date,
            startDate: featuredEventData.start_date,
            endDate: featuredEventData.end_date || null,
            time: featuredTimeDisplay,
            startTime: featuredEventData.start_time || null,
            endTime: featuredEventData.end_time || null,
            image: featuredEventData.image_url || null,
            imageUrl: featuredEventData.image_url || null,
            location: featuredEventData.is_online ? null : (featuredEventData.address || null),
            meetingLink: featuredEventData.is_online ? (featuredEventData.location_link || null) : null,
            url: featuredEventData.location_link || null,
            website: featuredEventData.location_link || null,
            category: featuredEventData.category || 'Social Activities',
            tags: featuredEventData.tags || [],
            isOnline: featuredEventData.is_online || false,
            is_recurring: featuredEventData.is_recurring || false,
            isRecurring: featuredEventData.is_recurring || false,
            recurring_days: featuredEventData.recurring_days || null,
            recurringDays: featuredEventData.recurring_days || null,
            ...featuredEventData,
          };
          setFeaturedEvent(transformedFeaturedEvent);
        }

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
            url: event.location_link || null,
            website: event.location_link || null,
            // Category and other fields
            category: event.category || 'Social Activities',
            tags: event.tags || [],
            isOnline: event.is_online || false,
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

  const handleInterested = (eventOrIndex) => {
    const event = typeof eventOrIndex === 'number' ? events[eventOrIndex] : eventOrIndex;
    console.log(`Interested in event: ${event?.title || 'Unknown'}`);
  };

  const handleBoost = (eventOrIndex) => {
    const event = typeof eventOrIndex === 'number' ? events[eventOrIndex] : eventOrIndex;
    console.log(`Boosted event: ${event?.title || 'Unknown'}`);
  };

  const handleDelete = (eventId) => {
    // Optimistically remove the event from the UI
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    
    // Also remove from featured event if it's the featured one
    if (featuredEvent && featuredEvent.id === eventId) {
      setFeaturedEvent(null);
    }
  };

  // Filter events based on selected categories, but limit to 8 for grid
  const filteredEvents = selectedCategories.length === 0
    ? events.slice(0, 8) // Limit to 8 events for 2x4 grid
    : events.filter(event => {
        // Check if event's category matches any selected category
        // Also check title/description for backward compatibility
        const eventCategory = event.category || '';
        const eventText = `${event.title} ${event.description || ''}`.toLowerCase();
        
        return selectedCategories.some(category => {
          const categoryLower = category.toLowerCase();
          // Match by category field first, then fallback to text matching
          return eventCategory.toLowerCase().includes(categoryLower) || 
                 eventText.includes(categoryLower);
        });
      }).slice(0, 8); // Limit filtered results to 8 for grid
    
  return (
    <>
      <HeroSection 
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        onCategoryClick={handleCategoryClick}
      />
      <FeaturesBentoGrid />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pb-12">
        {/* Featured Event - Editor's Pick */}
        {featuredEvent && (
          <div className="mb-12">
            <EventCard
              event={featuredEvent}
              variant="featured"
              isJoined={joinedEventIds.has(featuredEvent.id)}
              onInterested={() => handleInterested(featuredEvent)}
              onBoost={() => handleBoost(featuredEvent)}
              onCardClick={() => handleCardClick(featuredEvent)}
              onDelete={handleDelete}
            />
          </div>
        )}
        
        {/* Terminal Style Section Header */}
        <div className="w-full bg-black text-white font-mono font-bold uppercase p-4 my-8 -mx-6">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <span>&gt; THE LINEUP</span>
            <span className="text-sm font-mono font-bold uppercase">
              Showing {loading ? '...' : filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
            </span>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {events.length === 0 
                ? "No events scheduled yet. Create one!" 
                : "No events match your selected categories."}
            </p>
          </div>
        ) : (
          <EventList 
            events={filteredEvents}
            joinedEventIds={joinedEventIds}
            onInterested={handleInterested}
            onBoost={handleBoost}
            onCardClick={handleCardClick}
            onDelete={handleDelete}
          />
        )}
      </main>
      <Footer />
      <EventDetailModal 
        isOpen={isModalOpen}
        event={selectedEvent}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default Home;

