import { supabase } from './supabase';

/**
 * Join an event for the current user
 * @param {string} eventId - The UUID of the event to join
 * @returns {Promise<{data: any, error: any}>}
 */
export async function joinEvent(eventId) {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User must be authenticated to join events');
    }

    // Insert into event_attendees table
    const { data, error } = await supabase
      .from('event_attendees')
      .insert({
        user_id: user.id,
        event_id: eventId,
      })
      .select()
      .single();

    if (error) {
      // If error is due to duplicate (composite primary key violation), that's okay
      if (error.code === '23505') {
        // Already joined, return success
        return { data: { user_id: user.id, event_id: eventId }, error: null };
      }
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error joining event:', error);
    return { data: null, error };
  }
}

/**
 * Leave (unjoin) an event for the current user
 * @param {string} eventId - The UUID of the event to leave
 * @returns {Promise<{data: any, error: any}>}
 */
export async function leaveEvent(eventId) {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User must be authenticated to leave events');
    }

    // Delete from event_attendees table
    const { data, error } = await supabase
      .from('event_attendees')
      .delete()
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .select();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error leaving event:', error);
    return { data: null, error };
  }
}

/**
 * Check if the current user has joined a specific event
 * @param {string} eventId - The UUID of the event to check
 * @returns {Promise<{data: boolean, error: any}>}
 */
export async function checkEventAttendance(eventId) {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      // Not authenticated, return false
      return { data: false, error: null };
    }

    // Check if user has joined this event
    const { data, error } = await supabase
      .from('event_attendees')
      .select('user_id')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .maybeSingle();

    if (error) throw error;

    // Return true if a row exists, false otherwise
    return { data: !!data, error: null };
  } catch (error) {
    console.error('Error checking event attendance:', error);
    return { data: false, error };
  }
}

/**
 * Get all event IDs that the current user has joined
 * @returns {Promise<{data: string[], error: any}>}
 */
export async function getJoinedEventIds() {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      // Not authenticated, return empty array
      return { data: [], error: null };
    }

    // Fetch joined event IDs
    const { data, error } = await supabase
      .from('event_attendees')
      .select('event_id')
      .eq('user_id', user.id);

    if (error) throw error;

    // Extract just the event IDs
    const eventIds = (data || []).map(row => row.event_id);
    
    return { data: eventIds, error: null };
  } catch (error) {
    console.error('Error fetching joined event IDs:', error);
    return { data: [], error };
  }
}
