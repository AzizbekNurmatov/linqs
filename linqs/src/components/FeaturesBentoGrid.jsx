import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Neon color palette for brutalist tags
const neonColors = ['bg-yellow-400', 'bg-cyan-400', 'bg-pink-400', 'bg-lime-400'];

// Deterministic color assignment for tags
function getTagColor(tagString) {
  let hash = 0;
  for (let i = 0; i < tagString.length; i++) {
    const char = tagString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const index = Math.abs(hash) % neonColors.length;
  return neonColors[index];
}

function FeaturesBentoGrid() {
  const [trendingGroups, setTrendingGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tags for the ticker - extended list
  const tags = ['#NightLife', '#TechTalks', '#Campus', '#RunClub', '#Art', '#Foodies', '#StudyGroup', '#LiveMusic', '#Workshops', '#Gaming', '#Startups', '#Volunteering', '#Design', '#Yoga'];

  // Fetch trending communities from Supabase
  useEffect(() => {
    const fetchTrendingGroups = async () => {
      try {
        setLoading(true);
        // Fetch communities, limit to 4
        const { data: communities, error } = await supabase
          .from('communities')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) throw error;

        // Transform communities to match component structure
        const transformedGroups = await Promise.all(
          (communities || []).map(async (community) => {
            // Get host profile for avatar
            const { data: hostProfile } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', community.host_user_id)
              .single();

            return {
              id: community.id,
              name: community.name,
              avatar: hostProfile?.avatar_url || 'https://i.pravatar.cc/150?img=15',
            };
          })
        );

        setTrendingGroups(transformedGroups);
      } catch (error) {
        console.error('Error fetching trending groups:', error);
        setTrendingGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingGroups();
  }, []);

  return (
    <section className="w-full pt-8 pb-16">
      {/* Community Ticker - Neo-Brutalist Infinite Marquee */}
      <section className="w-full bg-white overflow-hidden pt-6 pb-6 mb-6 border-b-4 border-black">
        <div className="marquee-container">
          <div className="marquee-content">
            {/* Duplicate tags multiple times for seamless infinite loop */}
            {[...tags, ...tags, ...tags].map((tag, index) => {
              const bgColor = getTagColor(tag);
              const tagText = tag.startsWith('#') ? tag : `#${tag}`;
              
              return (
                <span
                  key={`tag-${index}`}
                  className={`${bgColor} border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-2 mx-4 font-black uppercase text-black whitespace-nowrap transition-all duration-200 marquee-tag`}
                >
                  {tagText.toUpperCase()}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          {/* Featured Event Card - Main Card (col-span-2) */}
          <div className="md:col-span-2 bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative min-h-[400px] md:min-h-[500px] p-4">
            {/* Background Image */}
            <div 
              className="absolute inset-4 bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop)'
              }}
            >
              {/* Dark Overlay Gradient at Bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
            </div>
            
            {/* Editor's Pick Badge - Sticker Style */}
            <div className="absolute top-10 left-10 z-10">
              <span className="bg-[#FEF08A] border-2 border-black text-black text-xs font-black uppercase px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Editor's Pick
              </span>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-4 left-4 right-4 p-8 z-10">
              <h2 className="font-serif text-white font-bold text-4xl md:text-5xl mb-4">
                Underground Vinyl Market
              </h2>
              <div className="space-y-2 mb-6">
                <p className="font-mono text-white/90 text-sm md:text-base">
                  Sat, Oct 14 • 2pm
                </p>
                <p className="font-mono text-white/90 text-sm md:text-base">
                  Brooklyn Flea Market, Williamsburg
                </p>
              </div>
              <button className="bg-white border-2 border-black text-black font-black uppercase px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200">
                View Details
              </button>
            </div>
          </div>

          {/* Trending Groups Sidebar (col-span-1) */}
          <div className="md:col-span-1 bg-white border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 flex flex-col min-h-[400px] md:min-h-[500px]">
            {/* Header */}
            <h3 className="font-serif font-bold text-2xl text-black mb-4 pb-4 border-b-2 border-black">
              Trending Groups
            </h3>

            {/* Groups List */}
            <div className="flex-1 space-y-4">
              {loading ? (
                <div className="text-center py-4">
                  <p className="text-sm text-stone-600">Loading groups...</p>
                </div>
              ) : trendingGroups.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-stone-600">No groups available</p>
                </div>
              ) : (
                trendingGroups.map((group) => (
                  <div 
                    key={group.id}
                    className="flex items-center gap-3 py-2"
                  >
                    {/* Group Avatar */}
                    <div className="flex-shrink-0">
                      <img
                        src={group.avatar}
                        alt={group.name}
                        className="w-12 h-12 border-2 border-black object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(group.name)}&background=random`;
                        }}
                      />
                    </div>
                    
                    {/* Group Name */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-black truncate">
                        {group.name}
                      </p>
                    </div>
                    
                    {/* View Button - Pill */}
                    <Link 
                      to={`/group/${group.id}`}
                      className="flex-shrink-0 bg-white border-2 border-black px-3 py-1 text-xs font-black uppercase text-black hover:bg-yellow-300 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                ))
              )}
            </div>

            {/* Footer Link */}
            <div className="mt-6 pt-6 border-t-2 border-black">
              <Link 
                to="/community"
                className="block w-full text-center bg-white border-2 border-black px-4 py-2 text-sm font-black uppercase text-black hover:bg-pink-300 transition-colors"
              >
                View all groups →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Animation Styles */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .marquee-container {
          overflow: hidden;
          position: relative;
        }
        
        .marquee-content {
          display: flex;
          animation: marquee 40s linear infinite;
          width: fit-content;
        }
        
        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }
        
        .marquee-tag:hover {
          transform: translateY(1px);
          box-shadow: none !important;
        }
      `}</style>
    </section>
  );
}

export default FeaturesBentoGrid;

