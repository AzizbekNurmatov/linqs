import { useState } from 'react';
import { Bookmark, Zap, Coffee, Sparkles, Code, Briefcase } from 'lucide-react';
import { useSavedEvents } from '../context/SavedEventsContext';

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

// Get category icon component
const getCategoryIcon = (categoryName) => {
  const category = categoryName || 'Social Activities';
  switch (category) {
    case 'Social Activities':
      return Coffee;
    case 'Hobbies':
      return Sparkles;
    case 'Wellness':
      return WellnessIcon;
    case 'Tech':
      return Code;
    case 'Business':
      return Briefcase;
    case 'Culture':
      return CultureIcon;
    case 'Food':
      return FoodIcon;
    default:
      return Coffee; // Default to Social
  }
};

function EventCard({ event, isJoined = false, onInterested, onBoost, onCardClick }) {
  const { toggleSaveEvent, isEventSaved } = useSavedEvents();
  const isSaved = isEventSaved(event);
  const [isBoosted, setIsBoosted] = useState(false);
  const [boostCount, setBoostCount] = useState(() => Math.floor(Math.random() * 91) + 10); // Random count between 10-100

  // Format date - handles both formatted strings and Date objects, with date range support
  const formatDate = () => {
    // If date is already formatted (from Explore page), return it
    if (typeof event.date === 'string' && event.date.includes('•')) {
      return event.date;
    }
    
    // Check if we have both startDate and endDate, or date and endDate
    const startDate = event.startDate || event.date;
    const endDate = event.endDate;
    
    // Handle null/undefined dates (recurring events)
    if (!startDate) {
      // For recurring events, this should be handled by the day pills display
      // But if we somehow get here, return a fallback
      const timeMatch = event.time?.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
      const time = timeMatch ? timeMatch[1].toUpperCase() : 'TBD';
      return `Weekly • ${time} EST`;
    }
    
    // If we have an endDate and it's different from startDate, format as range
    if (endDate && startDate) {
      try {
        const startDateObj = typeof startDate === 'string' ? new Date(startDate) : startDate;
        const endDateObj = typeof endDate === 'string' ? new Date(endDate) : endDate;
        
        // Check if dates are the same day
        const isSameDay = startDateObj.toDateString() === endDateObj.toDateString();
        
        if (!isSameDay) {
          // Format as range: "Jan 5 - Jan 9, 2026"
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const startMonth = months[startDateObj.getMonth()];
          const startDay = startDateObj.getDate();
          const endMonth = months[endDateObj.getMonth()];
          const endDay = endDateObj.getDate();
          const year = endDateObj.getFullYear();
          
          // Always show both months for clarity: "Jan 5 - Jan 9, 2026" or "Jan 5 - Feb 9, 2026"
          return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
        }
      } catch {
        // If parsing fails, fall through to single date format
      }
    }
    
    // Single date format - keep existing style
    try {
      const dateObj = typeof startDate === 'string' ? new Date(startDate) : startDate;
      // Validate date object
      if (isNaN(dateObj.getTime())) {
        return event.date || 'TBD';
      }
      
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const dayName = days[dateObj.getDay()];
      const month = months[dateObj.getMonth()];
      const day = dateObj.getDate();
      
      // Extract time from event.time (format: "2:00 PM - 10:00 PM" or "2:00 PM")
      const timeMatch = event.time?.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
      const time = timeMatch ? timeMatch[1].toUpperCase() : 'TBD';
      
      return `${dayName}, ${month} ${day} • ${time} EST`;
    } catch {
      return event.date || 'TBD';
    }
  };

  // Get host group - handles both explicit hostGroup and derived from description
  const getHostGroup = () => {
    // If hostGroup is explicitly provided (Explore page), use it
    if (event.hostGroup) {
      return event.hostGroup;
    }
    
    // Otherwise, derive from description (Home page)
    const text = `${event.title} ${event.description || ''}`.toLowerCase();
    if (text.includes('tech')) return 'by Tech Meetup';
    if (text.includes('music')) return 'by Live Music Enthusiasts';
    if (text.includes('art')) return 'by NYC Arts Collective';
    if (text.includes('food')) return 'by NYC Foodies';
    if (text.includes('yoga') || text.includes('fitness')) return 'by Wellness Community';
    return 'by Local Community';
  };

  // Get price - handles both explicit price and derived
  const getPrice = () => {
    // If price is explicitly provided (Explore page), use it
    if (event.price) {
      return event.price;
    }
    
    // Otherwise, derive from content (Home page)
    const text = `${event.title} ${event.description || ''}`.toLowerCase();
    if (text.includes('tasting') || text.includes('summit') || text.includes('festival')) {
      return Math.random() > 0.5 ? 'Free' : '$25';
    }
    return 'Free';
  };


  // Get image URL - handles both image and imageUrl properties
  const getImageUrl = () => {
    return event.image || event.imageUrl || '';
  };

  // Get event URL - handles url, website, and meetingLink properties
  const getEventUrl = () => {
    return event.url || event.website || event.meetingLink || null;
  };

  const handleCardClick = (e) => {
    // Don't trigger if clicking on buttons or their children
    if (e.target.closest('button')) {
      return;
    }
    if (onCardClick) {
      onCardClick(event);
    }
  };

  const handleSave = (e) => {
    e.stopPropagation();
    toggleSaveEvent(event);
    if (onInterested) {
      onInterested(event);
    }
  };

  const handleBoost = (e) => {
    e.stopPropagation();
    setIsBoosted(!isBoosted);
    if (onBoost) {
      onBoost(event);
    }
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Section - Sharp corners, aspect-video */}
      <div className="relative aspect-video bg-gray-200 overflow-hidden">
        {getImageUrl() ? (
          <img 
            src={getImageUrl()} 
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
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={handleSave}
            className={`bg-white/90 p-1.5 rounded-full hover:bg-white text-gray-700 transition-colors ${
              isSaved ? 'text-blue-600' : ''
            }`}
            aria-label="Bookmark event"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleBoost}
            className={`
              transition-all duration-300 ease-in-out flex items-center justify-center cursor-pointer rounded-full
              ${isBoosted 
                ? 'w-auto px-3 py-1.5 bg-white/90 hover:bg-white backdrop-blur-sm shadow-sm' 
                : 'w-9 h-9 bg-white/90 hover:bg-white'
              }
              active:scale-95
            `}
            aria-label="Boost event"
          >
            <Zap 
              className={`
                w-4 h-4 transition-colors flex-shrink-0
                ${isBoosted 
                  ? 'text-yellow-500 fill-yellow-500' 
                  : 'text-gray-500'
                }
              `}
            />
            {isBoosted && (
              <span 
                className="text-xs font-bold font-mono ml-1.5 text-gray-700"
              >
                {boostCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Date or Recurring Days */}
        {(() => {
          const isRecurring = event.is_recurring || event.isRecurring;
          const recurringDays = event.recurring_days || event.recurringDays || [];
          
          if (isRecurring && recurringDays.length > 0) {
            // Show day pills for recurring events
            const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
            return (
              <div className="mb-1">
                <div className="flex gap-1.5">
                  {dayLabels.map((day) => {
                    const isSelected = recurringDays.includes(day);
                    return (
                      <div
                        key={day}
                        className={`flex-1 px-2 py-1.5 rounded-full text-xs font-semibold text-center transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          } else {
            // Show formatted date for non-recurring events
            const formattedDate = formatDate();
            // Check if it's a date range (contains " - " and doesn't contain "•")
            const isDateRange = formattedDate.includes(' - ') && !formattedDate.includes('•');
            return (
              <p className={`text-xs font-bold text-[#7C6F50] tracking-wide mb-1 ${isDateRange ? '' : 'uppercase'}`}>
                {formattedDate}
              </p>
            );
          }
        })()}

        {/* Title - Bolded */}
        <h3 className="text-base font-bold text-gray-900 leading-tight mb-1 truncate">
          {event.title}
        </h3>

        {/* Host Group - "by [Organizer]" subtitle */}
        <p className="text-sm text-gray-500 mb-3">
          {getHostGroup()}
        </p>

        {/* Event URL - Clickable link */}
        {getEventUrl() && (
          <div className="mb-3 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <a
              href={getEventUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline truncate block"
            >
              {getEventUrl()}
            </a>
          </div>
        )}

        {/* Footer - Category Indicator */}
        <div className="flex items-center justify-end">
          {(() => {
            const category = event.category || 'Social Activities';
            const IconComponent = getCategoryIcon(category);
            // Get display name (remove "Activities" from "Social Activities")
            const categoryDisplayName = category === 'Social Activities' ? 'Social' : category;
            return (
              <div className="flex items-center gap-1.5">
                <IconComponent className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-xs text-gray-400">{categoryDisplayName}</span>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

export default EventCard;
