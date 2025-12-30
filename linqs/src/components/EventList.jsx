import EventCard from './EventCard';

function EventList({ events, onInterested, onBoost, onCardClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
      {events.map((event, index) => (
        <EventCard 
          key={index} 
          event={event} 
          onInterested={() => onInterested(index)}
          onBoost={() => onBoost(index)}
          onCardClick={() => onCardClick(event)}
        />
      ))}
    </div>
  );
}

export default EventList;
