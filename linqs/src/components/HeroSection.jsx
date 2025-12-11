import { useRef, useEffect, useState } from 'react';

function HeroSection({ activeFilter, onFilterChange }) {
  const filters = ['All', 'Tech', 'Sports', 'Creative', 'Campus'];
  const [sliderStyle, setSliderStyle] = useState({});
  const buttonRefs = useRef({});
  const containerRef = useRef(null);

  useEffect(() => {
    const activeButton = buttonRefs.current[activeFilter];
    const container = containerRef.current;
    
    if (activeButton && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      
      setSliderStyle({
        left: `${buttonRect.left - containerRect.left}px`,
        width: `${buttonRect.width}px`,
        height: `${buttonRect.height}px`,
      });
    }
  }, [activeFilter]);

  // Sample event cards for the floating collage
  const floatingCards = [
    {
      title: "Music Festival",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=400&fit=crop",
      glow: "from-purple-500/20 to-pink-500/20",
      delay: "0s"
    },
    {
      title: "Art Gallery",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=400&fit=crop",
      glow: "from-blue-500/20 to-cyan-500/20",
      delay: "1s"
    },
    {
      title: "Food & Wine",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=400&fit=crop",
      glow: "from-orange-500/20 to-red-500/20",
      delay: "2s"
    }
  ];

  return (
    <>
      {/* Split Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: The Hook */}
          <div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-[#2D3436] leading-tight">
              Real life is better together.{' '}
              <span className="bg-gradient-to-r from-[#6C5CE7] to-[#FF7675] bg-clip-text text-transparent">
                Discover local events
              </span>{' '}
              and micro-communities.
            </h1>
            <p className="text-lg text-slate-600 mt-6 max-w-lg">
              Connect with people who share your interests. Find events, join communities, and make real connections in your area.
            </p>
            
            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button className="bg-gradient-to-r from-[#6C5CE7] to-[#FF7675] text-white rounded-full px-8 py-4 font-semibold text-base flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all duration-200 ease-out shadow-lg hover:shadow-xl">
                Get Started
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button className="bg-white text-slate-700 border-2 border-slate-300 rounded-full px-8 py-4 font-semibold text-base flex items-center justify-center gap-2 hover:border-slate-400 hover:scale-105 active:scale-95 transition-all duration-200 ease-out shadow-md hover:shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right Column: Floating Collage */}
          <div className="relative h-[400px] lg:h-[500px] w-full flex items-center justify-center">
            {floatingCards.map((card, index) => (
              <div
                key={index}
                className="absolute rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm bg-white/80 border border-white/40 w-[200px] h-[260px] lg:w-[280px] lg:h-[360px]"
                style={{
                  left: index === 0 ? '10%' : index === 1 ? '35%' : '60%',
                  top: `${index * 12 + 15}%`,
                  zIndex: floatingCards.length - index,
                  animation: `float 6s ease-in-out infinite`,
                  animationDelay: card.delay,
                }}
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.glow} opacity-50 -z-10 blur-2xl`} />
                
                {/* Card Image */}
                <div className="relative h-full w-full">
                  <img 
                    src={card.image} 
                    alt={card.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-br ${card.glow}"></div>`;
                    }}
                  />
                  {/* Overlay with title */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <h3 className="text-white font-bold text-xl">{card.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="text-center py-8 px-4">
        <div 
          ref={containerRef}
          className="relative inline-flex gap-3 px-2 py-2 bg-white/50 backdrop-blur-sm rounded-full shadow-md"
        >
          {/* Sliding Background Pill */}
          <div
            className="absolute bg-gradient-to-r from-[#6C5CE7] to-[#FF7675] rounded-full transition-all duration-300 ease-out shadow-lg"
            style={sliderStyle}
          />
          
          {/* Filter Buttons */}
          {filters.map((filter) => (
            <button
              key={filter}
              ref={(el) => (buttonRefs.current[filter] = el)}
              onClick={() => onFilterChange(filter)}
              className={`relative z-10 px-6 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-colors duration-300 ease-out active:scale-95 ${
                activeFilter === filter
                  ? 'text-white'
                  : 'text-[#636E72] hover:text-[#2D3436]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

export default HeroSection;
