import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Color palette for tags
const tagColors = [
  { border: 'border-orange-400', hash: 'text-orange-600' },
  { border: 'border-emerald-400', hash: 'text-emerald-600' },
  { border: 'border-purple-400', hash: 'text-purple-600' },
  { border: 'border-blue-400', hash: 'text-blue-600' },
  { border: 'border-rose-400', hash: 'text-rose-600' },
  { border: 'border-yellow-400', hash: 'text-yellow-600' },
  { border: 'border-teal-400', hash: 'text-teal-600' },
];

// Deterministic color assignment for tags
function getTagColor(tagString) {
  let hash = 0;
  for (let i = 0; i < tagString.length; i++) {
    const char = tagString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const index = Math.abs(hash) % tagColors.length;
  return tagColors[index];
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
    <section className="w-full py-16">
      {/* Community Ticker - Single Row */}
      <section className="w-full bg-[#FDFBF7] overflow-hidden py-8">
        <div className="flex w-max animate-infinite-scroll">
          {/* First group of tags */}
          <div className="flex shrink-0 gap-4">
            {tags.map((tag, index) => {
              const colorScheme = getTagColor(tag);
              return (
                <span
                  key={`tag-1-${index}`}
                  className={`px-6 py-2 rounded-full bg-white border ${colorScheme.border} font-mono text-sm font-medium tracking-wide uppercase text-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]`}
                >
                  <span className={colorScheme.hash}>#</span>
                  {tag.substring(1)}
                </span>
              );
            })}
          </div>
          {/* Second group of tags (duplicate for seamless loop) */}
          <div className="flex shrink-0 gap-4">
            {tags.map((tag, index) => {
              const colorScheme = getTagColor(tag);
              return (
                <span
                  key={`tag-2-${index}`}
                  className={`px-6 py-2 rounded-full bg-white border ${colorScheme.border} font-mono text-sm font-medium tracking-wide uppercase text-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]`}
                >
                  <span className={colorScheme.hash}>#</span>
                  {tag.substring(1)}
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
          <div className="md:col-span-2 bg-white rounded-3xl shadow-xl shadow-slate-200 overflow-hidden relative min-h-[400px] md:min-h-[500px]">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop)'
              }}
            >
              {/* Dark Overlay Gradient at Bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
            </div>
            
            {/* Editor's Pick Badge */}
            <div className="absolute top-6 left-6 z-10">
              <span className="bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-md">
                Editor's Pick
              </span>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
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
              <button className="bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors">
                View Details
              </button>
            </div>
          </div>

          {/* Trending Groups Sidebar (col-span-1) */}
          <div className="md:col-span-1 bg-white rounded-3xl border border-stone-200 shadow-xl shadow-slate-200 p-6 md:p-8 flex flex-col min-h-[400px] md:min-h-[500px]">
            {/* Header */}
            <h3 className="font-serif font-bold text-2xl text-[#2D3436] mb-6">
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
                    className="flex items-center gap-3 py-2 hover:bg-stone-50 rounded-lg transition-colors"
                  >
                    {/* Group Avatar */}
                    <div className="flex-shrink-0">
                      <img
                        src={group.avatar}
                        alt={group.name}
                        className="w-12 h-12 rounded-full border-2 border-stone-200"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(group.name)}&background=random`;
                        }}
                      />
                    </div>
                    
                    {/* Group Name */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#2D3436] truncate">
                        {group.name}
                      </p>
                    </div>
                    
                    {/* View Button */}
                    <Link 
                      to={`/group/${group.id}`}
                      className="flex-shrink-0 text-sm text-stone-600 hover:text-stone-900 font-medium transition-colors"
                    >
                      View
                    </Link>
                  </div>
                ))
              )}
            </div>

            {/* Footer Link */}
            <div className="mt-6 pt-6 border-t border-stone-200">
              <Link 
                to="/community"
                className="text-sm text-stone-600 hover:text-stone-900 font-medium transition-colors"
              >
                View all groups →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesBentoGrid;

