import { useState, useEffect } from 'react';
import { Calendar, Users, Sparkles, Coffee, Code, Briefcase, ChevronDown } from 'lucide-react';
import EventCard from '../components/EventCard';
import EventDetailModal from '../components/EventDetailModal';

function Explore() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openFilter, setOpenFilter] = useState('');
  const [filters, setFilters] = useState({
    day: 'Any day',
    type: 'Any type',
    distance: 'Any distance',
    price: 'Any price',
  });

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleInterested = (event) => {
    console.log(`Interested in event: ${event.title}`);
  };

  const handleBoost = (event) => {
    console.log(`Boosted event: ${event.title}`);
  };
  // Dummy events data - matching Home page structure
  const events = [
    {
      title: "Summer Music Festival",
      description: "Join us for an unforgettable weekend of live music featuring local and international artists across multiple stages.",
      location: "Central Park",
      date: "July 15, 2024",
      time: "2:00 PM - 10:00 PM",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=200&fit=crop"
    },
    {
      title: "Art Gallery Opening",
      description: "Experience contemporary art from emerging local artists. Wine and refreshments will be served.",
      location: "Downtown Art Gallery",
      date: "July 18, 2024",
      time: "6:00 PM - 9:00 PM",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=200&fit=crop"
    },
    {
      title: "Food & Wine Tasting",
      description: "Sample exquisite dishes from top local restaurants paired with fine wines from regional vineyards.",
      location: "Riverside Pavilion",
      date: "July 20, 2024",
      time: "5:00 PM - 8:00 PM",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop"
    },
    {
      title: "Tech Innovation Summit",
      description: "Connect with industry leaders and discover the latest trends in technology and innovation.",
      location: "Convention Center",
      date: "July 22, 2024",
      time: "9:00 AM - 5:00 PM",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop"
    },
    {
      title: "Yoga in the Park",
      description: "Start your weekend with a peaceful morning yoga session surrounded by nature. All levels welcome.",
      location: "Riverside Park",
      date: "July 23, 2024",
      time: "8:00 AM - 9:30 AM",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=200&fit=crop"
    },
    {
      title: "Comedy Night",
      description: "Laugh the night away with stand-up comedians from across the country. 21+ event.",
      location: "The Comedy Club",
      date: "July 25, 2024",
      time: "8:00 PM - 11:00 PM",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=200&fit=crop"
    },
    {
      title: "Networking Happy Hour",
      description: "Connect with professionals from various industries over drinks and appetizers. Great for expanding your network.",
      location: "Downtown Bar & Grill",
      date: "July 26, 2024",
      time: "6:00 PM - 8:00 PM",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=200&fit=crop"
    },
    {
      title: "Photography Workshop",
      description: "Learn advanced photography techniques from professional photographers. Bring your camera!",
      location: "Art Studio Downtown",
      date: "July 27, 2024",
      time: "10:00 AM - 2:00 PM",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop"
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

  // Filter options
  const filterOptions = {
    day: ['Any day', 'Today', 'Tomorrow', 'This Weekend', 'This Week', 'Next Week'],
    type: ['Any type', 'Online', 'In Person', 'Hybrid'],
    distance: ['Any distance', 'Within 1 mile', 'Within 5 miles', 'Within 10 miles', 'Within 25 miles'],
    price: ['Any price', 'Free', 'Under $20', 'Under $50'],
  };

  const handleFilterClick = (filterName) => {
    setOpenFilter(openFilter === filterName ? '' : filterName);
  };

  const handleFilterSelect = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
    setOpenFilter('');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.filter-dropdown')) {
        setOpenFilter('');
      }
    };

    if (openFilter) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openFilter]);

  // FilterDropdown component
  const FilterDropdown = ({ label, filterName, options }) => {
    const isOpen = openFilter === filterName;
    const selectedValue = filters[filterName];

    return (
      <div className="relative filter-dropdown">
        <button
          onClick={() => handleFilterClick(filterName)}
          className="flex items-center gap-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 px-3 py-2 hover:bg-gray-50"
        >
          {selectedValue} <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-20 w-48">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleFilterSelect(filterName, option)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  option === selectedValue ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#F6F7F8] pt-32 pb-16 min-h-screen">
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
              <FilterDropdown label="Day" filterName="day" options={filterOptions.day} />
              <FilterDropdown label="Type" filterName="type" options={filterOptions.type} />
              <FilterDropdown label="Distance" filterName="distance" options={filterOptions.distance} />
              <FilterDropdown label="Price" filterName="price" options={filterOptions.price} />
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
          {events.map((event, index) => (
            <EventCard 
              key={index} 
              event={event} 
              onInterested={() => handleInterested(event)}
              onBoost={() => handleBoost(event)}
              onCardClick={() => handleCardClick(event)}
            />
          ))}
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
      
      {/* Event Detail Modal */}
      <EventDetailModal 
        isOpen={isModalOpen}
        event={selectedEvent}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default Explore;

