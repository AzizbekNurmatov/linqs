import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { checkEventAttendance, joinEvent, leaveEvent } from '../lib/eventAttendeesService';
import toast from 'react-hot-toast';

/**
 * Custom hook to manage event attendance (join/leave) state
 * @param {string} eventId - The UUID of the event
 * @returns {Object} { isJoined, isLoading, toggleAttendance }
 */
export function useEventAttendance(eventId) {
  const { user } = useAuth();
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  // Check initial attendance status when component mounts or eventId/user changes
  useEffect(() => {
    if (!eventId) {
      setIsLoading(false);
      return;
    }

    const checkAttendance = async () => {
      setIsLoading(true);
      const { data, error } = await checkEventAttendance(eventId);
      
      if (error) {
        console.error('Error checking attendance:', error);
        setIsJoined(false);
      } else {
        setIsJoined(data);
      }
      setIsLoading(false);
    };

    checkAttendance();
  }, [eventId, user?.id]);

  /**
   * Toggle attendance (join if not joined, leave if joined)
   * Implements optimistic UI updates
   */
  const toggleAttendance = async () => {
    // Check if user is logged in
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
    
    // Optimistic update: immediately change UI state
    setIsJoined(!previousState);
    setIsToggling(true);

    try {
      if (previousState) {
        // User is leaving the event
        const { error } = await leaveEvent(eventId);
        
        if (error) {
          // Rollback on error
          setIsJoined(previousState);
          toast.error('Failed to leave event. Please try again.');
        } else {
          toast.success('You left the event');
        }
      } else {
        // User is joining the event
        const { error } = await joinEvent(eventId);
        
        if (error) {
          // Rollback on error
          setIsJoined(previousState);
          toast.error('Failed to join event. Please try again.');
        } else {
          toast.success('You joined the event!');
        }
      }
    } catch (error) {
      // Rollback on error
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
