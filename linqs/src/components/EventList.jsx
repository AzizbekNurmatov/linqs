import EventCard from './EventCard';

function EventList({ events, joinedEventIds, onInterested, onBoost, onCardClick }) {
  // Create array of 8 slots, filling with events and null for empty slots
  const gridSlots = Array.from({ length: 8 }, (_, index) => events[index] || null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-6 pb-12">
      {gridSlots.map((event, index) => {
        if (!event) {
          // Empty placeholder slot
          return (
            <div key={`placeholder-${index}`} className="hidden lg:block" />
          );
        }
        const isJoined = joinedEventIds ? joinedEventIds.has(event.id) : false;
        return (
          <EventCard 
            key={event.id || event.title} 
            event={event}
            isJoined={isJoined}
            onInterested={() => onInterested(events.indexOf(event))}
            onBoost={() => onBoost(events.indexOf(event))}
            onCardClick={() => onCardClick(event)}
          />
        );
      })}
    </div>
  );
}

export default EventList;
