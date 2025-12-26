import { useState } from 'react';

// Dummy posts data with different aspect ratios for masonry effect
const dummyPosts = [
  {
    id: 1,
    eventName: 'Tech Summit 2024',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=600&fit=crop',
    authorAvatar: 'https://i.pravatar.cc/150?img=12',
    authorName: 'Alex M.',
  },
  {
    id: 2,
    eventName: 'Summer Music Festival',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=400&fit=crop',
    authorAvatar: 'https://i.pravatar.cc/150?img=15',
    authorName: 'Sarah K.',
  },
  {
    id: 3,
    eventName: 'Art Gallery Opening',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop',
    authorAvatar: 'https://i.pravatar.cc/150?img=20',
    authorName: 'Emma T.',
  },
  {
    id: 4,
    eventName: 'Food & Wine Tasting',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=700&fit=crop',
    authorAvatar: 'https://i.pravatar.cc/150?img=25',
    authorName: 'Mike R.',
  },
  {
    id: 5,
    eventName: 'Yoga in the Park',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=450&fit=crop',
    authorAvatar: 'https://i.pravatar.cc/150?img=30',
    authorName: 'Lisa P.',
  },
  {
    id: 6,
    eventName: 'Nightlife Experience',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=550&fit=crop',
    authorAvatar: 'https://i.pravatar.cc/150?img=35',
    authorName: 'Chris L.',
  },
  {
    id: 7,
    eventName: 'Fitness Bootcamp',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
    authorAvatar: 'https://i.pravatar.cc/150?img=40',
    authorName: 'David K.',
  },
  {
    id: 8,
    eventName: 'Photography Workshop',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=480&fit=crop',
    authorAvatar: 'https://i.pravatar.cc/150?img=45',
    authorName: 'Rachel S.',
  },
  {
    id: 9,
    eventName: 'Comedy Night',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=650&fit=crop',
    authorAvatar: 'https://i.pravatar.cc/150?img=50',
    authorName: 'Tom H.',
  },
  {
    id: 10,
    eventName: 'Startup Networking',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=420&fit=crop',
    authorAvatar: 'https://i.pravatar.cc/150?img=55',
    authorName: 'Jessica W.',
  },
  {
    id: 11,
    eventName: 'Jazz Concert',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=580&fit=crop',
    authorAvatar: 'https://i.pravatar.cc/150?img=60',
    authorName: 'Marcus B.',
  },
  {
    id: 12,
    eventName: 'Street Art Tour',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=500&fit=crop',
    authorAvatar: 'https://i.pravatar.cc/150?img=65',
    authorName: 'Olivia M.',
  },
];

function Community() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Community Feed</h1>
        
        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {dummyPosts.map((post) => (
            <div
              key={post.id}
              className="break-inside-avoid mb-4 group cursor-pointer"
              onMouseEnter={() => setHoveredId(post.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300">
                {/* Image */}
                <img
                  src={post.imageUrl}
                  alt={post.eventName}
                  className={`w-full h-auto object-cover transition-all duration-300 ${
                    hoveredId === post.id ? 'brightness-90 scale-[1.02]' : ''
                  }`}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x600?text=Event+Image';
                  }}
                />
                
                {/* Bottom Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex items-center gap-2">
                    {/* User Avatar */}
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-6 h-6 rounded-full border-2 border-white/80"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${post.authorName}&background=random&size=64`;
                      }}
                    />
                    {/* Event Name */}
                    <span className="text-sm font-bold text-white truncate">
                      {post.eventName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Community;
