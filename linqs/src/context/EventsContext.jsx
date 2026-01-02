import { createContext, useContext, useState } from 'react';

const EventsContext = createContext();

export function EventsProvider({ children }) {
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

  const handleAddEvent = (newEvent) => {
    // Format the date for display
    const dateObj = new Date(newEvent.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    // Handle time - if it's already formatted as a range (e.g., "9:00 AM - 5:00 PM"), use it as-is
    // Otherwise, format it from a single time value
    let formattedTime = newEvent.time;
    if (formattedTime && !formattedTime.includes(' - ')) {
      // It's a single time, format it
      try {
        const timeObj = new Date(`2000-01-01T${formattedTime}`);
        formattedTime = timeObj.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
      } catch {
        // If parsing fails, use the time as-is
      }
    }

    const eventToAdd = {
      ...newEvent,
      date: formattedDate,
      time: formattedTime
    };

    setEvents(prev => [...prev, eventToAdd]);
  };

  return (
    <EventsContext.Provider value={{ events, handleAddEvent }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within EventsProvider');
  }
  return context;
}


