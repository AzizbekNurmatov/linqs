import { useState } from 'react';
import { Bookmark, X } from 'lucide-react';
import EventDetailModal from './EventDetailModal';
import { useSavedEvents } from '../context/SavedEventsContext';

function SavedEventsDrawer({ isOpen, onClose }) {
  const { savedEvents } = useSavedEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sort events in reverse chronological order (most recently saved first)
  const sortedEvents = [...savedEvents].sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0));

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Format date for compact display
  const formatCompactDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dayName = days[date.getDay()];
      const month = months[date.getMonth()];
      const day = date.getDate();
      return `${dayName}, ${month} ${day}`;
    } catch {
      // Fallback to original string if parsing fails
      return dateString;
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">
            Saved Events
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="h-[calc(100vh-73px)] overflow-y-auto">
          {savedEvents.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Bookmark className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No events saved yet.
              </h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Bookmark events to see them here!
              </p>
            </div>
          ) : (
            // Populated State - Scrollable List
            <div className="px-4 py-4 space-y-2">
              {sortedEvents.map((event, index) => (
                <div
                  key={`${event.title}-${event.date}-${index}`}
                  onClick={() => handleEventClick(event)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md bg-white cursor-pointer transition-all duration-200 group"
                >
                  {/* Thumbnail Image */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    {event.image || event.imageUrl ? (
                      <img
                        src={event.image || event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.className += ' bg-gradient-to-br from-gray-300 to-gray-400';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
                    )}
                  </div>

                  {/* Event Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate group-hover:text-gray-700">
                      {event.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-1.5 truncate">
                      {event.location || event.meetingLink || 'Location TBD'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatCompactDate(event.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        isOpen={isModalOpen}
        event={selectedEvent}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default SavedEventsDrawer;
