import { useState, useEffect } from 'react';

function SavedEventsDrawer({ isOpen, onClose }) {
  const [expandedId, setExpandedId] = useState(null);

  // Dummy saved events data
  const savedEvents = [
    {
      id: 1,
      title: "Summer Music Festival",
      description: "Join us for an unforgettable weekend of live music featuring local and international artists across multiple stages.",
      location: "Central Park",
      date: "July 15, 2024",
      time: "2:00 PM - 10:00 PM",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Art Gallery Opening",
      description: "Experience contemporary art from emerging local artists. Wine and refreshments will be served.",
      location: "Downtown Art Gallery",
      date: "July 18, 2024",
      time: "6:00 PM - 9:00 PM",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Food & Wine Tasting",
      description: "Sample exquisite dishes from top local restaurants paired with fine wines from regional vineyards.",
      location: "Riverside Pavilion",
      date: "July 20, 2024",
      time: "5:00 PM - 8:00 PM",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop"
    },
    {
      id: 4,
      title: "Tech Innovation Summit",
      description: "Connect with industry leaders and discover the latest trends in technology and innovation.",
      location: "Convention Center",
      date: "July 22, 2024",
      time: "9:00 AM - 5:00 PM",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop"
    },
    {
      id: 5,
      title: "Yoga in the Park",
      description: "Start your weekend with a peaceful morning yoga session surrounded by nature. All levels welcome.",
      location: "Riverside Park",
      date: "July 23, 2024",
      time: "8:00 AM - 9:30 AM",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=200&fit=crop"
    }
  ];

  // Set first event as expanded by default when drawer opens
  useEffect(() => {
    if (isOpen && savedEvents.length > 0) {
      setExpandedId(savedEvents[0].id);
    } else if (!isOpen) {
      setExpandedId(null);
    }
  }, [isOpen]);

  // Extract day and month from date
  const getDateParts = (dateString) => {
    const dateParts = dateString.split(' ');
    const day = dateParts[1]?.replace(',', '') || '';
    const month = dateParts[0]?.substring(0, 3) || '';
    return { day, month };
  };

  const handleCardClick = (eventId) => {
    // Only expand if clicking a collapsed card
    if (expandedId !== eventId) {
      setExpandedId(eventId);
    }
  };

  // Sort events: inactive cards first, then active card at the end (bottom visually)
  const sortedEvents = [...savedEvents].sort((a, b) => {
    if (a.id === expandedId) return 1; // Active card goes to end
    if (b.id === expandedId) return -1;
    return 0; // Keep original order for inactive cards
  });

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Saved Events
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-lg hover:bg-slate-100"
            aria-label="Close drawer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* File Folder Stack Container */}
        <div className="h-[calc(100vh-73px)] overflow-y-auto px-6 py-6">
          <div className="flex flex-col">
            {sortedEvents.map((event, index) => {
              const isActive = event.id === expandedId;
              const { day, month } = getDateParts(event.date);

              return (
                <div
                  key={event.id}
                  onClick={() => handleCardClick(event.id)}
                  className={`relative cursor-pointer transition-all duration-500 ease-out ${
                    isActive 
                      ? 'z-10' 
                      : 'z-0 -mb-4 opacity-80'
                  }`}
                >
                  {isActive ? (
                    // Active Card (Full Height, Front Layer)
                    <div className="bg-white rounded-2xl border-2 border-slate-300 overflow-hidden shadow-[0_-5px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_-5px_25px_rgba(0,0,0,0.15)] transition-all duration-500">
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {event.image ? (
                          <img
                            src={event.image}
                            alt={event.title}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#6C5CE7] to-[#FF7675]"></div>
                        )}

                        {/* Date Badge */}
                        <div className="absolute top-3 left-3 backdrop-blur-md bg-black/30 rounded-lg px-2.5 py-1.5">
                          <div className="text-center">
                            <div className="font-semibold text-sm leading-none text-white">{day}</div>
                            <div className="text-[10px] text-white/90 font-medium uppercase tracking-wide">{month}</div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-slate-900 mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                          {event.title}
                        </h3>
                        <p className="text-slate-500 text-sm mb-4 line-clamp-2" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                          {event.description}
                        </p>

                        {/* Meta Info */}
                        <div className="space-y-1.5">
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
                          <div className="flex items-center gap-1.5 text-slate-500 text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                            <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{event.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Inactive Card (Tab - Short Height, Behind)
                    <div className="h-14 bg-gray-100 rounded-t-2xl border-2 border-b-0 border-slate-200 overflow-hidden flex items-center px-4 hover:bg-gray-200 transition-colors duration-200">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden mr-3">
                        {event.image ? (
                          <img
                            src={event.image}
                            alt={event.title}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#6C5CE7] to-[#FF7675]"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-slate-900 truncate" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="truncate">{event.location}</span>
                          <span>•</span>
                          <span className="whitespace-nowrap">{day} {month}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default SavedEventsDrawer;

