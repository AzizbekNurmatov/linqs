import { useState } from 'react';
import { Bookmark, Zap } from 'lucide-react';

function EventCard({ event, onInterested, onBoost, onCardClick }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isBoosted, setIsBoosted] = useState(false);
  
  // Generate mock avatars for face pile
  const avatars = [
    'https://i.pravatar.cc/150?img=1',
    'https://i.pravatar.cc/150?img=2',
    'https://i.pravatar.cc/150?img=3',
  ];

  // Format date to match Explore.jsx style (e.g., "WED, JAN 7 • 6:00 PM EST")
  const formatDate = () => {
    try {
      const dateObj = new Date(event.date);
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const dayName = days[dateObj.getDay()];
      const month = months[dateObj.getMonth()];
      const day = dateObj.getDate();
      
      // Extract time from event.time (format: "2:00 PM - 10:00 PM" or "2:00 PM")
      const timeMatch = event.time.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
      const time = timeMatch ? timeMatch[1].toUpperCase() : 'TBD';
      
      return `${dayName}, ${month} ${day} • ${time} EST`;
    } catch {
      return event.date;
    }
  };

  // Extract host group from description or use a default
  const getHostGroup = () => {
    // Try to extract from description or use a default based on category
    const text = `${event.title} ${event.description}`.toLowerCase();
    if (text.includes('tech')) return 'by Tech Meetup';
    if (text.includes('music')) return 'by Live Music Enthusiasts';
    if (text.includes('art')) return 'by NYC Arts Collective';
    if (text.includes('food')) return 'by NYC Foodies';
    if (text.includes('yoga') || text.includes('fitness')) return 'by Wellness Community';
    return 'by Local Community';
  };

  // Get price (default to Free)
  const getPrice = () => {
    const text = `${event.title} ${event.description}`.toLowerCase();
    if (text.includes('tasting') || text.includes('summit') || text.includes('festival')) {
      return Math.random() > 0.5 ? 'Free' : '$25';
    }
    return 'Free';
  };

  // Get attendee count (mock)
  const getAttendeeCount = () => {
    return Math.floor(Math.random() * 100) + 20;
  };

  const handleCardClick = (e) => {
    // Don't trigger if clicking on buttons or their children
    if (e.target.closest('button')) {
      return;
    }
    if (onCardClick) {
      onCardClick();
    }
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Section (Relative) */}
      <div className="relative aspect-video bg-gray-200">
        {event.image ? (
          <img 
            src={event.image} 
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
        
        {/* Price Badge (Top Left) */}
        <div className="absolute top-2 left-2 bg-white text-gray-900 text-xs font-semibold px-2 py-1 rounded-sm">
          {getPrice()}
        </div>

        {/* Actions (Top Right) */}
        <div className="absolute top-2 right-2 flex gap-2 p-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSaved(!isSaved);
              if (onInterested) onInterested();
            }}
            className={`bg-white/90 p-1.5 rounded-full hover:bg-white text-gray-700 transition-colors ${
              isSaved ? 'text-blue-600' : ''
            }`}
            aria-label="Bookmark event"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsBoosted(!isBoosted);
              if (onBoost) onBoost();
            }}
            className={`bg-white/90 p-1.5 rounded-full hover:bg-white text-gray-700 transition-colors ${
              isBoosted ? 'text-yellow-500' : ''
            }`}
            aria-label="Boost event"
          >
            <Zap className={`w-4 h-4 ${isBoosted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Date */}
        <p className="text-xs font-bold text-[#7C6F50] uppercase tracking-wide mb-1">
          {formatDate()}
        </p>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 leading-tight mb-1 truncate">
          {event.title}
        </h3>

        {/* Host Group */}
        <p className="text-sm text-gray-500 mb-3">
          {getHostGroup()}
        </p>

        {/* Footer */}
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {avatars.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt={`Attendee ${index + 1}`}
                className="w-6 h-6 rounded-full border-2 border-white"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=User${index + 1}&background=random`;
                }}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">
            {getAttendeeCount()} attendees
          </span>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
