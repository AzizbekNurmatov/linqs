// Deterministic color assignment for pastel tags
function getTagColor(tagString) {
  const colors = [
    'bg-indigo-100 text-indigo-700',
    'bg-rose-100 text-rose-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
  ];

  // Simple hash function for deterministic color assignment
  let hash = 0;
  for (let i = 0; i < tagString.length; i++) {
    const char = tagString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

function FeaturesBentoGrid() {
  // Tags for the ticker - extended list
  const tags = ['#NightLife', '#TechTalks', '#Campus', '#RunClub', '#Art', '#Foodies', '#StudyGroup', '#LiveMusic', '#Workshops', '#Gaming', '#Startups', '#Volunteering', '#Design', '#Yoga'];

  // Avatar URLs for the face pile
  const avatars = [
    'https://i.pravatar.cc/150?img=1',
    'https://i.pravatar.cc/150?img=2',
    'https://i.pravatar.cc/150?img=3',
    'https://i.pravatar.cc/150?img=4',
    'https://i.pravatar.cc/150?img=5',
  ];

  return (
    <section className="w-full py-16">
      {/* Community Ticker - Single Row */}
      <section className="w-full bg-white overflow-hidden py-8">
        <div className="flex w-max animate-infinite-scroll">
          {/* First group of tags */}
          <div className="flex shrink-0 gap-4">
            {tags.map((tag, index) => (
              <span
                key={`tag-1-${index}`}
                className={`px-6 py-2 rounded-full font-bold text-sm ${getTagColor(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
          {/* Second group of tags (duplicate for seamless loop) */}
          <div className="flex shrink-0 gap-4">
            {tags.map((tag, index) => (
              <span
                key={`tag-2-${index}`}
                className={`px-6 py-2 rounded-full font-bold text-sm ${getTagColor(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          {/* Card 1: Discover Locally - The Big One */}
          <div className="md:col-span-2 md:row-span-2 bg-white rounded-3xl shadow-xl shadow-slate-200 p-6 md:p-8 hover:scale-[1.02] transition-transform duration-300 ease-out overflow-hidden relative">
            <div className="relative h-full min-h-[300px] md:min-h-[400px]">
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden">
                {/* Map Grid Pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }}></div>
                
                {/* Pulsing Pins */}
                <div className="absolute top-1/4 left-1/4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                    <div className="relative w-4 h-4 bg-red-500 rounded-full"></div>
                  </div>
                </div>
                <div className="absolute top-1/2 right-1/3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }}></div>
                    <div className="relative w-4 h-4 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <div className="absolute bottom-1/3 left-1/2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" style={{ animationDelay: '1s' }}></div>
                    <div className="relative w-4 h-4 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="absolute top-1/3 right-1/4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-500 rounded-full animate-ping opacity-75" style={{ animationDelay: '1.5s' }}></div>
                    <div className="relative w-4 h-4 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl">
                <h3 className="text-white font-bold text-2xl mb-2">Discover Locally</h3>
                <p className="text-white/90 text-sm">See what's happening around you in real-time.</p>
              </div>
            </div>
          </div>

          {/* Card 2: Micro-Communities */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 p-6 md:p-8 hover:scale-[1.02] transition-transform duration-300 ease-out flex flex-col items-center justify-center min-h-[180px] md:min-h-[200px]">
            <div className="relative mb-6 h-16 w-full flex items-center justify-center">
              {/* Stacked Avatar Circles */}
              {avatars.map((avatar, index) => (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${(index - 2) * 24}px)`,
                    transform: 'translateX(-50%)',
                    zIndex: avatars.length - index,
                  }}
                >
                  <img
                    src={avatar}
                    alt={`Member ${index + 1}`}
                    className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=User${index + 1}&background=random`;
                    }}
                  />
                </div>
              ))}
            </div>
            <h3 className="font-bold text-xl text-[#2D3436] mb-2">Micro-Communities</h3>
            <p className="text-slate-600 text-sm text-center">Find your tribe.</p>
          </div>

          {/* Card 3: Instant Chat */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 p-6 md:p-8 hover:scale-[1.02] transition-transform duration-300 ease-out flex flex-col justify-center min-h-[180px] md:min-h-[200px] relative overflow-hidden">
            {/* Chat Bubbles */}
            <div className="space-y-4">
              {/* Incoming message */}
              <div className="flex items-start gap-2">
                <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[70%]">
                  <p className="text-sm text-slate-700">Hey! Are you going to the event tonight?</p>
                </div>
              </div>
              
              {/* Outgoing message */}
              <div className="flex items-start gap-2 justify-end">
                <div className="bg-gradient-to-r from-[#6C5CE7] to-[#FF7675] rounded-2xl rounded-tr-sm px-4 py-3 max-w-[70%]">
                  <p className="text-sm text-white">Yes! See you there 🎉</p>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="mt-6">
              <h3 className="font-bold text-xl text-[#2D3436] mb-2">Instant Chat</h3>
              <p className="text-slate-600 text-sm">Plan before you go.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesBentoGrid;

