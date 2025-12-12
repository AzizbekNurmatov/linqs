import FilterBar from './FilterBar';

function HeroSection({ selectedCategories, onCategoryToggle, onCategoryClick }) {
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

          {/* Right Column: Floating Ecosystem */}
          <div className="relative w-full h-[600px] flex items-center justify-center" style={{ perspective: '1000px' }}>
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-rose-500/20 blur-3xl rounded-full" />
            
            {/* Central Hero Card */}
            <div 
              className="relative w-80 bg-white rounded-3xl shadow-2xl z-20 hover:scale-105 transition-transform duration-500 animate-float-rotated"
            >
              <div className="relative h-64 overflow-hidden rounded-t-3xl">
                <img 
                  src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop"
                  alt="Neon Nights Festival"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-indigo-500 to-rose-500"></div>';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-slate-800 mb-2">Neon Nights Festival</h3>
                <p className="text-slate-600 text-sm">July 20, 2024 • 8:00 PM</p>
              </div>
            </div>

            {/* Satellite 1: Chat Bubble (Top Right) */}
            <div 
              className="absolute -right-12 top-20 z-30 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 animate-float-delayed"
            >
              <div className="flex items-center gap-3">
                <img 
                  src="https://i.pravatar.cc/150?img=12"
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Are we getting VIP tickets? 🎫</p>
                </div>
              </div>
            </div>

            {/* Satellite 2: Community Pill (Bottom Left) */}
            <div 
              className="absolute -left-8 bottom-32 z-30 bg-white py-2 px-4 rounded-full shadow-xl flex items-center gap-2 animate-float-delayed"
              style={{ animationDelay: '1s' }}
            >
              <div className="flex items-center -space-x-2">
                <img 
                  src="https://i.pravatar.cc/150?img=1"
                  alt="Friend 1"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img 
                  src="https://i.pravatar.cc/150?img=2"
                  alt="Friend 2"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img 
                  src="https://i.pravatar.cc/150?img=3"
                  alt="Friend 3"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              </div>
              <span className="text-sm font-semibold text-slate-700">12 friends going</span>
            </div>

            {/* Satellite 3: Location Map Card (Bottom Right) */}
            <div 
              className="absolute right-4 bottom-10 z-10 w-32 h-24 bg-slate-50 rounded-xl shadow-lg border-2 border-white overflow-hidden"
            >
              <div className="relative w-full h-full">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=200&h=150&fit=crop"
                  alt="Map location"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-full h-full bg-slate-200"></div>';
                  }}
                />
                {/* Pulsing Pin */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" style={{ animationDuration: '2s' }}></div>
                    <div className="relative w-4 h-4 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <FilterBar
        selectedCategories={selectedCategories}
        onCategoryToggle={onCategoryToggle}
        onCategoryClick={onCategoryClick}
      />
    </>
  );
}

export default HeroSection;
