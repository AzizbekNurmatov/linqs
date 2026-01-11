import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import EventCard from '../components/EventCard';
import EventDetailModal from '../components/EventDetailModal';
import { useSavedEvents } from '../context/SavedEventsContext';
import { getSavedEvents } from '../lib/savedEventsService';

function SavedEvents() {
  const { savedEvents: contextSavedEvents, loading: contextLoading } = useSavedEvents();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch saved events from Supabase
  useEffect(() => {
    const fetchSavedEvents = async () => {
      try {
        setLoading(true);
        const { data, error } = await getSavedEvents();
        
        if (error) {
          console.error('Error fetching saved events:', error);
          setEvents([]);
          return;
        }

        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching saved events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedEvents();
  }, [contextSavedEvents]); // Re-fetch when context saved events change

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleInterested = (event) => {
    // Event is already saved, this is just for consistency with other pages
    console.log('Interested in event:', event.title);
  };

  const handleBoost = (event) => {
    console.log('Boosted event:', event.title);
  };

  if (loading || contextLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading saved events...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Saved Events</h1>
          </div>
          <p className="text-gray-600">
            Events you've bookmarked for later
          </p>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-lg border border-gray-200">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Bookmark className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No events saved yet.
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              Bookmark events from the home page or explore page to see them here. Your saved events will be synced across all your devices.
            </p>
          </div>
        ) : (
          // Events Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event, index) => (
              <EventCard
                key={event.id || `${event.title}-${event.date}-${index}`}
                event={event}
                onInterested={handleInterested}
                onBoost={handleBoost}
                onCardClick={handleEventClick}
              />
            ))}
          </div>
        )}

        {/* Event Detail Modal */}
        {isModalOpen && selectedEvent && (
          <EventDetailModal
            isOpen={isModalOpen}
            event={selectedEvent}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}

export default SavedEvents;
