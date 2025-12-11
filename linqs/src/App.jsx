import { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesBentoGrid from './components/FeaturesBentoGrid';
import EventList from './components/EventList';
import Footer from './components/Footer';

function App() {
  // Hardcoded initial event data
  const [events, setEvents] = useState([
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
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('All');

  const handleAddEvent = (newEvent) => {
    // Format the date for display
    const dateObj = new Date(newEvent.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    // Format the time for display
    const timeObj = new Date(`2000-01-01T${newEvent.time}`);
    const formattedTime = timeObj.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    const eventToAdd = {
      ...newEvent,
      date: formattedDate,
      time: formattedTime
    };

    setEvents([...events, eventToAdd]);
  };

  const handleInterested = (index) => {
    console.log(`Interested in event: ${events[index].title}`);
  };

  const handleBoost = (index) => {
    console.log(`Boosted event: ${events[index].title}`);
  };

  // Filter events based on active filter (simple implementation)
  const filteredEvents = activeFilter === 'All' 
    ? events 
    : events.filter(event => {
        // Simple keyword matching - can be enhanced
        const filterLower = activeFilter.toLowerCase();
        return event.title.toLowerCase().includes(filterLower) ||
               event.description.toLowerCase().includes(filterLower);
      });

  return (
    <div className="min-h-screen flex flex-col">
      <Header onAddEvent={handleAddEvent} />
      <HeroSection activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <FeaturesBentoGrid />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pb-12">
        <EventList 
          events={filteredEvents} 
          onInterested={handleInterested}
          onBoost={handleBoost}
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;
