import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, X, Link as LinkIcon, Check } from 'lucide-react';
import { useEventAttendance } from '../hooks/useEventAttendance';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Join Event Button Component
function JoinEventButton({ event, isJoined, isLoading, isToggling, user, onToggleAttendance, onLoginRequired }) {
  const isOnline = event?.is_online || event?.isOnline;
  const meetingLink = event?.location_link || event?.meetingLink;
  const isDisabled = isLoading || isToggling;

  const handleClick = () => {
    // If user is not logged in, show toast and redirect to login
    if (!user) {
      toast.error('Please log in to join events');
      onLoginRequired();
      return;
    }

    // If it's an online event with a link, open the link
    if (isOnline && meetingLink) {
      window.open(meetingLink, '_blank', 'noopener,noreferrer');
    }

    // Toggle attendance (join/leave)
    onToggleAttendance();
  };

  // Determine button text and styling based on state
  const getButtonContent = () => {
    if (isLoading) {
      return {
        text: 'LOADING...',
        className: 'w-full py-4 bg-gray-400 text-white font-bold uppercase text-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-not-allowed transition-all duration-200',
      };
    }

    if (isJoined) {
      return {
        text: 'SEE YOU THERE!',
        className: 'w-full py-4 bg-green-600 text-white font-bold uppercase text-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:translate-y-1 hover:shadow-none transition-all duration-200 flex items-center justify-center gap-2',
        icon: <Check className="w-5 h-5 text-white" />,
      };
    }

    return {
      text: 'JOIN EVENT',
      className: 'w-full py-4 bg-blue-600 text-white font-bold uppercase text-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:translate-y-1 hover:shadow-none transition-all duration-200',
    };
  };

  const buttonContent = getButtonContent();

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={buttonContent.className}
    >
      {buttonContent.icon}
      {buttonContent.text}
    </button>
  );
}

// Dynamic tag color function - deterministically assigns neon pastel backgrounds
function getTagColor(tagName) {
  // Define neon pastel color palette
  const colorClasses = [
    'bg-yellow-200 text-black',
    'bg-pink-200 text-black',
    'bg-green-200 text-black',
    'bg-blue-200 text-black',
    'bg-purple-200 text-black',
    'bg-orange-200 text-black',
    'bg-cyan-200 text-black',
    'bg-lime-200 text-black',
  ];
  
  // Hash function: sum character codes
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash += tagName.charCodeAt(i);
  }
  
  // Get index from palette using modulo
  const index = Math.abs(hash) % colorClasses.length;
  
  // Return Tailwind classes: background and text
  return colorClasses[index];
}

function EventDetailModal({ isOpen, event, onClose }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isJoined, isLoading, isToggling, toggleAttendance } = useEventAttendance(event?.id);

  // Trigger animation when modal opens
  useEffect(() => {
    if (isOpen) {
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
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  // Get tags from event data
  const tags = (event.tags && Array.isArray(event.tags)) ? event.tags : [];

  // Generate host name
  const getHostName = () => {
    if (event.host) return event.host;
    if (event.hostGroup) {
      return event.hostGroup.replace('by ', '');
    }
    return 'Event Organizer';
  };
  
  const hostName = getHostName();
  
  // Handle image URL
  const imageUrl = event.image_url || event.image || event.imageUrl;
  
  // Handle location - use address for in-person, location_link for online
  const getLocation = () => {
    if (event.is_online || event.isOnline) {
      return event.location_link || event.meetingLink || 'Online Event';
    }
    return event.address || event.location || 'Location TBD';
  };
  
  const location = getLocation();
  
  // Handle description - use the new description column
  const description = event.description || 'No description available.';
  
  // Format date for display
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return 'Date TBD';
    if (typeof dateStr === 'string' && dateStr.includes(',')) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      if (monthNames.some(month => dateStr.includes(month))) {
        return dateStr;
      }
    }
    try {
      const dateObj = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
      if (isNaN(dateObj.getTime())) {
        return dateStr;
      }
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      return dateObj.toLocaleDateString('en-US', options);
    } catch {
      return dateStr;
    }
  };
  
  // Format time from HH:MM to readable format
  const formatTime = (timeStr) => {
    if (!timeStr) return null;
    if (timeStr.includes(' - ')) {
      return timeStr;
    }
    try {
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeStr;
    }
  };
  
  // Check if event is recurring
  const isRecurring = event.is_recurring || event.isRecurring || false;
  const recurringDays = event.recurring_days || event.recurringDays || [];
  
  // Get formatted date/time display
  const getDateTimeDisplay = () => {
    const startDate = event.start_date || event.startDate || event.date;
    const endDate = event.end_date || event.endDate;
    const startTime = event.start_time || event.startTime;
    const endTime = event.end_time || event.endTime;
    
    // For recurring events, don't format the date (we'll show day pills instead)
    const formattedDate = isRecurring ? null : formatDateDisplay(startDate);
    let formattedTime = null;
    
    if (startTime && endTime) {
      formattedTime = `${formatTime(startTime)} - ${formatTime(endTime)}`;
    } else if (startTime) {
      formattedTime = formatTime(startTime);
    } else if (event.time) {
      formattedTime = event.time;
    }
    
    return {
      date: formattedDate,
      time: formattedTime,
      isRecurring: isRecurring,
      recurringDays: recurringDays
    };
  };
  
  const dateTimeDisplay = getDateTimeDisplay();

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Modal Panel */}
      <div
        className={`relative bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-5xl w-full max-h-[90vh] overflow-y-auto transform transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Hero Banner Section */}
        <div className="relative h-64 md:h-72 w-full overflow-hidden border-b-4 border-black">
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
            <div className="w-full h-full bg-gray-300" />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Close Button - Top Right - Square */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 border-2 border-black bg-white flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-200 z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Title and Host Info - Absolute positioned at bottom-left */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
            <h2 className="text-5xl font-black text-white mb-2 uppercase tracking-tighter drop-shadow-lg">
              {event.title}
            </h2>
            <p className="text-white/90 text-sm font-mono uppercase drop-shadow-md">
              HOSTED BY <span className="font-black">{hostName.toUpperCase()}</span>
            </p>
          </div>
        </div>

        {/* 2. Tags Row */}
        {tags.length > 0 && (
          <div className="w-full px-6 py-4 bg-gray-50 border-b-2 border-black">
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 border-2 border-black text-xs font-bold uppercase whitespace-nowrap ${getTagColor(tag)}`}
                >
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 3. Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-0">
          {/* Left Column - About the Event */}
          <div className="p-6 md:p-8 space-y-4">
            <h3 className="text-xl font-black text-black uppercase">About the Event</h3>
            <div className="text-black text-base leading-relaxed whitespace-pre-wrap">
              {description}
            </div>
          </div>

          {/* Right Column - Ticket Stub Sidebar */}
          <div className="lg:sticky lg:top-0 h-fit border-l-4 border-dashed border-black bg-gray-50">
            <div className="p-6 space-y-6">
              {/* Date & Time */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-mono uppercase text-gray-500 mb-1">Date</p>
                    {dateTimeDisplay.isRecurring && dateTimeDisplay.recurringDays.length > 0 ? (
                      // Show 7-day row for recurring events - Brutalist style
                      <div className="flex gap-1 mt-1">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => {
                          const isSelected = dateTimeDisplay.recurringDays.includes(day);
                          return (
                            <div
                              key={day}
                              className={`flex-1 px-1 py-1 border-2 border-black text-[10px] font-black text-center transition-colors ${
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
                    ) : (
                      // Show standard date format for non-recurring events - Monospace
                      <p className="text-base font-mono font-black text-black mt-1">
                        {dateTimeDisplay.date || 'DATE TBD'}
                      </p>
                    )}
                  </div>
                </div>
                
                {dateTimeDisplay.time && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-mono uppercase text-gray-500 mb-1">Time</p>
                      <p className="text-base font-mono font-black text-black">{typeof dateTimeDisplay.time === 'string' ? dateTimeDisplay.time.toUpperCase() : dateTimeDisplay.time}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Location */}
              {location && location !== 'Location TBD' && (
                <div className="flex items-start gap-3">
                  {event.is_online || event.isOnline ? (
                    <LinkIcon className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
                  ) : (
                    <MapPin className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-xs font-mono uppercase text-gray-500 mb-1">Location</p>
                    {event.is_online || event.isOnline ? (
                      <a
                        href={event.location_link || event.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-mono font-black text-black underline hover:no-underline break-words"
                      >
                        {location}
                      </a>
                    ) : (
                      <p className="text-base font-mono font-black text-black">{location}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Join Event Button */}
              <JoinEventButton
                event={event}
                isJoined={isJoined}
                isLoading={isLoading}
                isToggling={isToggling}
                user={user}
                onToggleAttendance={toggleAttendance}
                onLoginRequired={() => navigate('/login')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailModal;
