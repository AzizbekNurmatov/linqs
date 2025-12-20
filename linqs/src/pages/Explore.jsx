import { Music, Code, Utensils, Dumbbell, Palette, Moon } from 'lucide-react';

function Explore() {
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
        @keyframes glitch {
          0%, 100% {
            transform: translateX(0);
            color: white;
          }
          20% {
            transform: translateX(-2px);
            color: #00ffff;
          }
          40% {
            transform: translateX(2px);
            color: #ff00ff;
          }
          60% {
            transform: translateX(-1px);
            color: #ffff00;
          }
          80% {
            transform: translateX(1px);
            color: white;
          }
        }
        .glitch-hover:hover {
          animation: glitch 0.3s steps(10) infinite;
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
          {/* Card 1 - Featured Event - Spans 2 columns, 2 rows */}
          <div 
            className="relative bg-gradient-to-br from-purple-700 via-indigo-600 to-pink-600 rounded-3xl p-6 shadow-xl hover:skew-x-6 hover:shadow-2xl transition-all duration-300 ease-out flex flex-col justify-end lg:col-span-2 lg:row-span-2 overflow-hidden"
          >
            {/* Live Indicator Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 z-10">
              <div className="w-2 h-2 bg-green-400 rounded-full pulse-dot"></div>
              <span className="text-white text-xs font-semibold">Happening Now</span>
            </div>
            
            {/* Icon Watermark */}
            <Music className="absolute bottom-4 right-4 w-24 h-24 text-white/20 -rotate-12" strokeWidth={1.5} />
            
            {/* Social Proof */}
            <div className="flex items-center gap-3 mb-4 z-10 relative">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-white"></div>
              </div>
              <span className="text-white/90 text-sm font-medium font-['Caveat']">120+ going</span>
            </div>
            
            <h3 className="text-white font-['Permanent Marker'] text-8xl font-bold -ml-4 -mr-4 leading-none hover:text-yellow-300 transition-colors duration-300">FEATURED</h3>
            <p className="text-white/90 text-sm font-['Caveat'] mt-2">Discover the most popular events</p>
          </div>

          {/* Card 2 - Live Music - Spans 2 columns, 1 row */}
          <div 
            className="relative bg-gradient-to-br from-rose-600 via-pink-600 to-orange-600 rounded-3xl p-6 shadow-xl hover:scale-110 hover:rotate-3 hover:shadow-2xl transition-all duration-300 ease-out flex flex-col justify-center lg:col-span-2 overflow-hidden"
          >
            {/* Live Indicator Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 z-10">
              <div className="w-2 h-2 bg-red-400 rounded-full pulse-dot"></div>
              <span className="text-white text-xs font-semibold">Happening Now</span>
            </div>
            
            {/* Icon Watermark */}
            <Music className="absolute bottom-4 right-4 w-20 h-20 text-white/20 -rotate-12" strokeWidth={1.5} />
            
            <h3 className="text-white font-['Bangers'] text-7xl font-bold -ml-2 -mr-2 leading-none">LIVE MUSIC</h3>
            <p className="text-white/90 text-sm font-['Caveat'] mt-2">Concerts and performances</p>
          </div>

          {/* Card 3 - Tech - Spans 1 column, 1 row */}
          <div 
            className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 shadow-xl hover:translate-x-2 hover:shadow-2xl transition-all duration-300 ease-out flex flex-col justify-center overflow-hidden"
          >
            {/* Icon Watermark */}
            <Code className="absolute bottom-4 right-4 w-16 h-16 text-white/20 -rotate-12" strokeWidth={1.5} />
            
            <h3 className="text-white font-['Righteous'] text-6xl font-bold -ml-2 -mr-2 leading-none glitch-hover">TECH</h3>
            <p className="text-white/90 text-xs font-['Caveat'] mt-1">Innovation & startups</p>
          </div>

          {/* Card 4 - Food - Spans 1 column, 1 row */}
          <div 
            className="relative bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 rounded-3xl p-6 shadow-xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 ease-out flex flex-col justify-center overflow-hidden"
          >
            {/* Icon Watermark */}
            <Utensils className="absolute bottom-4 right-4 w-16 h-16 text-white/20 -rotate-12" strokeWidth={1.5} />
            
            <h3 className="text-white font-['Caveat'] text-6xl font-bold -ml-2 -mr-2 leading-none">FOOD</h3>
            <p className="text-white/90 text-xs font-['Caveat'] mt-1">Culinary experiences</p>
          </div>

          {/* Card 5 - Sports - Spans 1 column, 2 rows */}
          <div 
            className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 rounded-3xl p-6 shadow-xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 ease-out flex flex-col justify-center lg:row-span-2 overflow-hidden"
          >
            {/* Icon Watermark */}
            <Dumbbell className="absolute bottom-4 right-4 w-20 h-20 text-white/20 -rotate-12" strokeWidth={1.5} />
            
            <h3 className="text-white font-['Bangers'] text-7xl font-bold -ml-2 -mr-2 leading-none">SPORTS</h3>
            <p className="text-white/90 text-sm font-['Caveat'] mt-2">Active events & fitness</p>
          </div>

          {/* Card 6 - Arts & Culture - Spans 2 columns, 1 row */}
          <div 
            className="relative bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 rounded-3xl p-6 shadow-xl hover:italic hover:tracking-widest hover:shadow-2xl transition-all duration-300 ease-out flex flex-col justify-center lg:col-span-2 overflow-hidden"
          >
            {/* Icon Watermark */}
            <Palette className="absolute bottom-4 right-4 w-20 h-20 text-white/20 -rotate-12" strokeWidth={1.5} />
            
            <h3 className="text-white font-['Abril Fatface'] text-7xl font-bold -ml-2 -mr-2 leading-none">ARTS</h3>
            <p className="text-white/90 text-sm font-['Caveat'] mt-2">Galleries, museums, exhibitions</p>
          </div>

          {/* Card 7 - Nightlife - Spans 1 column, 1 row */}
          <div 
            className="relative bg-gradient-to-br from-red-600 via-rose-600 to-pink-600 rounded-3xl p-6 shadow-xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 ease-out flex flex-col justify-center overflow-hidden"
          >
            {/* Icon Watermark */}
            <Moon className="absolute bottom-4 right-4 w-16 h-16 text-white/20 -rotate-12" strokeWidth={1.5} />
            
            <h3 className="text-white font-['Bangers'] text-6xl font-bold -ml-2 -mr-2 leading-none">NIGHT</h3>
            <p className="text-white/90 text-xs font-['Caveat'] mt-1">Bars & clubs</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explore;

