function HeroSection() {
  const handlePrimaryAction = () => {
    const destination = document.querySelector('main');
    if (destination) {
      destination.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20 relative z-10">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Headline */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-black leading-none tracking-tighter uppercase animate-fade-in">
            THE CITY IS OPEN
          </h1>

          {/* Sub-headline / Social Proof */}
          <p className="text-base sm:text-lg md:text-xl font-mono text-black max-w-3xl leading-tight animate-fade-in-delay">
            Join hundreds of Charleston students discovering the best underground shows, campus club meetups, and local nightlife.
          </p>

          {/* Primary + Secondary CTA */}
          <div className="w-full flex flex-col items-center gap-4 animate-fade-in-delay-2">
            <button
              type="button"
              onClick={handlePrimaryAction}
              className="w-[85%] sm:w-auto sm:min-w-[420px] max-w-xl bg-[#ff4fa3] text-black border-4 border-black px-6 py-5 text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wide shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-4 focus:ring-[#ffe500]"
            >
              SEE WHAT&apos;S ON TONIGHT ➔
            </button>

            <a
              href="/board"
              className="text-sm sm:text-base font-bold uppercase underline underline-offset-4 text-black hover:text-[#ff4fa3] transition-colors"
            >
              Organizing something? Post your event here.
            </a>
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
      `}</style>
    </section>
  );
}

export default HeroSection;
