import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NEON_PINK = '#FF2D92';
const NEON_YELLOW = '#FFE135';

const bracketOutlineStyle = { WebkitTextStroke: '4px black', paintOrder: 'stroke fill' };

function Bracket({ char, colorClass, large }) {
  return (
    <span
      className={`font-black select-none flex-shrink-0 ${large ? 'text-8xl md:text-[12rem]' : 'text-6xl sm:text-7xl md:text-8xl'} ${colorClass}`}
      style={bracketOutlineStyle}
      aria-hidden
    >
      {char}
    </span>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
      <path d="M5 12l5 5L19 7" />
    </svg>
  );
}

function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

export default function ScrollCTA() {
  const [block1Ref, block1Visible] = useReveal(0.05);
  const [block2Ref, block2Visible] = useReveal(0.08);
  const [block3Ref, block3Visible] = useReveal(0.05);
  const [block4Ref, block4Visible] = useReveal(0.08);

  const reveal = 'transition-all duration-700 ease-out';
  const revealIn = (visible) =>
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8';

  return (
    <section
      className="w-full border-t-4 border-black bg-white overflow-hidden"
      aria-labelledby="scroll-cta-heading"
    >
      <h2 id="scroll-cta-heading" className="sr-only">
        Why Linqs — find the move or make it
      </h2>

      {/* Block 1: The Pain Point — Pink CTA */}
      <div
        ref={block1Ref}
        className={`${reveal} ${revealIn(block1Visible)}`}
        style={{ backgroundColor: NEON_PINK }}
      >
        <div className="w-full border-b-4 border-black py-32 md:py-40 px-6 sm:px-8 md:px-12">
          <div className="max-w-5xl mx-auto flex flex-row items-center justify-center gap-12">
            <Bracket char="[" colorClass="text-white" large />
            <div className="text-center">
              <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tighter text-black leading-[0.95]">
                The group chat is dead tonight.
              </h3>
              <p className="mt-6 sm:mt-8 text-lg sm:text-xl md:text-2xl font-bold text-black/90 max-w-2xl mx-auto">
                Stop asking &quot;what&apos;s the move?&quot; and waiting 45 minutes for a text back. The city is already moving.
              </p>
            </div>
            <Bracket char="]" colorClass="text-white" large />
          </div>
        </div>
      </div>

      {/* Block 2: The Solution — card offset left */}
      <div
        ref={block2Ref}
        className={`${reveal} ${revealIn(block2Visible)} border-b-4 border-black py-20 sm:py-24 md:py-28 bg-[#FAFAFA]`}
      >
        <div className="px-6 sm:px-8 md:px-12">
          <div className="max-w-4xl w-full mr-auto ml-0 border-4 border-black bg-white p-8 sm:p-10 md:p-12 lg:p-14 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
              <Bracket char="[" colorClass="text-[#FFE135]" />
              <div className="text-center">
                <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tighter text-black leading-tight">
                  We don&apos;t do FOMO.
                </h3>
                <p className="mt-5 sm:mt-6 text-base sm:text-lg md:text-xl font-bold text-black/90 max-w-xl mx-auto">
                  From basement DJ sets to rooftop socials and campus tailgates. No gatekeeping. If it&apos;s worth your time, it&apos;s right here.
                </p>
              </div>
              <Bracket char="]" colorClass="text-[#FFE135]" />
            </div>
            <div className="mt-8 sm:mt-10">
              <Link
                to="/explore"
                className="inline-block bg-black text-white border-4 border-black font-black text-sm sm:text-base uppercase px-6 py-3 sm:px-8 sm:py-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-100 ease-out hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              >
                EXPLORE THE BOARD
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Block 3: The Pivot — full width black + Social Oracle */}
      <div
        ref={block3Ref}
        className={`${reveal} ${revealIn(block3Visible)} border-b-4 border-black bg-black py-32 px-6 sm:px-8 md:px-12 relative`}
      >
        {/* Blueprint grid pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
        />
        <div className="max-w-5xl mx-auto flex flex-row items-center justify-center gap-4 sm:gap-6 relative z-10">
          <Bracket char="[" colorClass="text-[#6B21A8]" />
          <div className="text-center">
            <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tighter text-white leading-[0.95]">
              Tired of chasing the vibe?
            </h3>
            <p className="mt-6 sm:mt-8 text-lg sm:text-xl md:text-2xl font-bold text-white/90 max-w-2xl mx-auto">
              Help us build the first student-driven Social Oracle. We&apos;re using real-time data to predict where the city is actually moving. Drop a venue, build the hype.
            </p>
          </div>
          <Bracket char="]" colorClass="text-[#6B21A8]" />
        </div>
      </div>

      {/* Block 4: The Action — card offset right */}
      <div
        ref={block4Ref}
        className={`${reveal} ${revealIn(block4Visible)} border-b-4 border-black py-20 sm:py-24 md:py-28 bg-[#FAFAFA]`}
      >
        <div className="px-6 sm:px-8 md:px-12 flex justify-end">
          <div
            className="max-w-4xl w-full ml-auto mr-0 border-4 border-black p-8 sm:p-10 md:p-12 lg:p-14 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: NEON_YELLOW }}
          >
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tighter text-black leading-tight">
              Make it a movie.
            </h3>
            <p className="mt-5 sm:mt-6 text-base sm:text-lg md:text-xl font-bold text-black/90 max-w-xl">
              Drop the pin. Track the RSVPs. Manage the door. Going live on Linqs takes exactly 30 seconds.
            </p>
            <ul className="mt-6 sm:mt-8 space-y-3" role="list">
              <li className="flex items-start gap-3">
                <span className="mt-0.5" aria-hidden><CheckIcon /></span>
                <span className="text-sm sm:text-base font-bold text-black">No complex ticketing BS.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5" aria-hidden><CheckIcon /></span>
                <span className="text-sm sm:text-base font-bold text-black">Real-time headcounts.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5" aria-hidden><CheckIcon /></span>
                <span className="text-sm sm:text-base font-bold text-black">Total control of the room.</span>
              </li>
            </ul>
            <div className="mt-8 sm:mt-10">
              <Link
                to="/explore"
                className="inline-block bg-white text-black border-4 border-black font-black text-sm sm:text-base uppercase px-6 py-3 sm:px-8 sm:py-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-100 ease-out hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              >
                HOST AN EVENT
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
