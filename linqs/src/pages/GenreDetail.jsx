import { useParams, Link } from 'react-router-dom';

// Genre configuration mapping
const genreConfig = {
  'live-music': {
    name: 'Live Music',
    gradient: 'from-rose-600 via-pink-600 to-orange-600',
    font: 'Bangers',
  },
  'tech': {
    name: 'Tech',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    font: 'Righteous',
  },
  'food': {
    name: 'Food',
    gradient: 'from-amber-600 via-orange-600 to-red-600',
    font: 'Caveat',
  },
  'sports': {
    name: 'Sports',
    gradient: 'from-blue-600 via-cyan-600 to-teal-600',
    font: 'Bangers',
  },
  'arts': {
    name: 'Arts & Culture',
    gradient: 'from-violet-600 via-indigo-600 to-purple-600',
    font: 'Abril Fatface',
  },
  'nightlife': {
    name: 'Nightlife',
    gradient: 'from-red-600 via-rose-600 to-pink-600',
    font: 'Bangers',
  },
};

function GenreDetail() {
  const { genre } = useParams();
  const config = genreConfig[genre] || {
    name: genre?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Genre',
    gradient: 'from-slate-600 via-slate-700 to-slate-800',
    font: 'Permanent Marker',
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.gradient} pt-24 pb-16 px-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 group transition-colors duration-200"
        >
          <span className="text-2xl group-hover:-translate-x-1 transition-transform duration-200">←</span>
          <span className="font-medium text-sm group-hover:underline">Back to Explore</span>
        </Link>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h2 
            className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight"
            style={{ 
              fontFamily: `'${config.font}', cursive`,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Nothing going on in {config.name} right now, but check back soon!
          </h2>
        </div>
      </div>
    </div>
  );
}

export default GenreDetail;

