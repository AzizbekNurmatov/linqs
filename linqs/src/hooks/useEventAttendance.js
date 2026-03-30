/**
 * Encapsulates per-event join/leave attendance: reads `event_attendees` via the service layer,
 * and coordinates optimistic UI with rollback when Supabase rejects the mutation (RLS or network).
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { checkEventAttendance, joinEvent, leaveEvent } from '../lib/eventAttendeesService';
import toast from 'react-hot-toast';

/**
 * @param {string} eventId - The UUID of the event
 * @returns {Object} { isJoined, isLoading, isToggling, toggleAttendance }
 */
export function useEventAttendance(eventId) {
  const { user } = useAuth();
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  /** Tracks in-flight mutation so callers can disable buttons while the server confirms. */
  const [isToggling, setIsToggling] = useState(false);

  /**
   * Side effect: load whether the current user has a row in `event_attendees` for this event.
   * Re-runs when `eventId` or `user?.id` changes (different event or login/logout).
   * `isMounted` prevents setState after unmount if the async read resolves late (avoids leaks + React warnings).
   */
  useEffect(() => {
    if (!eventId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const checkAttendance = async () => {
      setIsLoading(true);
      const { data, error } = await checkEventAttendance(eventId);
      
      if (!isMounted) return;
      
      if (error) {
        console.error('Error checking attendance:', error);
        setIsJoined(false);
      } else {
        setIsJoined(data);
      }
      setIsLoading(false);
    };

    checkAttendance();
    
    return () => {
      isMounted = false;
    };
  }, [eventId, user?.id]);

  /**
   * Optimistic path: flip `isJoined` immediately, then call `leaveEvent` / `joinEvent`.
   * On error, roll back to `previousState` and surface toast—RLS (e.g. insert denied) surfaces here as `error`.
   */
  const toggleAttendance = async () => {
    if (!user) {
      toast.error('Please log in to join events');
      return;
    }

    if (!eventId) {
      toast.error('Invalid event');
      return;
    }

    // Store previous state for rollback
    const previousState = isJoined;
    setIsJoined(!previousState);
    setIsToggling(true);

    try {
      if (previousState) {
        const { error } = await leaveEvent(eventId);
        
        if (error) {
          setIsJoined(previousState);
          toast.error('Failed to leave event. Please try again.');
        } else {
          toast.success('You left the event');
        }
      } else {
        const { error } = await joinEvent(eventId);
        
        if (error) {
          setIsJoined(previousState);
          toast.error('Failed to join event. Please try again.');
        } else {
          toast.success('You joined the event!');
        }
      }
    } catch (error) {
      setIsJoined(previousState);
      console.error('Error toggling attendance:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsToggling(false);
    }
  };

  return {
    isJoined,
    isLoading,
    isToggling,
    toggleAttendance,
  };
}
