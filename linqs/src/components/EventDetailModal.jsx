import { useEffect, useState } from 'react';

// Deterministic color assignment based on tag string hash
function getTagColor(tagString) {
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-pink-100 text-pink-700',
    'bg-purple-100 text-purple-700',
    'bg-green-100 text-green-700',
    'bg-orange-100 text-orange-700',
    'bg-teal-100 text-teal-700',
  ];

  // Simple hash function for deterministic color assignment
  let hash = 0;
  for (let i = 0; i < tagString.length; i++) {
    const char = tagString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

// Generate tags from event data
function generateTags(event) {
  const tags = [];
  
  // Extract keywords from title and description
  const text = `${event.title} ${event.description}`.toLowerCase();
  
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

  // Generate host name (mock for now - could come from event data)
  const hostName = event.host || 'Event Organizer';

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
        {/* Header - Cover Image */}
        <div className="relative h-64 overflow-hidden rounded-t-3xl">
          {event.image ? (
            <img
              src={event.image}
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
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm flex items-center justify-center text-[#636E72] hover:text-[#2D3436] transition-all duration-200 ease-out active:scale-95 shadow-lg"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-8">
          {/* Title */}
          <h2 className="font-heading font-bold text-3xl mb-4 text-[#2D3436]">
            {event.title}
          </h2>

          {/* Host Info */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#FF7675] flex items-center justify-center text-white font-semibold text-sm">
              {hostName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-[#636E72]">
              Hosted by <span className="font-semibold text-[#2D3436]">{hostName}</span>
            </span>
          </div>

          {/* Date/Time & Location */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-[#636E72]">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-base">{event.date}</span>
            </div>
            <div className="flex items-center gap-3 text-[#636E72]">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-base">{event.time}</span>
            </div>
            <div className="flex items-center gap-3 text-[#636E72]">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-base">{event.location}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-[#636E72] text-base mb-6 leading-relaxed">
            {event.description}
          </p>

          {/* Colorful Hashtags Section */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getTagColor(tag)}`}
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
