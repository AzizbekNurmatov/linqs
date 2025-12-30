import { useState } from 'react';
import { Calendar, Users, Sparkles, Coffee, Code, Briefcase, ChevronDown, Bookmark, Zap } from 'lucide-react';

function Explore() {
  const [savedEvents, setSavedEvents] = useState(new Set());
  const [boostedEvents, setBoostedEvents] = useState(new Set());
  // Dummy events data
  const events = [
    {
      id: 1,
      date: 'WED, JAN 7 • 6:00 PM EST',
      title: 'Charleston Tech Social',
      hostGroup: 'by Charleston Tech Meetup',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=225&fit=crop',
      attendees: 35,
      price: 'Free',
    },
    {
      id: 2,
      date: 'THU, JAN 8 • 7:30 PM EST',
      title: 'Brooklyn Foodie Walk',
      hostGroup: 'by NYC Foodies',
      imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=225&fit=crop',
      attendees: 42,
      price: '$15',
    },
    {
      id: 3,
      date: 'FRI, JAN 9 • 8:00 PM EST',
      title: 'Manhattan Photography Workshop',
      hostGroup: 'by NYC Photographers',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=225&fit=crop',
      attendees: 18,
      price: 'Free',
    },
    {
      id: 4,
      date: 'SAT, JAN 10 • 10:00 AM EST',
      title: 'Central Park Running Club',
      hostGroup: 'by Brooklyn Hikers',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop',
      attendees: 67,
      price: 'Free',
    },
    {
      id: 5,
      date: 'SUN, JAN 11 • 2:00 PM EST',
      title: 'Startup Pitch Night',
      hostGroup: 'by Tech Meetup',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop',
      attendees: 89,
      price: '$25',
    },
    {
      id: 6,
      date: 'MON, JAN 12 • 6:30 PM EST',
      title: 'Art Gallery Opening',
      hostGroup: 'by NYC Arts Collective',
      imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=225&fit=crop',
      attendees: 124,
      price: 'Free',
    },
    {
      id: 7,
      date: 'TUE, JAN 13 • 7:00 PM EST',
      title: 'Jazz Night at Blue Note',
      hostGroup: 'by Live Music Enthusiasts',
      imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=225&fit=crop',
      attendees: 56,
      price: '$30',
    },
    {
      id: 8,
      date: 'WED, JAN 14 • 5:00 PM EST',
      title: 'Networking Happy Hour',
      hostGroup: 'by Business Professionals',
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=225&fit=crop',
      attendees: 93,
      price: 'Free',
    },
  ];

  // Category icons
  const categories = [
    { name: 'All events', icon: Calendar, active: true },
    { name: 'New Groups', icon: Users, active: false },
    { name: 'Social Activities', icon: Coffee, active: false },
    { name: 'Hobbies', icon: Sparkles, active: false },
    { name: 'Tech', icon: Code, active: false },
    { name: 'Business', icon: Briefcase, active: false },
  ];

  return (
    <div className="bg-[#F6F7F8] pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filter Section */}
        <div className="mb-8">
          {/* Top Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Events near{' '}
              <button className="underline hover:text-gray-700">
                New York, NY
              </button>
            </h1>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 px-3 py-2 hover:bg-gray-50">
                Any day <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 px-3 py-2 hover:bg-gray-50">
                Any type <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 px-3 py-2 hover:bg-gray-50">
                Any distance <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Icons Row */}
          <div className="overflow-x-auto scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0">
            <div className="flex gap-6 pb-2">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={index}
                    className={`flex flex-col items-center gap-2 min-w-[80px] pb-2 transition-colors ${
                      category.active
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                    <span className="text-xs font-medium whitespace-nowrap">
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => {
            const isSaved = savedEvents.has(event.id);
            const isBoosted = boostedEvents.has(event.id);

            return (
              <div
                key={event.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col cursor-pointer"
              >
                {/* Event Image */}
                <div className="relative aspect-video bg-gray-200">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.className += ' bg-gradient-to-br from-gray-300 to-gray-400';
                    }}
                  />
                  
                  {/* Price Badge (Top Left) */}
                  {event.price && (
                    <div className="absolute top-2 left-2 bg-white text-gray-900 text-xs font-semibold px-2 py-1 rounded-sm">
                      {event.price}
                    </div>
                  )}

                  {/* Actions (Top Right) */}
                  <div className="absolute top-2 right-2 flex gap-2 p-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSavedEvents(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(event.id)) {
                            newSet.delete(event.id);
                          } else {
                            newSet.add(event.id);
                          }
                          return newSet;
                        });
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
                        setBoostedEvents(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(event.id)) {
                            newSet.delete(event.id);
                          } else {
                            newSet.add(event.id);
                          }
                          return newSet;
                        });
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

                {/* Event Content */}
                <div className="p-4">
                  {/* Date */}
                  <p className="text-xs font-bold text-[#7C6F50] uppercase tracking-wide mb-1">
                    {event.date}
                  </p>

                  {/* Title */}
                  <h3 className="text-base font-bold text-gray-900 leading-tight mb-1 truncate">
                    {event.title}
                  </h3>

                  {/* Host Group */}
                  <p className="text-sm text-gray-500 mb-3">
                    {event.hostGroup}
                  </p>

                  {/* Footer with Attendees */}
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-white"></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      {event.attendees} attendees
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default Explore;

