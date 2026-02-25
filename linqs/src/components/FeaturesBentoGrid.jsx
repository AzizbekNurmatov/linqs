import { useState, useEffect } from 'react';
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
    let isMounted = true; // Cleanup flag
    
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
        
        // Only update state if component is still mounted
        if (!isMounted) return;

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

        if (isMounted) {
          setTrendingGroups(transformedGroups);
        }
      } catch (error) {
        console.error('Error fetching trending groups:', error);
        if (isMounted) setTrendingGroups([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTrendingGroups();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
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

