import { useState } from 'react';

function EventCard({ event, onInterested, onBoost }) {
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

  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 ease-out overflow-hidden group">
      {/* Image Container with Date Badge and Face Pile */}
      <div className="relative aspect-[4/3] overflow-hidden">
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
          <div className="w-full h-full bg-gradient-to-br from-[#6C5CE7] to-[#FF7675]"></div>
        )}
        
        {/* Date Badge - Top Left */}
        <div className="absolute top-4 left-4 bg-white rounded-xl px-3 py-2 shadow-lg">
          <div className="text-center">
            <div className="font-bold text-lg leading-none">{day}</div>
            <div className="text-xs text-[#636E72] font-semibold uppercase">{month}</div>
          </div>
        </div>

        {/* Face Pile - Bottom Right */}
        <div className="absolute bottom-4 right-4 flex items-center">
          {avatars.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`Attendee ${index + 1}`}
              className={`w-8 h-8 rounded-full border-2 border-white ${
                index > 0 ? '-ml-2' : ''
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <h3 className="font-heading font-bold text-xl mb-2 text-[#2D3436] line-clamp-2 min-h-[3.5rem]">
          {event.title}
        </h3>
        <p className="text-[#636E72] text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Meta Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-[#636E72] text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-[#636E72] text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{event.time}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsSaved(!isSaved);
              onInterested();
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ease-out active:scale-95 ${
              isSaved
                ? 'bg-gradient-to-r from-[#6C5CE7] to-[#FF7675] text-white'
                : 'bg-[#FAFAFA] text-[#636E72] hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button
            onClick={onBoost}
            className="w-10 h-10 rounded-full bg-[#FAFAFA] text-[#636E72] hover:bg-gray-100 flex items-center justify-center transition-all duration-200 ease-out active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
