import { useState, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import GiantReceipt from './GiantReceipt';

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
    <section className="bg-white relative overflow-hidden border-b-4 border-black hero-graph-paper">
      {/* Graph Paper Grid Pattern Background - Full Width */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />
      
      {/* Content Container - Constrained Width */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Typography & Social Proof */}
        <div className="space-y-6">
          {/* Location Badge */}
          <div className="mb-2">
            <div className="relative inline-block">
              <button
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="bg-black text-white px-3 py-1.5 text-xs font-black uppercase border-2 border-black hover:bg-white hover:text-black transition-colors flex items-center gap-2"
              >
                <MapPin className="w-3 h-3" />
                <span>{currentCity} IS BUZZING TONIGHT</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showCityDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] py-2 min-w-[180px] z-20">
                  <div className="px-4 py-2 text-xs font-mono uppercase text-black border-b-2 border-black">
                    Coming soon to more cities
                  </div>
                  <div className="px-4 py-2 text-sm font-mono text-black">
                    Charleston (Current)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-7xl md:text-8xl font-black text-black leading-none tracking-tighter uppercase animate-fade-in">
            THE CITY IS OPEN
          </h1>
          
          {/* Dynamic Subheadline */}
          <p className="text-lg md:text-xl font-mono text-black max-w-lg leading-tight animate-fade-in-delay">
            Live events, scenes, and underground plans happening near you — updated in real time.
          </p>
          
          {/* System Alert Cards */}
          <div className="flex flex-wrap items-center gap-4 mt-6 animate-fade-in-delay-2">
            <div className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-xl">🔥</span>
              <span className="text-sm font-black text-black uppercase">
                <span className="tabular-nums font-mono">{countUpValues.events}</span> EVENTS TONIGHT
              </span>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-xl">👀</span>
              <span className="text-sm font-black text-black uppercase">
                <span className="tabular-nums font-mono">{countUpValues.people}</span> PEOPLE BROWSING
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Giant Receipt */}
        <div className="relative w-full flex items-center justify-center">
          <GiantReceipt />
        </div>
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
