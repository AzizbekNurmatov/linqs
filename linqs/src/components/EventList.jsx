import EventCard from './EventCard';

function EventList({ events, onInterested, onBoost }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 pb-12">
      {events.map((event, index) => (
        <EventCard 
          key={index} 
          event={event} 
          onInterested={() => onInterested(index)}
          onBoost={() => onBoost(index)}
        />
      ))}
    </div>
  );
}

export default EventList;
