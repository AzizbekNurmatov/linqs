function Explore() {
  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Explore Events</h1>
        
        {/* Bento Box Grid */}
        <div 
          className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          style={{
            gridAutoRows: '200px',
          }}
        >
          {/* Card 1 - Spans 2 columns, 2 rows */}
          <div 
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 shadow-xl hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-end lg:col-span-2 lg:row-span-2"
          >
            <h3 className="text-white font-bold text-2xl mb-2">Featured Event</h3>
            <p className="text-white/90 text-sm">Discover the most popular events in your area</p>
          </div>

          {/* Card 2 - Spans 2 columns, 1 row */}
          <div 
            className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl p-6 shadow-xl hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-center lg:col-span-2"
          >
            <h3 className="text-white font-bold text-xl mb-2">Live Music</h3>
            <p className="text-white/90 text-sm">Concerts and performances near you</p>
          </div>

          {/* Card 3 - Spans 1 column, 1 row */}
          <div 
            className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 shadow-xl hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-center"
          >
            <h3 className="text-white font-bold text-lg mb-2">Tech</h3>
            <p className="text-white/90 text-xs">Innovation & startups</p>
          </div>

          {/* Card 4 - Spans 1 column, 1 row */}
          <div 
            className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 shadow-xl hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-center"
          >
            <h3 className="text-white font-bold text-lg mb-2">Food</h3>
            <p className="text-white/90 text-xs">Culinary experiences</p>
          </div>

          {/* Card 5 - Spans 1 column, 2 rows */}
          <div 
            className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-6 shadow-xl hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-center lg:row-span-2"
          >
            <h3 className="text-white font-bold text-xl mb-2">Sports</h3>
            <p className="text-white/90 text-sm">Active events & fitness</p>
          </div>

          {/* Card 6 - Spans 2 columns, 1 row */}
          <div 
            className="bg-gradient-to-br from-violet-500 to-indigo-600 rounded-3xl p-6 shadow-xl hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-center lg:col-span-2"
          >
            <h3 className="text-white font-bold text-xl mb-2">Arts & Culture</h3>
            <p className="text-white/90 text-sm">Galleries, museums, and exhibitions</p>
          </div>

          {/* Card 7 - Spans 1 column, 1 row */}
          <div 
            className="bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl p-6 shadow-xl hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-center"
          >
            <h3 className="text-white font-bold text-lg mb-2">Nightlife</h3>
            <p className="text-white/90 text-xs">Bars & clubs</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explore;

