import { useState } from 'react';

function Community() {
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedGroups, setJoinedGroups] = useState(new Set());

  // Dummy groups data
  const groups = [
    {
      id: 1,
      name: 'Brooklyn Analog Photography',
      description: 'A community of film photography enthusiasts sharing techniques, organizing photo walks, and celebrating the art of analog photography.',
      coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=200&fit=crop',
      logo: 'https://i.pravatar.cc/150?img=12',
      memberCount: 1200,
      isPublic: true,
      eventsThisWeek: 3,
      memberAvatars: [
        'https://i.pravatar.cc/150?img=1',
        'https://i.pravatar.cc/150?img=2',
        'https://i.pravatar.cc/150?img=3',
      ],
      friendsCount: 12,
    },
    {
      id: 2,
      name: 'NYC Hikers',
      description: 'Exploring trails around New York City and beyond. Weekly hikes, camping trips, and outdoor adventures for all skill levels.',
      coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=200&fit=crop',
      logo: 'https://i.pravatar.cc/150?img=15',
      memberCount: 3400,
      isPublic: true,
      eventsThisWeek: 5,
      memberAvatars: [
        'https://i.pravatar.cc/150?img=4',
        'https://i.pravatar.cc/150?img=5',
        'https://i.pravatar.cc/150?img=6',
      ],
      friendsCount: 8,
    },
    {
      id: 3,
      name: 'Code & Coffee',
      description: 'Weekly coding sessions at local cafes. Bring your laptop, work on projects, and connect with fellow developers.',
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=200&fit=crop',
      logo: 'https://i.pravatar.cc/150?img=20',
      memberCount: 890,
      isPublic: true,
      eventsThisWeek: 2,
      memberAvatars: [
        'https://i.pravatar.cc/150?img=7',
        'https://i.pravatar.cc/150?img=8',
        'https://i.pravatar.cc/150?img=9',
      ],
      friendsCount: 15,
    },
    {
      id: 4,
      name: 'Vinyl Collectors',
      description: 'Record enthusiasts sharing finds, organizing listening parties, and exploring NYC\'s best record shops together.',
      coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=200&fit=crop',
      logo: 'https://i.pravatar.cc/150?img=25',
      memberCount: 650,
      isPublic: true,
      eventsThisWeek: 1,
      memberAvatars: [
        'https://i.pravatar.cc/150?img=10',
        'https://i.pravatar.cc/150?img=11',
        'https://i.pravatar.cc/150?img=12',
      ],
      friendsCount: 5,
    },
    {
      id: 5,
      name: 'Sunday Soccer',
      description: 'Casual pickup soccer games every Sunday morning. All skill levels welcome. Just bring your cleats and positive energy!',
      coverImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=200&fit=crop',
      logo: 'https://i.pravatar.cc/150?img=30',
      memberCount: 2100,
      isPublic: true,
      eventsThisWeek: 1,
      memberAvatars: [
        'https://i.pravatar.cc/150?img=13',
        'https://i.pravatar.cc/150?img=14',
        'https://i.pravatar.cc/150?img=15',
      ],
      friendsCount: 20,
    },
    {
      id: 6,
      name: 'Brooklyn Foodies',
      description: 'Discovering the best restaurants, food trucks, and hidden gems across Brooklyn. Monthly group dinners and food tours.',
      coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=200&fit=crop',
      logo: 'https://i.pravatar.cc/150?img=35',
      memberCount: 1800,
      isPublic: true,
      eventsThisWeek: 4,
      memberAvatars: [
        'https://i.pravatar.cc/150?img=16',
        'https://i.pravatar.cc/150?img=17',
        'https://i.pravatar.cc/150?img=18',
      ],
      friendsCount: 11,
    },
    {
      id: 7,
      name: 'Jazz Enthusiasts',
      description: 'Live jazz lovers meeting up for shows, jam sessions, and discussions about the history and future of jazz music.',
      coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=200&fit=crop',
      logo: 'https://i.pravatar.cc/150?img=40',
      memberCount: 950,
      isPublic: true,
      eventsThisWeek: 2,
      memberAvatars: [
        'https://i.pravatar.cc/150?img=19',
        'https://i.pravatar.cc/150?img=20',
        'https://i.pravatar.cc/150?img=21',
      ],
      friendsCount: 7,
    },
    {
      id: 8,
      name: 'Yoga & Mindfulness',
      description: 'Weekly yoga sessions in parks and studios. Focus on mindfulness, meditation, and building a supportive wellness community.',
      coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=200&fit=crop',
      logo: 'https://i.pravatar.cc/150?img=45',
      memberCount: 1400,
      isPublic: true,
      eventsThisWeek: 3,
      memberAvatars: [
        'https://i.pravatar.cc/150?img=22',
        'https://i.pravatar.cc/150?img=23',
        'https://i.pravatar.cc/150?img=24',
      ],
      friendsCount: 9,
    },
    {
      id: 9,
      name: 'Startup Founders',
      description: 'Networking and knowledge sharing for entrepreneurs. Monthly pitch nights, workshops, and founder dinners.',
      coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=200&fit=crop',
      logo: 'https://i.pravatar.cc/150?img=50',
      memberCount: 750,
      isPublic: false,
      eventsThisWeek: 2,
      memberAvatars: [
        'https://i.pravatar.cc/150?img=25',
        'https://i.pravatar.cc/150?img=26',
        'https://i.pravatar.cc/150?img=27',
      ],
      friendsCount: 6,
    },
  ];

  const handleJoinGroup = (groupId) => {
    setJoinedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const formatMemberCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const popularTopics = ['Hiking', 'Tech', 'Art', 'Food', 'Music', 'Fitness'];

  return (
    <div className="bg-[#F6F7F8] pt-32 pb-16 min-h-screen">
      {/* Header Section - Natural Language / Mad Libs Style */}
      <div className="bg-white border-b border-gray-200 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Headline */}
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-black tracking-tight mb-12">
            Find your <span className="text-blue-600">Tribe</span>
          </h1>
          
          {/* Mad Libs Search Input */}
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            <span className="font-serif text-gray-500 text-2xl md:text-3xl">I'm looking for a</span>
            <input
              type="text"
              placeholder="community"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-b-2 border-gray-300 focus:border-black outline-none text-center font-serif text-2xl md:text-3xl placeholder:text-gray-300 min-w-[200px] max-w-[300px] px-2"
            />
            <span className="font-serif text-gray-500 text-2xl md:text-3xl">community.</span>
          </div>

          {/* Trending Topics - Simple Text List */}
          <p className="text-sm text-gray-400">
            Trending:{' '}
            {popularTopics.map((topic, index) => (
              <span key={index}>
                <button
                  onClick={() => setSearchQuery(topic)}
                  className="font-semibold text-gray-600 hover:text-black hover:underline transition-colors"
                >
                  {topic}
                </button>
                {index < popularTopics.length - 1 && ', '}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => {
            const isJoined = joinedGroups.has(group.id);
            
            return (
              <div
                key={group.id}
                className="bg-white rounded-lg overflow-hidden relative flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Cover Image */}
                <div className="relative h-32 w-full bg-gray-200">
                  <img
                    src={group.coverImage}
                    alt={group.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.className += ' bg-gradient-to-br from-gray-300 to-gray-400';
                    }}
                  />
                </div>

                {/* Group Logo (Halfway Over Cover and Body) */}
                <div className="relative flex justify-center -mt-8 mb-4">
                  <img
                    src={group.logo}
                    alt={group.name}
                    className="w-16 h-16 rounded-full border-4 border-white object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(group.name)}&background=random&size=64`;
                    }}
                  />
                </div>

                {/* Content Body */}
                <div className="px-4 pb-4 flex-1 flex flex-col">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                    {group.name}
                  </h3>

                  {/* Meta Row */}
                  <p className="text-sm text-gray-500 mb-3 text-center">
                    {group.isPublic ? 'Public' : 'Private'} Group • {formatMemberCount(group.memberCount)} Members
                  </p>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
                    {group.description}
                  </p>

                  {/* Active Indicator */}
                  <div className="mb-3">
                    <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                      {group.eventsThisWeek} {group.eventsThisWeek === 1 ? 'event' : 'events'} this week
                    </span>
                  </div>

                  {/* Member Preview */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex -space-x-2">
                      {group.memberAvatars.map((avatar, index) => (
                        <img
                          key={index}
                          src={avatar}
                          alt={`Member ${index + 1}`}
                          className="w-6 h-6 rounded-full border-2 border-white"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=User${index + 1}&background=random&size=24`;
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      +{group.friendsCount} friends are members
                    </span>
                  </div>

                  {/* Join Button - Pill-shaped outline */}
                  <button
                    onClick={() => handleJoinGroup(group.id)}
                    className={`self-center rounded-full border px-6 py-2 text-sm font-medium transition-all duration-200 mb-2 ${
                      isJoined
                        ? 'bg-black text-white border-black'
                        : 'border-black text-black hover:bg-black hover:text-white'
                    }`}
                  >
                    {isJoined ? 'Joined' : 'Join Group'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Community;
