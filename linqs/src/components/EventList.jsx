import EventCard from './EventCard';

function EventList({ events, onInterested, onBoost, onCardClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
      {events.map((event) => (
        <EventCard 
          key={event.id || event.title} 
          event={event} 
          onInterested={() => onInterested(events.indexOf(event))}
          onBoost={() => onBoost(events.indexOf(event))}
          onCardClick={() => onCardClick(event)}
        />
      ))}
    </div>
  );
}

export default EventList;
