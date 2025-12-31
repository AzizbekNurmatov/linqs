import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, MessageSquare, Image as ImageIcon, User } from 'lucide-react';
import EventCard from '../components/EventCard';

// CreatePostWidget Component
function CreatePostWidget({ userAvatar = 'https://i.pravatar.cc/150?img=10' }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [postContent, setPostContent] = useState('');

  const handlePost = () => {
    if (postContent.trim()) {
      // TODO: Handle post submission
      console.log('Posting:', { content: postContent, isAnonymous });
      setPostContent('');
      setIsExpanded(false);
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
            disabled={!postContent.trim()}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 ${
              postContent.trim()
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Post
          </button>
        </div>
      )}
    </div>
  );
}

function GroupDetail() {
  const [isJoined, setIsJoined] = useState(false);
  const [activeTab, setActiveTab] = useState('Events');

  // Hardcoded data for NYC Hikers
  const groupData = {
    id: 1,
    name: 'NYC Hikers',
    description: 'Exploring trails around New York City and beyond. Weekly hikes, camping trips, and outdoor adventures for all skill levels. Join us for breathtaking views, great company, and unforgettable memories in nature.',
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop',
    logo: 'https://i.pravatar.cc/150?img=15',
    memberCount: 3400,
    eventsThisWeek: 5,
    isPublic: true,
    location: 'New York, NY',
    organizer: {
      name: 'Sarah Chen',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    organizers: [
      { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?img=4' },
      { name: 'Mike Rodriguez', avatar: 'https://i.pravatar.cc/150?img=5' },
      { name: 'Emma Thompson', avatar: 'https://i.pravatar.cc/150?img=6' },
    ],
    membersYouKnow: [
      { name: 'Alex', avatar: 'https://i.pravatar.cc/150?img=1' },
      { name: 'Jordan', avatar: 'https://i.pravatar.cc/150?img=2' },
      { name: 'Casey', avatar: 'https://i.pravatar.cc/150?img=3' },
    ],
    rules: [
      'Be respectful to all members and the environment',
      'Come prepared with appropriate gear and water',
      'Follow Leave No Trace principles',
      'Communicate if you need to cancel last minute',
    ],
  };

  // Dummy upcoming events for this group
  const upcomingEvents = [
    {
      title: 'Sunrise Hike at Bear Mountain',
      description: 'Early morning hike to catch the sunrise. Moderate difficulty, 4 miles round trip.',
      location: 'Bear Mountain State Park',
      date: 'January 15, 2024',
      time: '5:30 AM',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    },
    {
      title: 'Weekend Camping Trip',
      description: 'Two-day camping adventure in the Catskills. All experience levels welcome.',
      location: 'Catskill Mountains',
      date: 'January 20, 2024',
      time: '10:00 AM',
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop',
    },
  ];

  // Dummy discussion posts
  const discussionPosts = [
    {
      id: 1,
      author: 'Mike Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=5',
      content: 'Just completed the Breakneck Ridge trail yesterday! Amazing views. Who\'s up for doing it again next weekend?',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      author: 'Emma Thompson',
      avatar: 'https://i.pravatar.cc/150?img=6',
      content: 'Sharing some photos from last week\'s hike. The fall colors are absolutely stunning right now!',
      timestamp: '5 hours ago',
    },
  ];

  // Dummy members list
  const members = [
    { name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Jordan Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Casey Brown', avatar: 'https://i.pravatar.cc/150?img=3' },
    { name: 'Taylor Davis', avatar: 'https://i.pravatar.cc/150?img=7' },
    { name: 'Morgan Wilson', avatar: 'https://i.pravatar.cc/150?img=8' },
    { name: 'Riley Martinez', avatar: 'https://i.pravatar.cc/150?img=9' },
  ];

  // Dummy media items
  const mediaItems = [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1511497584788-876760111969?w=400&h=300&fit=crop',
  ];

  const formatMemberCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const tabs = [
    { id: 'Discussion', label: 'Discussion', icon: MessageSquare },
    { id: 'Events', label: 'Events', icon: Calendar },
    { id: 'Members', label: 'Members', icon: Users },
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
              onClick={() => setIsJoined(!isJoined)}
              className={`rounded-full border px-8 py-3 text-sm font-medium transition-all duration-200 ${
                isJoined
                  ? 'border-gray-300 text-gray-700 bg-white'
                  : 'border-black text-black hover:bg-black hover:text-white'
              }`}
            >
              {isJoined ? 'Member' : 'Join Group'}
            </button>
          </div>

          {/* Right Column - Cover Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
              <img
                src={groupData.coverImage}
                alt={groupData.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.className += ' bg-gradient-to-br from-gray-300 to-gray-400';
                }}
              />
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
                <CreatePostWidget />
                
                {/* Existing Posts */}
                {discussionPosts.map((post) => (
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
                ))}
              </div>
            )}

            {activeTab === 'Events' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingEvents.map((event, index) => (
                  <EventCard
                    key={index}
                    event={event}
                    onInterested={() => {}}
                    onBoost={() => {}}
                    onCardClick={() => {}}
                  />
                ))}
              </div>
            )}

            {activeTab === 'Members' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {members.map((member, index) => (
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
                ))}
              </div>
            )}

            {activeTab === 'Media' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mediaItems.map((imageUrl, index) => (
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
                ))}
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
                  NYC Hikers was founded in 2018 by a group of outdoor enthusiasts who wanted to make hiking more accessible to city dwellers. What started as a small group of friends exploring local trails has grown into a vibrant community of over 3,400 members.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We organize weekly hikes ranging from beginner-friendly city walks to challenging mountain treks. Our events are designed to accommodate all fitness levels, and we always prioritize safety and environmental responsibility.
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

