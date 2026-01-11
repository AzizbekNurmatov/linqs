import { createContext, useContext, useState, useEffect } from 'react';
import { saveEvent, unsaveEvent, getSavedEventIds, getSavedEvents } from '../lib/savedEventsService';
import { supabase } from '../lib/supabase';

const SavedEventsContext = createContext();

export function SavedEventsProvider({ children }) {
  const [savedEvents, setSavedEvents] = useState([]);
  const [savedEventIds, setSavedEventIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Load saved events on mount and when auth state changes
  useEffect(() => {
    const loadSavedEvents = async () => {
      try {
        setLoading(true);
        // Fetch saved event IDs
        const { data: eventIds, error: idsError } = await getSavedEventIds();
        if (idsError) {
          console.error('Error loading saved event IDs:', idsError);
          setSavedEventIds(new Set());
        } else {
          setSavedEventIds(new Set(eventIds));
        }

        // Fetch full saved events data
        const { data: events, error: eventsError } = await getSavedEvents();
        if (eventsError) {
          console.error('Error loading saved events:', eventsError);
          setSavedEvents([]);
        } else {
          setSavedEvents(events || []);
        }
      } catch (error) {
        console.error('Error loading saved events:', error);
        setSavedEventIds(new Set());
        setSavedEvents([]);
      } finally {
        setLoading(false);
      }
    };

    // Initial load
    loadSavedEvents();

    // Listen for auth state changes to reload saved events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        loadSavedEvents();
      } else {
        // User logged out, clear saved events
        setSavedEventIds(new Set());
        setSavedEvents([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleSaveEvent = async (event) => {
    // Require event ID for Supabase operations
    if (!event.id) {
      console.warn('Event must have an id to be saved');
      return;
    }

    const eventId = event.id;
    const isCurrentlySaved = savedEventIds.has(eventId);

    // Optimistic UI update
    if (isCurrentlySaved) {
      // Remove from local state immediately
      setSavedEventIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
      setSavedEvents(prev => prev.filter(e => e.id !== eventId));
    } else {
      // Add to local state immediately
      setSavedEventIds(prev => new Set([...prev, eventId]));
      setSavedEvents(prev => [
        {
          ...event,
          savedAt: new Date().toISOString(),
        },
        ...prev
      ]);
    }

    // Perform the actual save/unsave operation
    try {
      if (isCurrentlySaved) {
        const { error } = await unsaveEvent(eventId);
        if (error) {
          // Revert optimistic update on error
          setSavedEventIds(prev => new Set([...prev, eventId]));
          const { data: events } = await getSavedEvents();
          setSavedEvents(events || []);
          throw error;
        }
      } else {
        const { error } = await saveEvent(eventId);
        if (error) {
          // Revert optimistic update on error
          setSavedEventIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(eventId);
            return newSet;
          });
          setSavedEvents(prev => prev.filter(e => e.id !== eventId));
          throw error;
        }
        // Reload saved events to get the correct timestamp from database
        const { data: events } = await getSavedEvents();
        if (events) {
          setSavedEvents(events);
        }
      }
    } catch (error) {
      console.error('Error toggling saved event:', error);
      // Optionally show user-friendly error message
    }
  };

  const isEventSaved = (event) => {
    // First check by ID (preferred method)
    if (event.id) {
      return savedEventIds.has(event.id);
    }
    // Fallback to title/date matching for backward compatibility
    return savedEvents.some(
      saved => saved.title === event.title && saved.date === event.date
    );
  };

  return (
    <SavedEventsContext.Provider value={{ 
      savedEvents, 
      toggleSaveEvent, 
      isEventSaved,
      loading 
    }}>
      {children}
    </SavedEventsContext.Provider>
  );
}

export function useSavedEvents() {
  const context = useContext(SavedEventsContext);
  if (!context) {
    throw new Error('useSavedEvents must be used within SavedEventsProvider');
  }
  return context;
}

