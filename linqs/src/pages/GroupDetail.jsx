import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, MessageSquare, Image as ImageIcon, User, Plus, Loader2 } from 'lucide-react';
import EventCard from '../components/EventCard';
import EventForm from '../components/EventForm';
import AddMediaModal from '../components/AddMediaModal';
import EventDetailModal from '../components/EventDetailModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { getJoinedEventIds } from '../lib/eventAttendeesService';
import toast from 'react-hot-toast';

// CreatePostWidget Component
function CreatePostWidget({ communityId, userAvatar, onPostCreated }) {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!postContent.trim() || !user) {
      toast.error('Please sign in to post');
      return;
    }

    setIsPosting(true);
    try {
      const { error } = await supabase
        .from('discussion_posts')
        .insert([
          {
            community_id: communityId,
            user_id: user.id,
            content: postContent.trim(),
          },
        ]);

      if (error) throw error;

      toast.success('Post created!');
      setPostContent('');
      setIsExpanded(false);
      
      // Refresh posts - ensure callback is called and awaited
      if (onPostCreated) {
        await onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm mb-6">
      {/* Top Row: Avatar + Input Field */}
      <div className="flex items-center gap-3 mb-4">
        {/* Avatar - Shows user avatar or anonymous icon */}
        {isAnonymous ? (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-gray-500" />
          </div>
        ) : (
          <img
            src={userAvatar}
            alt="Your avatar"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=User&background=random&size=40`;
            }}
          />
        )}
        
        {/* Input Field - Collapsed or Expanded */}
        {!isExpanded ? (
          <input
            type="text"
            placeholder="Add a note..."
            onClick={() => setIsExpanded(true)}
            className="w-full bg-gray-50 rounded-full px-4 py-2 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-text"
            readOnly
          />
        ) : (
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
            rows={4}
            autoFocus
          />
        )}
      </div>

      {/* Bottom Row: Actions (only shown when expanded) */}
      {isExpanded && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Left: Anonymous Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black focus:ring-offset-0"
            />
            <span className="text-sm text-gray-600">
              🕵️ Go Anonymous
            </span>
          </label>

          {/* Right: Post Button */}
          <button
            onClick={handlePost}
            disabled={!postContent.trim() || isPosting}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 ${
              postContent.trim() && !isPosting
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isPosting ? 'Posting...' : 'Post'}
          </button>
        </div>
      )}
    </div>
  );
}

function GroupDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isJoined, setIsJoined] = useState(false);
  const [activeTab, setActiveTab] = useState('Events');
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [discussionPosts, setDiscussionPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showAddMediaModal, setShowAddMediaModal] = useState(false);
  const [joinedEventIds, setJoinedEventIds] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsLoading, setEventsLoading] = useState(false);

  // Fetch community data from Supabase
  useEffect(() => {
    if (id) {
      fetchCommunityData();
    }
  }, [id, user?.id]);

  const fetchCommunityData = async () => {
    try {
      setLoading(true);

      // Fetch community
      const { data: community, error: communityError } = await supabase
        .from('communities')
        .select('*')
        .eq('id', id)
        .single();

      if (communityError) throw communityError;
      if (!community) {
        toast.error('Community not found');
        navigate('/community');
        return;
      }

      // Fetch host profile
      const { data: hostProfile } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', community.host_user_id)
        .single();

      // Fetch member count
      const { count: memberCount } = await supabase
        .from('community_members')
        .select('*', { count: 'exact', head: true })
        .eq('community_id', id);

      // Fetch events this week
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const { count: eventsThisWeek } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('community_id', id)
        .gte('start_date', startOfWeek.toISOString().split('T')[0]);

      // Check if user is a member
      if (user) {
        const { data: memberCheck } = await supabase
          .from('community_members')
          .select('*')
          .eq('community_id', id)
          .eq('user_id', user.id)
          .single();
        setIsJoined(!!memberCheck);
      }

      // Set group data
      setGroupData({
        id: community.id,
        name: community.name,
        description: community.short_description || '',
        coverImage: community.banner_image_url,
        logo: hostProfile?.avatar_url || 'https://i.pravatar.cc/150?img=15',
        memberCount: memberCount || 0,
        eventsThisWeek: eventsThisWeek || 0,
        isPublic: true,
        location: 'Charleston, SC', // You can add location to communities table if needed
        organizer: {
          name: hostProfile?.username || 'Unknown',
          avatar: hostProfile?.avatar_url || 'https://i.pravatar.cc/150?img=15',
        },
        details: community.long_description || community.short_description || '', // Use long_description for details, fallback to short_description
        rules: [
          'Be respectful to all members',
          'No spam or self-promotion',
          'Keep discussions relevant',
          'Follow community guidelines',
        ],
      });

      // Fetch events
      await fetchEvents();
      // Fetch discussion posts
      await fetchDiscussionPosts();
      // Fetch members
      await fetchMembers();
      // Fetch media
      await fetchMedia();
    } catch (error) {
      console.error('Error fetching community:', error);
      toast.error('Failed to load community');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      
      // Verify communityId is defined
      if (!id) {
        console.error('fetchEvents: communityId is undefined or null');
        setUpcomingEvents([]);
        return;
      }

      // Fetch events and joined event IDs in parallel - using exact same logic as Explore page
      const [eventsResult, joinedIdsResult] = await Promise.all([
        supabase
          .from('events')
          .select('*')
          .eq('community_id', id) // CRITICAL: Filter by community_id
          .order('created_at', { ascending: false }), // Same ordering as Explore page
        user ? getJoinedEventIds() : Promise.resolve({ data: [], error: null })
      ]);

      const { data: eventsData, error: eventsError } = eventsResult;
      const { data: joinedIds, error: joinedError } = joinedIdsResult;

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        setUpcomingEvents([]);
        return;
      }

      if (joinedError) {
        console.error('Error fetching joined events:', joinedError);
      }

      // Create Set of joined event IDs for O(1) lookup
      const joinedSet = new Set(joinedIds || []);
      setJoinedEventIds(joinedSet);

      // Map snake_case to camelCase for EventCard component - EXACT same mapping as Explore page
      const mappedEvents = (eventsData || []).map((event) => {
        // Format time - combine start_time and end_time if both exist
        let timeDisplay = event.start_time || '';
        if (event.start_time && event.end_time) {
          // Format time from HH:MM to readable format
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

        return {
          id: event.id,
          title: event.title,
          description: event.description || '',
          // Date mapping - use start_date as date, and end_date if exists
          date: event.start_date,
          startDate: event.start_date,
          endDate: event.end_date || null,
          // Time mapping
          time: timeDisplay,
          startTime: event.start_time || null,
          endTime: event.end_time || null,
          // Image mapping
          image: event.image_url || null,
          imageUrl: event.image_url || null,
          // Location mapping
          location: event.is_online ? null : (event.address || null),
          meetingLink: event.is_online ? (event.location_link || null) : null,
          // URL mapping (for clickable links in EventCard)
          // For online events, location_link is the meeting link
          // For in-person events, we don't have a separate URL field
          url: event.location_link || null,
          website: event.location_link || null,
          // Category and other fields
          category: event.category || 'Social Activities',
          tags: event.tags || [],
          isOnline: event.is_online || false,
          // Recurring event fields
          is_recurring: event.is_recurring || false,
          isRecurring: event.is_recurring || false,
          recurring_days: event.recurring_days || null,
          recurringDays: event.recurring_days || null,
          // Keep original data for reference
          ...event,
        };
      });

      setUpcomingEvents(mappedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
      setUpcomingEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchDiscussionPosts = async () => {
    try {
      // Fetch posts first
      const { data: postsData, error: postsError } = await supabase
        .from('discussion_posts')
        .select('*')
        .eq('community_id', id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (postsError) throw postsError;

      // Fetch profiles for each post
      const postsWithProfiles = await Promise.all(
        (postsData || []).map(async (post) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', post.user_id)
            .single();

          return {
            ...post,
            profiles: profile || {},
          };
        })
      );

      // Transform posts
      const transformedPosts = postsWithProfiles.map((post) => {
        const profile = post.profiles || {};
        const createdAt = new Date(post.created_at);
        const now = new Date();
        const diffMs = now - createdAt;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        let timestamp = 'just now';
        if (diffMins > 0 && diffMins < 60) {
          timestamp = `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
        } else if (diffHours > 0 && diffHours < 24) {
          timestamp = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        } else if (diffDays > 0) {
          timestamp = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
        }

        return {
          id: post.id,
          author: profile.username || 'Anonymous',
          avatar: profile.avatar_url || 'https://i.pravatar.cc/150?img=10',
          content: post.content,
          timestamp: timestamp,
        };
      });

      setDiscussionPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching discussion posts:', error);
      toast.error('Failed to load discussion posts');
    }
  };

  const fetchMembers = async () => {
    try {
      const { data: memberData, error } = await supabase
        .from('community_members')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('community_id', id)
        .limit(50);

      if (error) throw error;

      // Transform members
      const transformedMembers = (memberData || [])
        .map((member) => {
          const profile = member.profiles || {};
          return {
            name: profile.username || 'Unknown',
            avatar: profile.avatar_url || 'https://i.pravatar.cc/150?img=10',
            role: member.role,
          };
        })
        .filter((member) => member.name !== 'Unknown');

      setMembers(transformedMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchMedia = async () => {
    try {
      const { data: media, error } = await supabase
        .from('community_media')
        .select('*')
        .eq('community_id', id)
        .order('uploaded_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const imageUrls = (media || []).map((item) => item.image_url).filter(Boolean);
      setMediaItems(imageUrls);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleInterested = (event) => {
    console.log(`Interested in event: ${event.title}`);
  };

  const handleBoost = (event) => {
    console.log(`Boosted event: ${event.title}`);
  };

  const handleJoinLeave = async () => {
    if (!user) {
      toast.error('Please sign in to join communities');
      return;
    }

    try {
      if (isJoined) {
        // Leave community
        const { error } = await supabase
          .from('community_members')
          .delete()
          .eq('community_id', id)
          .eq('user_id', user.id);

        if (error) throw error;
        setIsJoined(false);
        toast.success('Left community');
        await fetchMembers(); // Refresh member list
      } else {
        // Join community
        const { error } = await supabase
          .from('community_members')
          .insert([
            {
              community_id: id,
              user_id: user.id,
              role: 'member',
            },
          ]);

        if (error) throw error;
        setIsJoined(true);
        toast.success('Joined community!');
        await fetchMembers(); // Refresh member list
      }
    } catch (error) {
      console.error('Error joining/leaving community:', error);
      toast.error('Failed to update membership');
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen pt-32 flex items-center justify-center">
        <p className="text-gray-500">Loading community...</p>
      </div>
    );
  }

  if (!groupData) {
    return (
      <div className="bg-white min-h-screen pt-32 flex items-center justify-center">
        <p className="text-gray-500">Community not found</p>
      </div>
    );
  }

  const formatMemberCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const tabs = [
    // { id: 'Discussion', label: 'Discussion', icon: MessageSquare }, // Hidden for MVP
    { id: 'Events', label: 'Events', icon: Calendar },
    // { id: 'Members', label: 'Members', icon: Users }, // Hidden for MVP
    { id: 'Media', label: 'Media', icon: ImageIcon },
  ];

  return (
    <div className="bg-white min-h-screen pt-32">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/community"
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-widest hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Explore
        </Link>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Title & Description */}
          <div>
            <h1 className="text-5xl font-serif font-bold text-gray-900 tracking-tight mb-4">
              {groupData.name}
            </h1>
            
            {/* Hosted By Section */}
            <div className="flex items-center gap-2 mb-6">
              <img
                src={groupData.organizer.avatar}
                alt={groupData.organizer.name}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(groupData.organizer.name)}&background=random&size=32`;
                }}
              />
              <span className="text-sm text-gray-600">
                Hosted by <span className="font-medium text-gray-900">{groupData.organizer.name}</span>
              </span>
            </div>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {groupData.description}
            </p>
            <button
              onClick={handleJoinLeave}
              disabled={!user}
              className={`rounded-full border px-8 py-3 text-sm font-medium transition-all duration-200 ${
                isJoined
                  ? 'border-gray-300 text-gray-700 bg-white'
                  : 'border-black text-black hover:bg-black hover:text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {!user ? 'Sign in to join' : isJoined ? 'Member' : 'Join Group'}
            </button>
          </div>

          {/* Right Column - Cover Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
              {groupData.coverImage ? (
                <img
                  src={groupData.coverImage}
                  alt={groupData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.className += ' bg-gradient-to-br from-gray-300 to-gray-400';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">No picture for now</span>
                </div>
              )}
            </div>
            {/* Logo overlay */}
            <div className="absolute -bottom-8 left-8">
              <img
                src={groupData.logo}
                alt={groupData.name}
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(groupData.name)}&background=random&size=80`;
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <span className="font-medium">{formatMemberCount(groupData.memberCount)} Members</span>
            <span className="text-gray-300">•</span>
            <span className="font-medium">{groupData.eventsThisWeek} Events this week</span>
            <span className="text-gray-300">•</span>
            <span className="font-medium">{groupData.isPublic ? 'Public' : 'Private'} Group</span>
          </div>
        </div>
      </div>

      {/* Sticky Tab Bar */}
      <div className="sticky top-16 bg-white border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Column (Left, 66%) - Tab Dependent Content */}
          <div className="lg:col-span-2">
            {activeTab === 'Discussion' && (
              <div className="space-y-6">
                {/* Create Post Widget */}
                <CreatePostWidget 
                  communityId={id} 
                  userAvatar={user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/150?img=10'}
                  onPostCreated={fetchDiscussionPosts}
                />
                
                {/* Existing Posts or Placeholder */}
                {discussionPosts.length > 0 ? (
                  discussionPosts.map((post) => (
                    <div key={post.id} className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={post.avatar}
                          alt={post.author}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=random&size=40`;
                          }}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{post.author}</p>
                          <p className="text-xs text-gray-500">{post.timestamp}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{post.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-gray-100 rounded-lg p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium mb-2">No discussions yet</p>
                    <p className="text-gray-400 text-sm">Be the first to start a conversation!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Events' && (
              <div className="space-y-6">
                {/* Create Event Button */}
                {user && (
                  <button
                    onClick={() => setShowEventForm(true)}
                    className="w-full md:w-auto rounded-full bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Create Event
                  </button>
                )}
                
                {/* Events Grid - Same layout as Explore page */}
                {eventsLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                  </div>
                ) : upcomingEvents.length === 0 ? (
                  <div className="text-center py-20">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium mb-2">No events found</p>
                    <p className="text-gray-400 text-sm">Check back soon for new events!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {upcomingEvents.map((event) => {
                      const isJoined = joinedEventIds.has(event.id);
                      return (
                        <EventCard 
                          key={event.id || event.title}
                          event={event}
                          isJoined={isJoined}
                          onInterested={() => handleInterested(event)}
                          onBoost={() => handleBoost(event)}
                          onCardClick={() => handleCardClick(event)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Members' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {members.length > 0 ? (
                  members.map((member, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&size=48`;
                        }}
                      />
                      <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 bg-white border border-gray-100 rounded-lg p-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium mb-2">No members to display</p>
                    <p className="text-gray-400 text-sm">Member list will appear here once available.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Media' && (
              <div className="space-y-6">
                {/* Add Photos Button */}
                {user && (
                  <button
                    onClick={() => setShowAddMediaModal(true)}
                    className="w-full md:w-auto rounded-full bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Photos
                  </button>
                )}
                
                {/* Media Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mediaItems.length > 0 ? (
                    mediaItems.map((imageUrl, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                        <img
                          src={imageUrl}
                          alt={`Media ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.className += ' bg-gradient-to-br from-gray-300 to-gray-400';
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 bg-white border border-gray-100 rounded-lg p-12 text-center">
                      <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg font-medium mb-2">No media yet</p>
                      <p className="text-gray-400 text-sm">Photos and videos will appear here once shared.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (Right, 33%) - Sticky */}
          <div className="lg:sticky lg:top-32 lg:h-fit space-y-8">
            {/* Details Section */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Details</h3>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {groupData.details}
                </p>
              </div>
            </section>

            {/* Location */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Location</h3>
              <p className="text-gray-700">{groupData.location}</p>
              <div className="mt-4 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-sm text-gray-500">Map placeholder</span>
              </div>
            </section>

            {/* Group Rules */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Group Rules</h3>
              <ul className="space-y-3">
                {groupData.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <EventForm 
              onAddEvent={() => {
                fetchEvents();
                setShowEventForm(false);
                toast.success('Event created!');
              }} 
              onClose={() => setShowEventForm(false)}
              communityId={id}
            />
          </div>
        </div>
      )}

      {/* Add Media Modal */}
      <AddMediaModal
        isOpen={showAddMediaModal}
        onClose={() => setShowAddMediaModal(false)}
        communityId={id}
        onUploadSuccess={fetchMedia}
      />

      {/* Event Detail Modal */}
      <EventDetailModal 
        isOpen={isModalOpen}
        event={selectedEvent}
        onClose={handleCloseModal}
      />

      {/* Hide scrollbar styles */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default GroupDetail;

