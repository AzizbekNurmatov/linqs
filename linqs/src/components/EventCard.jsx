import { useState } from 'react';

function EventCard({ event, onInterested, onBoost, onCardClick }) {
  const [isSaved, setIsSaved] = useState(false);
  
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
      className="relative bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg shadow-slate-200/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 ease-out group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Container with Date Badge and Category Badge */}
      <div className="overflow-hidden h-48 relative">
        {event.image ? (
          <img 
            src={event.image} 
            alt={event.title}
            className="object-cover w-full h-full transition-transform duration-700 ease-in-out group-hover:scale-110"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#6C5CE7] to-[#FF7675]"></div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        
        {/* Date Badge - Top Left */}
        <div className="absolute top-4 left-4 backdrop-blur-md bg-white/90 rounded-xl px-3 py-2 shadow-sm">
          <div className="text-center">
            <div className="font-bold text-lg leading-none">{day}</div>
            <div className="text-xs text-slate-600 font-semibold uppercase">{month}</div>
          </div>
        </div>

        {/* Category Badge - Top Right */}
        <div className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-indigo-600 shadow-sm">
          {getCategory()}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
          {event.title}
        </h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Meta Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-1 text-slate-500 text-sm">
            <svg className="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-sm">
            <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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

          {/* Actions - Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSaved(!isSaved);
                onInterested();
              }}
              className={`rounded-full p-2 transition ${
                isSaved
                  ? 'bg-rose-50 text-rose-500'
                  : 'text-slate-400 hover:bg-rose-50 hover:text-rose-500'
              }`}
            >
              <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBoost();
              }}
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-2 rounded-full shadow-md hover:shadow-lg hover:scale-110 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
