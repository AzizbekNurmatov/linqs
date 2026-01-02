import { useState, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

// Mock data for live activity (clearly labeled)
const MOCK_LIVE_DATA = {
  eventsTonight: 23,
  peopleBrowsing: 187,
  trendingCategory: 'Live Music'
};

function HeroSection({ selectedCategories, onCategoryToggle, onCategoryClick }) {
  const [currentCity] = useState('Charleston');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [countUpValues, setCountUpValues] = useState({
    events: 0,
    people: 0
  });

  // Count-up animation for live stats
  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const interval = duration / steps;
    
    const eventsStep = MOCK_LIVE_DATA.eventsTonight / steps;
    const peopleStep = MOCK_LIVE_DATA.peopleBrowsing / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setCountUpValues({
        events: Math.min(Math.floor(eventsStep * currentStep), MOCK_LIVE_DATA.eventsTonight),
        people: Math.min(Math.floor(peopleStep * currentStep), MOCK_LIVE_DATA.peopleBrowsing)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCountUpValues({
          events: MOCK_LIVE_DATA.eventsTonight,
          people: MOCK_LIVE_DATA.peopleBrowsing
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);


  return (
    <section className="bg-[#FDFBF7] max-w-7xl mx-auto px-6 pt-32 pb-20 relative overflow-hidden">
      {/* Subtle background gradient for visual energy */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-purple-50/20 pointer-events-none" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Column: Typography & Social Proof */}
        <div className="space-y-6">
          {/* Location Signal */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4" />
            <div className="relative">
              <button
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="flex items-center gap-1 hover:text-gray-900 transition-colors group"
              >
                <span className="font-medium">{currentCity} is buzzing tonight</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showCityDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[180px] z-20">
                  <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                    Coming soon to more cities
                  </div>
                  <div className="px-4 py-2 text-sm text-gray-400">
                    Charleston (Current)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-gray-900 leading-tight tracking-tight animate-fade-in">
            The city is <span className="italic">open</span>.
          </h1>
          
          {/* Dynamic Subheadline */}
          <p className="text-lg md:text-xl text-gray-700 max-w-lg leading-relaxed animate-fade-in-delay">
            Live events, scenes, and underground plans happening near you — updated in real time.
          </p>
          
          {/* Live Activity Snapshot */}
          <div className="flex flex-wrap items-center gap-4 mt-6 animate-fade-in-delay-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm">
              <span className="text-lg">🔥</span>
              <span className="text-sm font-semibold text-gray-900">
                <span className="tabular-nums">{countUpValues.events}</span> events happening tonight
              </span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm">
              <span className="text-lg">👀</span>
              <span className="text-sm font-semibold text-gray-900">
                <span className="tabular-nums">{countUpValues.people}</span> people browsing near you
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Film Strip with Enhanced Visual Energy */}
        <div className="relative w-full flex items-center justify-center group">
          {/* Subtle parallax effect container */}
          <div className="border-[12px] border-white shadow-2xl rotate-[-2deg] overflow-hidden rounded-lg transition-transform duration-700 group-hover:rotate-[-1deg] group-hover:shadow-3xl">
            <div className="flex gap-0">
              {/* Image 1 (Left) - Live Music */}
              <div className="w-[200px] aspect-[2/3] bg-gray-300 flex-shrink-0 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=450&fit=crop"
                  alt="Live Music Event"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.className += ' bg-gradient-to-br from-gray-400 to-gray-600';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Image 2 (Middle) - Food Scene */}
              <div className="w-[200px] aspect-[2/3] bg-gray-400 flex-shrink-0 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=450&fit=crop"
                  alt="Food Scene"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.className += ' bg-gradient-to-br from-gray-400 to-gray-600';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Image 3 (Right) - Nightlife */}
              <div className="w-[200px] aspect-[2/3] bg-gray-500 flex-shrink-0 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop"
                  alt="Nightlife Scene"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.className += ' bg-gradient-to-br from-gray-400 to-gray-600';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
          
          {/* Floating accent elements for visual energy */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-full blur-2xl animate-pulse-slow pointer-events-none" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* Custom animations via style tag */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.1s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 0.6s ease-out 0.2s both;
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
