import { useState, useEffect } from 'react';
import { Bookmark, Zap, Coffee, Sparkles, Code, Briefcase, Loader2 } from 'lucide-react';
import { useSavedEvents } from '../context/SavedEventsContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import DeleteConfirmationModal from './DeleteConfirmationModal';

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

// Trash can icon - closed state
const TrashIconClosed = ({ className }) => (
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
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

// Trash can icon - open state (lid lifted)
const TrashIconOpen = ({ className }) => (
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
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <path d="M3 6l2-2M21 6l-2-2" />
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

function EventCard({ event, isJoined = false, onInterested, onBoost, onCardClick, onDelete, variant = 'default' }) {
  const { toggleSaveEvent, isEventSaved } = useSavedEvents();
  const { user } = useAuth();
  const isSaved = isEventSaved(event);
  const [hasBoosted, setHasBoosted] = useState(false);
  const [boostCount, setBoostCount] = useState(() => {
    // Get boost count from event data if available, otherwise default to 0
    return event.boost_count || event.boostCount || 0;
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const isFeatured = variant === 'featured';
  
  // Check if current user is the event owner
  const currentUserId = user?.id;
  const eventUserId = event.user_id || event.userId;
  const canDelete = currentUserId && eventUserId && currentUserId === eventUserId;

  // Check localStorage on mount to see if user has already boosted this event
  useEffect(() => {
    const boostedKey = `boosted_event_${event.id}`;
    const hasBoostedBefore = localStorage.getItem(boostedKey) === 'true';
    if (hasBoostedBefore) {
      setHasBoosted(true);
    }
  }, [event.id]);

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

  const handleBoost = async (e) => {
    e.stopPropagation();
    
    // If already boosted, show toast and return
    if (hasBoosted) {
      toast('Already Hyped!', { icon: '⚡' });
      return;
    }

    // Optimistic UI update
    setBoostCount(prev => prev + 1);
    setHasBoosted(true);
    
    // Save to localStorage
    const boostedKey = `boosted_event_${event.id}`;
    localStorage.setItem(boostedKey, 'true');

    // Call Supabase RPC function in the background
    try {
      const { error } = await supabase.rpc('increment_boost', {
        row_id: event.id
      });
      
      if (error) {
        console.error('Error incrementing boost:', error);
        // Revert optimistic update on error
        setBoostCount(prev => prev - 1);
        setHasBoosted(false);
        localStorage.removeItem(boostedKey);
        toast.error('Failed to boost event. Please try again.');
      }
    } catch (error) {
      console.error('Error calling increment_boost:', error);
      // Revert optimistic update on error
      setBoostCount(prev => prev - 1);
      setHasBoosted(false);
      localStorage.removeItem(boostedKey);
      toast.error('Failed to boost event. Please try again.');
    }

    // Call the onBoost callback if provided
    if (onBoost) {
      onBoost(event);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', event.id);

      if (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event. Please try again.');
        setIsDeleting(false);
        return;
      }

      // Close modal
      setShowDeleteModal(false);

      // Call onDelete callback to remove from UI
      if (onDelete) {
        onDelete(event.id);
      }

      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
    }
  };

  return (
    <div 
      className={`bg-white overflow-hidden flex flex-col cursor-pointer ${
        isFeatured 
          ? 'border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4'
          : 'bg-[#FDFDFD] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200'
      }`}
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className={`relative bg-gray-200 overflow-hidden ${
        isFeatured 
          ? 'h-80 border-2 border-black mb-4' 
          : 'aspect-video border-b-2 border-black'
      }`}>
        {getImageUrl() ? (
          <img 
            src={getImageUrl()} 
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.className += ' bg-gray-300';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-300"></div>
        )}
        
        {/* Editor's Pick Badge (Featured variant only) */}
        {isFeatured && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-yellow-300 border-2 border-black text-black text-xs font-black uppercase px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              EDITOR'S PICK
            </span>
          </div>
        )}
        
        {/* Price Sticker (Top Left) - Neon Yellow or Hot Pink - Only show if not featured */}
        {!isFeatured && (
          <div className={`absolute top-2 left-2 border-2 border-black text-black text-xs font-black px-2 py-1 ${
            getPrice() === 'Free' ? 'bg-[#FFD700]' : 'bg-[#FF006E]'
          }`}>
            {getPrice()}
          </div>
        )}

        {/* Actions (Top Right) - Square buttons */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={handleSave}
            className={`w-8 h-8 border-2 border-black bg-white flex items-center justify-center transition-colors ${
              isSaved ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
            aria-label="Bookmark event"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleBoost}
            className={`
              border-2 border-black flex items-center gap-2 p-2 transition-all duration-200 active:scale-95
              ${hasBoosted 
                ? 'bg-yellow-300 text-black' 
                : 'bg-white text-black hover:bg-yellow-100'
              }
            `}
            aria-label="Boost event"
          >
            <Zap className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs font-black font-mono">
              {boostCount}
            </span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className={`flex flex-col flex-1 ${isFeatured ? 'px-0' : 'p-4'}`}>
        {/* Date or Recurring Days */}
        {(() => {
          const isRecurring = event.is_recurring || event.isRecurring;
          const recurringDays = event.recurring_days || event.recurringDays || [];
          
          if (isRecurring && recurringDays.length > 0) {
            // Show day pills for recurring events - Brutalist style
            const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
            return (
              <div className="mb-2 overflow-x-auto scrollbar-hide">
                <div className="flex gap-1 min-w-max">
                  {dayLabels.map((day) => {
                    const isSelected = recurringDays.includes(day);
                    return (
                      <div
                        key={day}
                        className={`flex-shrink-0 w-7 h-7 flex items-center justify-center border-2 border-black text-[10px] font-black text-center transition-colors ${
                          isSelected
                            ? 'bg-black text-white'
                            : 'bg-white text-black'
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
            // Show formatted date for non-recurring events - Monospace font
            const formattedDate = formatDate();
            // Check if it's a date range (contains " - " and doesn't contain "•")
            const isDateRange = formattedDate.includes(' - ') && !formattedDate.includes('•');
            return (
              <p className={`text-xs font-black font-mono text-black tracking-wide mb-2 ${isDateRange ? '' : 'uppercase'}`}>
                {formattedDate}
              </p>
            );
          }
        })()}

        {/* Title - Uppercase and Bold */}
        <h3 className={`font-black text-black leading-tight mb-2 truncate uppercase ${
          isFeatured ? 'text-3xl md:text-4xl' : 'text-base'
        }`}>
          {event.title}
        </h3>

        {/* Host Group - Monospace font */}
        <p className="text-sm font-mono text-slate-700 mb-3">
          {getHostGroup()}
        </p>

        {/* Event URL - Clickable link */}
        {getEventUrl() && (
          <div className="mb-3 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <a
              href={getEventUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-black underline hover:no-underline truncate block"
            >
              {getEventUrl()}
            </a>
          </div>
        )}

        {/* Dashed Divider */}
        <div className="border-t-2 border-dashed border-black my-3"></div>

        {/* Footer - Delete Button (left) and Category Indicator (right) */}
        <div className={`flex items-center mt-auto ${canDelete ? 'justify-between' : 'justify-end'}`}>
          {/* Delete Button - Bottom Left */}
          {canDelete && (
            <button
              onClick={handleDeleteClick}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="flex items-center justify-center w-6 h-6 text-black hover:text-red-600 transition-colors"
              aria-label="Delete event"
              disabled={isDeleting}
            >
              {isHovering ? (
                <TrashIconOpen className="w-4 h-4" />
              ) : (
                <TrashIconClosed className="w-4 h-4" />
              )}
            </button>
          )}
          
          {/* Category Indicator - Bottom Right */}
          <div className="flex items-center justify-end">
            {(() => {
              const category = event.category || 'Social Activities';
              const IconComponent = getCategoryIcon(category);
              // Get display name (remove "Activities" from "Social Activities")
              const categoryDisplayName = category === 'Social Activities' ? 'Social' : category;
              return (
                <div className="flex items-center gap-1.5">
                  <IconComponent className="w-4 h-4 text-black flex-shrink-0" />
                  <span className="text-xs font-mono font-black text-slate-700 uppercase">{categoryDisplayName}</span>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default EventCard;
