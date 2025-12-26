import { Link } from 'react-router-dom';
import { Music, Code, Utensils, Dumbbell, Palette, Moon } from 'lucide-react';

function Explore() {
  // Genre card data with image URLs
  const genreCards = [
    {
      id: 'featured',
      title: 'FEATURED',
      subtitle: 'Discover the most popular events',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
      icon: Music,
      link: null,
      isFeatured: true,
      gridClass: 'lg:col-span-2 lg:row-span-2',
      socialProof: '120+ going',
      hasLiveBadge: true,
    },
    {
      id: 'live-music',
      title: 'LIVE MUSIC',
      subtitle: 'Concerts and performances',
      imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop',
      icon: Music,
      link: '/explore/live-music',
      gridClass: 'lg:col-span-2',
      hasLiveBadge: true,
    },
    {
      id: 'tech',
      title: 'TECH',
      subtitle: 'Innovation & startups',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop',
      icon: Code,
      link: '/explore/tech',
      gridClass: '',
    },
    {
      id: 'food',
      title: 'FOOD',
      subtitle: 'Culinary experiences',
      imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop',
      icon: Utensils,
      link: '/explore/food',
      gridClass: '',
    },
    {
      id: 'sports',
      title: 'SPORTS',
      subtitle: 'Active events & fitness',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
      icon: Dumbbell,
      link: '/explore/sports',
      gridClass: 'lg:row-span-2',
    },
    {
      id: 'arts',
      title: 'ARTS',
      subtitle: 'Galleries, museums, exhibitions',
      imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=400&fit=crop',
      icon: Palette,
      link: '/explore/arts',
      gridClass: 'lg:col-span-2',
    },
    {
      id: 'nightlife',
      title: 'NIGHT',
      subtitle: 'Bars & clubs',
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&fit=crop',
      icon: Moon,
      link: '/explore/nightlife',
      gridClass: '',
    },
  ];

  return (
    <div className="pt-24 pb-16 px-6">
      <style>{`
        @keyframes pulse-dot {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
        .pulse-dot {
          animation: pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes glow-green {
          0%, 100% {
            box-shadow: 0 0 10px rgba(34, 197, 94, 0.5), 0 0 20px rgba(34, 197, 94, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.5);
          }
        }
        .live-pulse-badge {
          animation: glow-green 2s ease-in-out infinite;
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Explore Events</h1>
        
        {/* Bento Box Grid */}
        <div 
          className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          style={{
            gridAutoRows: '200px',
          }}
        >
          {genreCards.map((card) => {
            const IconComponent = card.icon;
            const CardContent = (
              <div 
                className="group relative rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 ease-out flex flex-col justify-end overflow-hidden cursor-pointer"
                style={{ minHeight: '200px' }}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${card.imageUrl})`,
                  }}
                />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40" />
                
                {/* Live Badge - Top Right */}
                {card.hasLiveBadge && (
                  <div className={`absolute top-4 right-4 flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 z-10 ${card.isFeatured ? 'live-pulse-badge' : ''}`}>
                    <div className={`w-2 h-2 rounded-full pulse-dot ${card.isFeatured ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-white text-xs font-semibold">Happening Now</span>
                  </div>
                )}
                
                {/* Icon Watermark - Bottom Right */}
                <IconComponent className="absolute bottom-4 right-4 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-white/20 -rotate-12 z-0" strokeWidth={1.5} />
                
                {/* Social Proof - Only for Featured */}
                {card.socialProof && (
                  <div className="flex items-center gap-3 mb-4 z-10 relative">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white"></div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 border-2 border-white"></div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-white"></div>
                    </div>
                    <span className="text-white/90 text-sm font-medium font-['Caveat']">{card.socialProof}</span>
                  </div>
                )}
                
                {/* Glassmorphism Label - Bottom Left */}
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 py-3 z-10 relative self-start">
                  <h3 className={`text-white font-bold leading-none ${
                    card.isFeatured 
                      ? "font-['Permanent Marker'] text-4xl md:text-6xl lg:text-8xl"
                      : card.title === 'LIVE MUSIC' || card.title === 'SPORTS'
                      ? "font-['Bangers'] text-3xl md:text-5xl lg:text-7xl"
                      : card.title === 'TECH'
                      ? "font-['Righteous'] text-3xl md:text-5xl lg:text-6xl"
                      : card.title === 'FOOD'
                      ? "font-['Caveat'] text-3xl md:text-5xl lg:text-6xl"
                      : card.title === 'ARTS'
                      ? "font-['Abril Fatface'] text-3xl md:text-5xl lg:text-7xl"
                      : "font-['Bangers'] text-3xl md:text-5xl lg:text-6xl"
                  }`}>
                    {card.title}
                  </h3>
                  {card.subtitle && (
                    <p className="text-white/90 text-xs md:text-sm font-['Caveat'] mt-1 md:mt-2">
                      {card.subtitle}
                    </p>
                  )}
                </div>
              </div>
            );

            return card.link ? (
              <Link key={card.id} to={card.link} className={`block ${card.gridClass}`}>
                {CardContent}
              </Link>
            ) : (
              <div key={card.id} className={card.gridClass}>
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Explore;

