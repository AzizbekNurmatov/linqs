import { useState } from 'react';

function HeroSection({ selectedCategories, onCategoryToggle, onCategoryClick }) {
  const [timeFilter, setTimeFilter] = useState('Tonight');

  return (
    <section className="bg-[#FDFBF7] max-w-7xl mx-auto px-6 pt-32 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Typography & Action */}
        <div>
          {/* Headline */}
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-gray-900 leading-tight tracking-tight">
            The city is <span className="italic">open</span>.
          </h1>
          
          {/* Subtext */}
          <p className="text-sm md:text-base font-mono text-gray-500 mt-6 max-w-md">
            Curated micro-communities and underground events for the curious.
          </p>
          
          {/* Segmented Control */}
          <div className="inline-flex bg-gray-100 p-1 rounded-lg mt-8">
            <button
              onClick={() => setTimeFilter('Tonight')}
              className={`px-6 py-2 text-sm font-medium transition-all duration-200 ${
                timeFilter === 'Tonight'
                  ? 'bg-white shadow-sm text-black rounded-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tonight
            </button>
            <button
              onClick={() => setTimeFilter('This Weekend')}
              className={`px-6 py-2 text-sm font-medium transition-all duration-200 ${
                timeFilter === 'This Weekend'
                  ? 'bg-white shadow-sm text-black rounded-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              This Weekend
            </button>
          </div>
        </div>

        {/* Right Column: Polaroid Stack */}
        <div className="relative w-full h-[500px] flex items-center justify-center">
          {/* Base Image (Back) - Rotated -6deg */}
          <div 
            className="w-64 h-80 bg-gray-300 border-4 border-white shadow-xl absolute top-0 right-20 z-0"
            style={{ transform: 'rotate(-6deg)' }}
          >
            <img 
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=400&fit=crop"
              alt="Event"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Middle Image - Rotated 3deg */}
          <div 
            className="w-64 h-80 bg-gray-400 border-4 border-white shadow-xl absolute top-10 right-10 z-10"
            style={{ transform: 'rotate(3deg)' }}
          >
            <img 
              src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=400&fit=crop"
              alt="Event"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Hero Image (Front) - No rotation */}
          <div className="w-72 h-96 bg-gray-800 border-8 border-white shadow-2xl relative z-20 flex flex-col">
            <div className="flex-1 relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=500&fit=crop"
                alt="Underground Jazz"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              {/* Badge: Happening Now */}
              <div className="absolute top-4 right-4 bg-white text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
                Happening Now
              </div>
            </div>
            {/* Overlay text */}
            <div className="p-4 bg-white">
              <h3 className="font-serif text-xl font-bold text-gray-900">Underground Jazz</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
