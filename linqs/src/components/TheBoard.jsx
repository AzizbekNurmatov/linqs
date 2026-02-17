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

const DUMMY_FLASHES = [
  { activity: 'Study', location: 'Addie\'s', timeFrame: 'now' },
  { activity: 'Coffee', location: 'Library café', timeFrame: '1h' },
  { activity: 'Gym', location: 'Rec center', timeFrame: 'tonight' },
  { activity: 'Eat', location: 'Stern Center', timeFrame: 'now' },
];

const DUMMY_BARTERS = [
  { mode: 'goods', have: 'Textbook – Intro to Psych', want: 'Calculus textbook or $30' },
  { mode: 'favors', have: 'Proofreading essays', want: 'Ride to airport Friday' },
  { mode: 'goods', have: 'Mini fridge', want: 'Standing lamp' },
];

const DUMMY_BITES = [
  { biteKind: 'free', what: 'Pizza in the lounge', where: 'Main dorm lounge' },
  { biteKind: 'deal', what: '2-for-1 drinks', where: 'Downtown bar', endsAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().slice(0, 16) },
];

function generateDummyPosts() {
  const posts = [];
  const types = ['yap', 'flash', 'barter', 'bites'];
  for (let i = 0; i < 5; i++) {
    const kind = types[Math.floor(Math.random() * types.length)];
    const id = `${Date.now()}-${i}-${Math.random().toString(36).slice(2)}`;
    if (kind === 'yap') {
      posts.push({
        id,
        type: 'yap',
        content: DUMMY_YAPS[Math.floor(Math.random() * DUMMY_YAPS.length)],
        isAnonymous: Math.random() > 0.6,
      });
    } else if (kind === 'flash') {
      const f = DUMMY_FLASHES[Math.floor(Math.random() * DUMMY_FLASHES.length)];
      posts.push({
        id,
        type: 'flash',
        activity: f.activity,
        location: f.location,
        timeFrame: f.timeFrame,
      });
    } else if (kind === 'barter') {
      const b = DUMMY_BARTERS[Math.floor(Math.random() * DUMMY_BARTERS.length)];
      posts.push({
        id,
        type: 'barter',
        mode: b.mode,
        haveInput: b.have,
        wantInput: b.want,
      });
    } else {
      const b = DUMMY_BITES[Math.floor(Math.random() * DUMMY_BITES.length)];
      posts.push({
        id,
        type: 'bites',
        biteKind: b.biteKind,
        whatInput: b.what,
        whereInput: b.where,
        ...(b.endsAt && { endsAt: b.endsAt }),
      });
    }
  }
  return posts;
}

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

  const handleSimulateTraffic = () => {
    // Keep this for testing, but it won't persist to DB
    const dummy = generateDummyPosts();
    setPosts((prev) => [...dummy, ...prev]);
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

          <div className="mt-6 mb-4">
            <button
              type="button"
              onClick={handleSimulateTraffic}
              className="px-4 py-2 bg-black text-white text-sm font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              ⚡ Simulate Traffic
            </button>
          </div>
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
              No posts yet. Click a tile above to post, or use Simulate Traffic to fill the grid.
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
