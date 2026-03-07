import { Link } from 'react-router-dom';

const HOST_BG = '#FFE135'; // Neo-yellow

function CheckIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
      <path d="M5 12l5 5L19 7" />
    </svg>
  );
}

export default function DualCTA() {
  return (
    <section className="w-full border-t-4 border-black bg-white" aria-labelledby="dual-cta-heading">
      <h2 id="dual-cta-heading" className="sr-only">
        Host an event or explore what’s on
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Column 1: Host CTA */}
        <div
          className="p-6 sm:p-8 md:p-10 lg:p-12 border-b-4 md:border-b-0 md:border-r-4 border-black min-h-[320px] flex flex-col justify-between"
          style={{ backgroundColor: HOST_BG }}
        >
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-black leading-tight">
              Got a plan? Make it a movie.
            </h3>
            <p className="text-base sm:text-lg font-bold text-black/90">
              Hosting on Linqs takes 30 seconds.
            </p>
            <ul className="space-y-2 sm:space-y-3" role="list">
              <li className="flex items-start gap-3">
                <span className="mt-0.5" aria-hidden>
                  <CheckIcon />
                </span>
                <span className="text-sm sm:text-base font-bold text-black">
                  Drop the details & set the vibe.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5" aria-hidden>
                  <CheckIcon />
                </span>
                <span className="text-sm sm:text-base font-bold text-black">
                  Track RSVPs in real-time.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5" aria-hidden>
                  <CheckIcon />
                </span>
                <span className="text-sm sm:text-base font-bold text-black">
                  Manage the door like a pro.
                </span>
              </li>
            </ul>
          </div>
          <div className="mt-6 sm:mt-8">
            <Link
              to="/explore"
              className="inline-block bg-white text-black border-4 border-black font-black text-sm sm:text-base uppercase px-6 py-3 sm:px-8 sm:py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-100 ease-out hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              CREATE EVENT
            </Link>
          </div>
        </div>

        {/* Column 2: Discover CTA */}
        <div className="p-6 sm:p-8 md:p-10 lg:p-12 bg-[#F5F5F5] min-h-[320px] flex flex-col justify-between border-black">
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-black leading-tight">
              Chasing the vibe? We got you.
            </h3>
            <p className="text-sm sm:text-base font-bold text-black/90 leading-snug">
              From underground sets to campus tailgates and rooftop socials. Stop asking &quot;what&apos;s the move?&quot; and just look at the board.
            </p>
            <div
              className="font-mono text-xs sm:text-sm font-bold text-black border-4 border-black bg-white p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-fit"
              aria-hidden
            >
              <span className="text-black/60">&gt;</span> STATUS: SATURDAY NIGHT LIKES TO PARTY
            </div>
          </div>
          <div className="mt-6 sm:mt-8">
            <Link
              to="/explore"
              className="inline-block bg-black text-white border-4 border-black font-black text-sm sm:text-base uppercase px-6 py-3 sm:px-8 sm:py-4 shadow-[6px_6px_0px_0px_rgba(240,80,152,1)] transition-all duration-100 ease-out hover:shadow-[2px_2px_0px_0px_rgba(240,80,152,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
            >
              EXPLORE THE BOARD
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
