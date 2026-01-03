import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, X, Link as LinkIcon } from 'lucide-react';

// Tag color function - light blue/purple backgrounds with colored text
function getTagColor(tagString) {
  const colors = [
    'bg-indigo-100 text-indigo-700',
    'bg-purple-100 text-purple-700',
    'bg-blue-100 text-blue-700',
    'bg-violet-100 text-violet-700',
    'bg-sky-100 text-sky-700',
    'bg-cyan-100 text-cyan-700',
  ];

  let hash = 0;
  for (let i = 0; i < tagString.length; i++) {
    const char = tagString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

// Generate tags from event data
function generateTags(event) {
  const tags = [];
  
  // Extract keywords from title and description
  const text = `${event.title} ${event.description || ''}`.toLowerCase();
  
  // Common event categories/keywords
  const keywords = {
    'music': ['music', 'festival', 'concert', 'band', 'dj', 'live music'],
    'art': ['art', 'gallery', 'exhibition', 'painting', 'sculpture'],
    'food': ['food', 'wine', 'tasting', 'restaurant', 'culinary', 'dining'],
    'tech': ['tech', 'technology', 'innovation', 'summit', 'conference', 'startup'],
    'wellness': ['yoga', 'fitness', 'wellness', 'meditation', 'health'],
    'comedy': ['comedy', 'stand-up', 'laugh', 'humor'],
    'networking': ['networking', 'meetup', 'social', 'community'],
    'outdoor': ['park', 'outdoor', 'nature', 'fresh air'],
  };

  // Check for matching keywords
  for (const [tag, keywordsList] of Object.entries(keywords)) {
    if (keywordsList.some(keyword => text.includes(keyword))) {
      tags.push(tag);
    }
  }

  // If event has explicit tags, use those instead
  if (event.tags && Array.isArray(event.tags)) {
    return event.tags;
  }

  // If no tags found, generate from location or add default
  if (tags.length === 0) {
    tags.push('event');
  }

  return tags;
}

function EventDetailModal({ isOpen, event, onClose }) {
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger animation when modal opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to trigger animation
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  const tags = generateTags(event);

  // Generate host name - extract from hostGroup or use default
  const getHostName = () => {
    if (event.host) return event.host;
    if (event.hostGroup) {
      // Extract from "by Tech Meetup" format
      return event.hostGroup.replace('by ', '');
    }
    return 'Event Organizer';
  };
  
  const hostName = getHostName();
  
  // Handle both image and imageUrl properties
  const imageUrl = event.image || event.imageUrl;
  
  // Handle location - could be location or meetingLink for online events
  const location = event.location || (event.meetingLink && !event.meetingLink.startsWith('http') ? event.meetingLink : null) || 'Location TBD';
  
  // Handle description - might not exist in Explore page events
  const description = event.description || 'No description available.';
  
  // Get event URL - handles url, website, and meetingLink (if it's a URL)
  const getEventUrl = () => {
    const url = event.url || event.website || (event.meetingLink && event.meetingLink.startsWith('http') ? event.meetingLink : null);
    return url || null;
  };
  
  // Format date for display
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return 'Date TBD';
    // If date is already formatted (e.g., "July 15, 2024"), return as-is
    if (typeof dateStr === 'string' && dateStr.includes(',')) {
      // Check if it's already a formatted date (has month name and comma)
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      if (monthNames.some(month => dateStr.includes(month))) {
        return dateStr;
      }
    }
    try {
      const dateObj = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return dateStr;
      }
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      return dateObj.toLocaleDateString('en-US', options);
    } catch {
      return dateStr;
    }
  };
  
  // Format time for display (handles both single time and time ranges)
  const formatTimeDisplay = (timeStr) => {
    if (!timeStr) return null;
    // If it's already a range (contains " - "), return as-is
    if (timeStr.includes(' - ')) {
      return timeStr;
    }
    return timeStr;
  };
  
  // Determine if event spans multiple days
  const isMultiDayEvent = () => {
    const startDate = event.startDate || event.date;
    const endDate = event.endDate;
    if (!endDate || !startDate) return false;
    try {
      const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
      const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
      return start.toDateString() !== end.toDateString();
    } catch {
      return false;
    }
  };
  
  // Get formatted date/time display
  const getDateTimeDisplay = () => {
    // Handle Explore page format (date contains '•')
    if (event.date && typeof event.date === 'string' && event.date.includes('•')) {
      // Extract date and time from combined format
      const parts = event.date.split('•');
      const datePart = parts[0]?.trim();
      const timePart = parts[1]?.trim() || event.time;
      return {
        date: datePart || 'Date TBD',
        time: timePart || null
      };
    }
    
    const startDate = event.startDate || event.date;
    const endDate = event.endDate;
    const startTime = event.startTime || (event.time && !event.time.includes(' - ') ? event.time : event.time?.split(' - ')[0]?.trim());
    const endTime = event.endTime || (event.time && event.time.includes(' - ') ? event.time.split(' - ')[1]?.trim() : null);
    
    const isMultiDay = isMultiDayEvent();
    
    if (isMultiDay && startDate && endDate) {
      // Multi-day: "Start Date, Start Time – End Date, End Time"
      const formattedStartDate = formatDateDisplay(startDate);
      const formattedEndDate = formatDateDisplay(endDate);
      const formattedStartTime = formatTimeDisplay(startTime) || 'TBD';
      const formattedEndTime = formatTimeDisplay(endTime) || 'TBD';
      return {
        date: `${formattedStartDate}, ${formattedStartTime} – ${formattedEndDate}, ${formattedEndTime}`,
        time: null // Combined into date line
      };
    } else {
      // Single day: Date on first line, Time range on second line
      const formattedDate = formatDateDisplay(startDate);
      let formattedTime = null;
      
      // Only show time range if we have both start and end times, or if time already contains a range
      if (startTime && endTime && startTime !== endTime) {
        formattedTime = `${formatTimeDisplay(startTime)} - ${formatTimeDisplay(endTime)}`;
      } else if (event.time && event.time.includes(' - ')) {
        // Time already formatted as range
        formattedTime = formatTimeDisplay(event.time);
      } else if (startTime && !endTime) {
        // Only start time
        formattedTime = formatTimeDisplay(startTime);
      } else if (event.time && !event.time.includes(' - ')) {
        // Single time value
        formattedTime = formatTimeDisplay(event.time);
      }
      
      return {
        date: formattedDate,
        time: formattedTime
      };
    }
  };
  
  const dateTimeDisplay = getDateTimeDisplay();

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      {/* Overlay with backdrop blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Modal Panel */}
      <div
        className={`relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out ${
          isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - High-quality banner at the top */}
        <div className="relative h-64 overflow-hidden rounded-t-3xl">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#6C5CE7] to-[#FF7675]" />
          )}
          
          {/* Close Button - Top Right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-200 ease-out active:scale-95 shadow-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-8">
          {/* Large Title */}
          <h2 className="font-bold text-3xl mb-4 text-gray-900">
            {event.title}
          </h2>

          {/* Host Info - Circular avatar with "Hosted by" text */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#FF7675] flex items-center justify-center text-white font-semibold text-sm">
              {hostName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-600">
              Hosted by <span className="font-semibold text-gray-900">{hostName}</span>
            </span>
          </div>

          {/* Date/Time & Location - Using thin-stroke Lucide icons */}
          <div className="space-y-3 mb-6">
            {/* Date/Time Display */}
            {isMultiDayEvent() ? (
              // Multi-day: Combined on one line with Calendar icon
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-base">{dateTimeDisplay.date}</span>
              </div>
            ) : (
              // Single day: Date on first line, Time on second line
              <>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-base">{dateTimeDisplay.date}</span>
                </div>
                {dateTimeDisplay.time && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                    <span className="text-base">{dateTimeDisplay.time}</span>
                  </div>
                )}
              </>
            )}
            
            {/* Location */}
            {location && location !== 'Location TBD' && (
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-base">{location}</span>
              </div>
            )}
            
            {/* Event URL - Clickable link with icon */}
            {getEventUrl() && (
              <div className="flex items-center gap-3 text-gray-600 min-w-0">
                <LinkIcon className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                <a
                  href={getEventUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-blue-600 hover:underline truncate flex-1 min-w-0"
                >
                  {getEventUrl()}
                </a>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-base mb-6 leading-relaxed">
            {description}
          </p>

          {/* Tags - Small pill-shaped badges with light blue/purple backgrounds */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColor(tag)}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetailModal;
