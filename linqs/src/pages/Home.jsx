import { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesBentoGrid from '../components/FeaturesBentoGrid';
import EventList from '../components/EventList';
import EventDetailModal from '../components/EventDetailModal';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching events:', error);
          setEvents([]);
          return;
        }

        // Map snake_case to camelCase for EventCard component
        const mappedEvents = data.map((event) => {
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

        setEvents(mappedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleInterested = (index) => {
    console.log(`Interested in event: ${events[index].title}`);
  };

  const handleBoost = (index) => {
    console.log(`Boosted event: ${events[index].title}`);
  };

  // Filter events based on selected categories
  const filteredEvents = selectedCategories.length === 0
    ? events 
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
      });
    
  return (
    <>
      <HeroSection 
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        onCategoryClick={handleCategoryClick}
      />
      <FeaturesBentoGrid />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pb-12">
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
            onInterested={handleInterested}
            onBoost={handleBoost}
            onCardClick={handleCardClick}
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

