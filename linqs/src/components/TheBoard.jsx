import { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import BoardFilters from './BoardFilters';
import YapCard from './YapCard';
import FlashCard from './FlashCard';
import BarterCard from './BarterCard';
import BiteCard from './BiteCard';
import { fetchAllPosts } from '../lib/boardService';

const MASONRY_BREAKPOINTS = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const DUMMY_YAPS = [
  'Anyone know where the best coffee on campus is?',
  'Study group for CS midterm tomorrow at the lib',
  'Free furniture near Stern – DM if you want it',
  'Who’s going to the game this weekend??',
];





function TheBoard() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch posts from Supabase on mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    const fetchedPosts = await fetchAllPosts();
    setPosts(fetchedPosts);
    setIsLoading(false);
  };

  const handleAddPost = (newPost) => {
    // This is called for backward compatibility, but we refresh from DB instead
    // The modal already saves to DB, so we just refresh
    loadPosts();
  };

  const handlePostCreated = () => {
    // Refresh posts after a new post is created
    loadPosts();
  };

  // Optimistic UI: Add temporary post immediately, then replace with real data
  const addOptimisticPost = (tempPost) => {
    setPosts((prev) => [tempPost, ...prev]);
    return tempPost.id; // Return temp ID for later replacement
  };

  const replaceOptimisticPost = (tempId, realPost) => {
    setPosts((prev) => 
      prev.map((post) => (post.id === tempId ? realPost : post))
    );
  };

  const removeOptimisticPost = (tempId) => {
    setPosts((prev) => prev.filter((post) => post.id !== tempId));
  };

  const renderCard = (post) => {
    switch (post.type) {
      case 'yap':
        return <YapCard key={post.id} post={post} />;
      case 'flash':
        return <FlashCard key={post.id} post={post} />;
      case 'barter':
        return <BarterCard key={post.id} post={post} />;
      case 'bites':
        return <BiteCard key={post.id} post={post} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#F6F7F8] pt-32 pb-16 min-h-screen">
      {/* Top Navigation - Centered and Constrained */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <BoardFilters 
            onAddPost={handleAddPost} 
            onPostCreated={handlePostCreated}
            onOptimisticPost={addOptimisticPost}
            onReplaceOptimisticPost={replaceOptimisticPost}
            onRemoveOptimisticPost={removeOptimisticPost}
          />
        </div>
      </div>

      {/* Masonry Grid - Full Width */}
      <div className="px-4 sm:px-6">
        {isLoading ? (
          <div className="max-w-7xl mx-auto">
            <p className="text-gray-500 font-medium py-8">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="max-w-7xl mx-auto">
            <p className="text-gray-500 font-medium py-8">
              No posts yet. Click a tile above to post.
            </p>
          </div>
        ) : (
          <Masonry
            breakpointCols={MASONRY_BREAKPOINTS}
            className="flex -ml-4 w-auto"
            columnClassName="pl-4 bg-clip-padding"
          >
            {posts.map((post) => (
              <div key={post.id} className="mb-4">
                {renderCard(post)}
              </div>
            ))}
          </Masonry>
        )}
      </div>
    </div>
  );
}

export default TheBoard;
