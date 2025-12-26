import { useState } from 'react';

function EventCard({ event, onInterested, onBoost, onCardClick }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isBoosted, setIsBoosted] = useState(false);
  
  // Generate mock avatars for face pile
  const avatars = [
    'https://i.pravatar.cc/150?img=1',
    'https://i.pravatar.cc/150?img=2',
    'https://i.pravatar.cc/150?img=3',
  ];

  // Extract day and month from date
  const dateParts = event.date.split(' ');
  const day = dateParts[1]?.replace(',', '') || '';
  const month = dateParts[0]?.substring(0, 3) || '';

  // Extract category from event title/description
  const getCategory = () => {
    const text = `${event.title} ${event.description}`.toLowerCase();
    if (text.includes('music') || text.includes('festival') || text.includes('concert')) return 'Music';
    if (text.includes('art') || text.includes('gallery') || text.includes('exhibition')) return 'Art';
    if (text.includes('food') || text.includes('wine') || text.includes('tasting')) return 'Food';
    if (text.includes('tech') || text.includes('innovation') || text.includes('summit')) return 'Tech';
    if (text.includes('yoga') || text.includes('fitness') || text.includes('wellness')) return 'Wellness';
    if (text.includes('comedy') || text.includes('stand-up')) return 'Comedy';
    return 'Event';
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
      className="relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out group cursor-pointer transform-gpu"
      onClick={handleCardClick}
    >
      {/* Image Container with Date Badge */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {event.image ? (
          <img 
            src={event.image} 
            alt={event.title}
            className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#6C5CE7] to-[#FF7675]"></div>
        )}
        
        {/* Date Badge - Glassmorphism Style */}
        <div className="absolute top-3 left-3 backdrop-blur-md bg-black/30 rounded-lg px-2.5 py-1.5">
          <div className="text-center">
            <div className="font-semibold text-sm leading-none text-white">{day}</div>
            <div className="text-[10px] text-white/90 font-medium uppercase tracking-wide">{month}</div>
          </div>
        </div>

        {/* Category Badge - Top Right */}
        <div className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md text-white shadow-sm">
          {getCategory()}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          {event.title}
        </h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          {event.description}
        </p>

        {/* Meta Info */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-1.5 text-slate-500 text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{event.time}</span>
          </div>
        </div>

        {/* Action Bar - Face Pile and Actions */}
        <div className="flex items-center justify-between">
          {/* Face Pile - Left */}
          <div className="flex items-center -space-x-2">
            {avatars.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt={`Attendee ${index + 1}`}
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
              />
            ))}
          </div>

          {/* Actions - Right (Ghost Buttons) */}
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSaved(!isSaved);
                onInterested();
              }}
              className={`rounded-lg p-2 transition-colors ${
                isSaved
                  ? 'text-black hover:bg-slate-50'
                  : 'text-slate-400 hover:text-black hover:bg-slate-50'
              }`}
              aria-label="Bookmark event"
            >
              <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isSaved ? "0" : "2"}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsBoosted(!isBoosted);
                onBoost();
              }}
              className={`rounded-lg p-2 transition-colors ${
                isBoosted
                  ? 'text-yellow-500 hover:bg-yellow-50'
                  : 'text-slate-400 hover:text-yellow-500 hover:bg-yellow-50'
              }`}
              aria-label="Boost event"
            >
              <svg className="w-5 h-5" fill={isBoosted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isBoosted ? "0" : "2"}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
