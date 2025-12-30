import { useState } from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesBentoGrid from '../components/FeaturesBentoGrid';
import EventList from '../components/EventList';
import EventDetailModal from '../components/EventDetailModal';
import Footer from '../components/Footer';
import { useEvents } from '../context/EventsContext';

function Home() {
  const { events } = useEvents();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleCategoryClick = (category) => {
    // Toggle the category when clicking on priority bar pills
    handleCategoryToggle(category);
  };

  const handleInterested = (index) => {
    console.log(`Interested in event: ${events[index].title}`);
  };

  const handleBoost = (index) => {
    console.log(`Boosted event: ${events[index].title}`);
  };

  // Filter events based on selected categories
  const filteredEvents = selectedCategories.length === 0
    ? events 
    : events.filter(event => {
        const eventText = `${event.title} ${event.description}`.toLowerCase();
        return selectedCategories.some(category => {
          const categoryLower = category.toLowerCase();
          return eventText.includes(categoryLower);
        });
      });
    
  return (
    <>
      <HeroSection 
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        onCategoryClick={handleCategoryClick}
      />
      <FeaturesBentoGrid />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pb-12">
        <EventList 
          events={filteredEvents} 
          onInterested={handleInterested}
          onBoost={handleBoost}
          onCardClick={handleCardClick}
        />
      </main>
      <Footer />
      <EventDetailModal 
        isOpen={isModalOpen}
        event={selectedEvent}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default Home;

