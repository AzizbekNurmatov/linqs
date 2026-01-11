import { supabase } from './supabase';

/**
 * Save an event for the current user
 * @param {string} eventId - The UUID of the event to save
 * @returns {Promise<{data: any, error: any}>}
 */
export async function saveEvent(eventId) {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User must be authenticated to save events');
    }

    // Insert into saved_events table
    const { data, error } = await supabase
      .from('saved_events')
      .insert({
        user_id: user.id,
        event_id: eventId,
      })
      .select()
      .single();

    if (error) {
      // If error is due to duplicate (composite primary key violation), that's okay
      if (error.code === '23505') {
        // Already saved, return success
        return { data: { id: eventId }, error: null };
      }
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error saving event:', error);
    return { data: null, error };
  }
}

/**
 * Unsave (remove) an event for the current user
 * @param {string} eventId - The UUID of the event to unsave
 * @returns {Promise<{data: any, error: any}>}
 */
export async function unsaveEvent(eventId) {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User must be authenticated to unsave events');
    }

    // Delete from saved_events table
    const { data, error } = await supabase
      .from('saved_events')
      .delete()
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .select();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error unsaving event:', error);
    return { data: null, error };
  }
}

/**
 * Get all saved event IDs for the current user
 * @returns {Promise<{data: string[], error: any}>}
 */
export async function getSavedEventIds() {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      // Not authenticated, return empty array
      return { data: [], error: null };
    }

    // Fetch saved event IDs
    const { data, error } = await supabase
      .from('saved_events')
      .select('event_id')
      .eq('user_id', user.id);

    if (error) throw error;

    // Extract just the event IDs
    const eventIds = (data || []).map(row => row.event_id);
    
    return { data: eventIds, error: null };
  } catch (error) {
    console.error('Error fetching saved event IDs:', error);
    return { data: [], error };
  }
}

/**
 * Get full event details for all saved events by the current user
 * @returns {Promise<{data: any[], error: any}>}
 */
export async function getSavedEvents() {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      // Not authenticated, return empty array
      return { data: [], error: null };
    }

    // Fetch saved events with full event details using a join
    const { data, error } = await supabase
      .from('saved_events')
      .select(`
        event_id,
        created_at,
        events (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform the data to flatten the structure
    const savedEvents = (data || []).map((savedEvent) => {
      const event = savedEvent.events;
      if (!event) return null;

      // Format time - combine start_time and end_time if both exist
      let timeDisplay = event.start_time || '';
      if (event.start_time && event.end_time) {
        const formatTime = (timeStr) => {
          if (!timeStr) return '';
          const [hours, minutes] = timeStr.split(':');
          const hour = parseInt(hours, 10);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour % 12 || 12;
          return `${displayHour}:${minutes} ${ampm}`;
        };
        timeDisplay = `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`;
      } else if (event.start_time) {
        const [hours, minutes] = event.start_time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        timeDisplay = `${displayHour}:${minutes} ${ampm}`;
      }

      // Map to component-friendly format (similar to Home.jsx and Explore.jsx)
      return {
        id: event.id,
        title: event.title,
        description: event.description || '',
        date: event.start_date,
        startDate: event.start_date,
        endDate: event.end_date || null,
        time: timeDisplay,
        startTime: event.start_time || null,
        endTime: event.end_time || null,
        image: event.image_url || null,
        imageUrl: event.image_url || null,
        location: event.is_online ? null : (event.address || null),
        meetingLink: event.is_online ? (event.location_link || null) : null,
        url: event.location_link || null,
        website: event.location_link || null,
        category: event.category || 'Social Activities',
        tags: event.tags || [],
        isOnline: event.is_online || false,
        is_recurring: event.is_recurring || false,
        isRecurring: event.is_recurring || false,
        recurring_days: event.recurring_days || null,
        recurringDays: event.recurring_days || null,
        savedAt: savedEvent.created_at, // Use the saved_events created_at timestamp
        // Keep original data for reference
        ...event,
      };
    }).filter(event => event !== null); // Remove any null entries

    return { data: savedEvents, error: null };
  } catch (error) {
    console.error('Error fetching saved events:', error);
    return { data: [], error };
  }
}
