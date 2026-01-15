import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Community() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [joinedGroups, setJoinedGroups] = useState(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    bannerImageUrl: '',
    communityName: '',
    shortDescription: '',
  });

  // Fetch communities from Supabase
  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match component structure
      const transformedGroups = await Promise.all(
        (data || []).map(async (community) => {
          // Get member count
          const { count: memberCount } = await supabase
            .from('community_members')
            .select('*', { count: 'exact', head: true })
            .eq('community_id', community.id);

          // Get events this week
          const startOfWeek = new Date();
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
          const { count: eventsThisWeek } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .eq('community_id', community.id)
            .gte('start_date', startOfWeek.toISOString().split('T')[0]);

          // Get host profile
          const { data: hostProfile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', community.host_user_id)
            .single();

          return {
            id: community.id,
            name: community.name,
            description: community.short_description || '',
            coverImage: community.banner_image_url,
            logo: hostProfile?.avatar_url || 'https://i.pravatar.cc/150?img=15',
            memberCount: memberCount || 0,
            isPublic: true, // Assuming all are public for now
            eventsThisWeek: eventsThisWeek || 0,
            memberAvatars: [], // Will be populated if needed
            friendsCount: 0,
            href: `/group/${community.id}`,
          };
        })
      );

      setGroups(transformedGroups);
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast.error('Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

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

  // Passion categories for the hero section with neon colors
  const passionCategories = [
    {
      id: 'adventurers',
      label: 'ADVENTURERS',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
      description: 'NATURE • HIKING • OUTDOOR',
      color: '#FFD700', // Neon Yellow
    },
    {
      id: 'creators',
      label: 'CREATORS',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop',
      description: 'ART • PHOTOGRAPHY • DESIGN',
      color: '#FF006E', // Hot Pink
    },
    {
      id: 'techies',
      label: 'TECHIES',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
      description: 'CODE • TECH • INNOVATION',
      color: '#0055FF', // Electric Blue
    },
    {
      id: 'socializers',
      label: 'SOCIALIZERS',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop',
      description: 'FOOD • MUSIC • EVENTS',
      color: '#00FF41', // Lime Green
    },
  ];

  // Filter groups based on selected category (mock implementation)
  const filteredGroups = selectedCategory
    ? groups.filter((group) => {
        // Mock filtering logic - you can enhance this later
        const groupName = group.name.toLowerCase();
        const groupDesc = group.description.toLowerCase();
        
        switch (selectedCategory) {
          case 'adventurers':
            return groupName.includes('hiker') || groupName.includes('outdoor') || groupDesc.includes('hike') || groupDesc.includes('trail');
          case 'creators':
            return groupName.includes('art') || groupName.includes('photo') || groupName.includes('design') || groupDesc.includes('creative');
          case 'techies':
            return groupName.includes('code') || groupName.includes('tech') || groupDesc.includes('developer') || groupDesc.includes('coding');
          case 'socializers':
            return groupName.includes('food') || groupName.includes('music') || groupName.includes('jazz') || groupDesc.includes('social');
          default:
            return true;
        }
      })
    : groups;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateCommunity = async () => {
    if (!user) {
      toast.error('Please sign in to create a community');
      return;
    }

    if (!formData.communityName.trim() || !formData.shortDescription.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsCreating(true);

    try {
      // Generate slug from name
      const slug = formData.communityName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Insert community
      const descriptionText = formData.shortDescription.trim();
      const { data: community, error: communityError } = await supabase
        .from('communities')
        .insert([
          {
            name: formData.communityName.trim(),
            slug: slug,
            short_description: descriptionText,
            long_description: descriptionText,
            banner_image_url: formData.bannerImageUrl.trim() || null,
            host_user_id: user.id,
          },
        ])
        .select()
        .single();

      if (communityError) throw communityError;

      // Insert current user as admin member
      const { error: memberError } = await supabase
        .from('community_members')
        .insert([
          {
            community_id: community.id,
            user_id: user.id,
            role: 'admin',
          },
        ]);

      if (memberError) throw memberError;

      toast.success('Community created successfully!');
      
      // Reset form and close modal
      setFormData({
        bannerImageUrl: '',
        communityName: '',
        shortDescription: '',
      });
      setIsCreateModalOpen(false);

      // Redirect to the new community page
      navigate(`/group/${community.id}`);
    } catch (error) {
      console.error('Error creating community:', error);
      toast.error(error.message || 'Failed to create community');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    // Reset form when closing
    setFormData({
      bannerImageUrl: '',
      communityName: '',
      shortDescription: '',
    });
  };

  return (
    <div className="bg-[#F6F7F8] pt-32 pb-16 min-h-screen">
      {/* Header Section - Passion Category Grid */}
      <div className="bg-white border-b border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Title and Create Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            {/* Left: Title and Subtitle */}
            <div>
              <h1 className="text-6xl md:text-8xl font-black text-black tracking-tight mb-4 uppercase relative inline-block">
                FIND YOUR CREW
                {/* Jagged underline SVG */}
                <svg 
                  className="absolute -bottom-2 left-0 w-full h-4"
                  viewBox="0 0 400 20"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0,15 L20,5 L40,15 L60,5 L80,15 L100,5 L120,15 L140,5 L160,15 L180,5 L200,15 L220,5 L240,15 L260,5 L280,15 L300,5 L320,15 L340,5 L360,15 L380,5 L400,15 L400,20 L0,20 Z"
                    fill="black"
                  />
                </svg>
              </h1>
              <p className="text-lg text-black font-bold uppercase mt-6">
                Discover groups or start your own.
              </p>
            </div>
            
            {/* Right: Create Community Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-black text-white px-6 py-3 text-sm font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all whitespace-nowrap"
            >
              + Create Community
            </button>
          </div>
          
          {/* Passion Category Trading Cards - Horizontal Scroll */}
          <div className="overflow-x-auto scrollbar-hide pb-4 -mx-4 sm:mx-0 px-4 sm:px-0">
            <div className="flex gap-6 min-w-max">
              {/* Cards */}
              {passionCategories.map((category, index) => (
                <button
                  key={`${category.id}-${index}`}
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                  className={`
                    relative aspect-[3/4] w-[280px] flex-shrink-0 overflow-hidden group
                    border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                    transition-all duration-200 ease-out
                    ${selectedCategory === category.id 
                      ? 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -translate-y-1' 
                      : 'hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1'
                    }
                  `}
                >
                  {/* Top 70% - Image with grayscale filter */}
                  <div 
                    className="relative h-[70%] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-300"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  
                  {/* Bottom 30% - Solid neon color background */}
                  <div 
                    className="h-[30%] flex flex-col items-center justify-center p-4"
                    style={{ backgroundColor: category.color }}
                  >
                    <h3 className="text-xl font-black text-black uppercase text-center mb-1 leading-tight">
                      {category.label}
                    </h3>
                    <p className="text-xs font-black text-black uppercase text-center leading-tight">
                      {category.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Clear Filter Button */}
          {selectedCategory && (
            <div className="text-center mt-6">
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-sm text-gray-500 hover:text-gray-900 underline transition-colors"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">

        {/* Groups Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading communities...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => {
            const isJoined = joinedGroups.has(group.id);
            
            return (
              <div
                key={group.id}
                className="bg-white rounded-lg overflow-hidden relative flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Cover Image - Linked */}
                <Link to={group.href || '#'} className="relative h-32 w-full bg-gray-200 cursor-pointer">
                  <img
                    src={group.coverImage}
                    alt={group.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.className += ' bg-gradient-to-br from-gray-300 to-gray-400';
                    }}
                  />
                </Link>

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
                  {/* Title - Linked */}
                  <Link to={group.href || '#'} className="cursor-pointer">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 text-center hover:text-gray-700 transition-colors">
                      {group.name}
                    </h3>
                  </Link>

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
        )}
      </div>

      {/* Create Community Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Start a New Community</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Banner Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image URL
                </label>
                <input
                  type="text"
                  value={formData.bannerImageUrl}
                  onChange={(e) => handleInputChange('bannerImageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                {/* Image Preview */}
                {formData.bannerImageUrl && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Preview:</p>
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={formData.bannerImageUrl}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.className += ' bg-gray-200';
                          e.target.parentElement.innerHTML += '<div class="flex items-center justify-center h-full text-gray-400 text-sm">Invalid image URL</div>';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Community Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Community Name
                </label>
                <input
                  type="text"
                  value={formData.communityName}
                  onChange={(e) => handleInputChange('communityName', e.target.value)}
                  placeholder="Enter community name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Short Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Short Description
                  </label>
                  <span className="text-xs text-gray-500">
                    {formData.shortDescription.length}/140
                  </span>
                </div>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => {
                    if (e.target.value.length <= 140) {
                      handleInputChange('shortDescription', e.target.value);
                    }
                  }}
                  placeholder="Describe your community in a few words..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCommunity}
                disabled={isCreating}
                className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create Community'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom styles for marquee and scrollbar */}
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

export default Community;
