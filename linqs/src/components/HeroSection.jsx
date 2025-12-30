function HeroSection({ selectedCategories, onCategoryToggle, onCategoryClick }) {
  return (
    <section className="bg-[#FDFBF7] max-w-7xl mx-auto px-6 pt-32 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Typography & Social Proof */}
        <div>
          {/* Headline */}
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-gray-900 leading-tight tracking-tight">
            The city is <span className="italic">open</span>.
          </h1>
          
          {/* Subtext */}
          <p className="text-sm md:text-base font-mono text-gray-500 mt-6 max-w-md">
            Curated micro-communities and underground events for the curious.
          </p>
          
          {/* Live Activity Indicator */}
          <div className="flex items-center mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100 inline-flex">
            {/* Pulsing Status Dot */}
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-4"></div>
            
            {/* Avatar Stack */}
            <div className="flex -space-x-2 mr-4">
              <img 
                src="https://i.pravatar.cc/150?img=1"
                alt="User 1"
                className="w-8 h-8 rounded-full border-2 border-white"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=User1&background=random&size=32`;
                }}
              />
              <img 
                src="https://i.pravatar.cc/150?img=2"
                alt="User 2"
                className="w-8 h-8 rounded-full border-2 border-white"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=User2&background=random&size=32`;
                }}
              />
              <img 
                src="https://i.pravatar.cc/150?img=3"
                alt="User 3"
                className="w-8 h-8 rounded-full border-2 border-white"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=User3&background=random&size=32`;
                }}
              />
            </div>
            
            {/* Text */}
            <span className="text-sm text-gray-700 font-medium">
              <span className="font-semibold">420 people</span> are active across NYC right now.
            </span>
          </div>
        </div>

        {/* Right Column: Film Strip */}
        <div className="relative w-full flex items-center justify-center">
          <div className="border-[12px] border-white shadow-2xl rotate-[-2deg] overflow-hidden rounded-lg">
            <div className="flex gap-0">
              {/* Image 1 (Left) - DJ/Band */}
              <div className="w-[200px] aspect-[2/3] bg-gray-300 flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=450&fit=crop"
                  alt="DJ"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.className += ' bg-gradient-to-br from-gray-400 to-gray-600';
                  }}
                />
              </div>
              
              {/* Image 2 (Middle) - People at dinner */}
              <div className="w-[200px] aspect-[2/3] bg-gray-400 flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=450&fit=crop"
                  alt="Dinner"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.className += ' bg-gradient-to-br from-gray-400 to-gray-600';
                  }}
                />
              </div>
              
              {/* Image 3 (Right) - Night market */}
              <div className="w-[200px] aspect-[2/3] bg-gray-500 flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop"
                  alt="Night Market"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.className += ' bg-gradient-to-br from-gray-400 to-gray-600';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
