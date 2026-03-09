import React from 'react';

const TESTIMONIALS_GRID = [
  {
    id: 1,
    quote: '"Literally saved my Friday night. Found a massive rooftop set I had no idea was happening."',
    name: "A*** // CofC '26",
    bgClass: "bg-[#FFFF00]",
  },
  {
    id: 2,
    quote: '"No more \'what\'s the move?\' in the group chat. Everything\'s on the board. Game changer."',
    name: "B*** // CofC '25",
    bgClass: "bg-[#00FFFF]",
  },
  {
    id: 3,
    quote: '"Saw 200+ people going to the same tailgate. Showed up, found the squad. Linqs is the move."',
    name: "C*** // CofC '26",
    bgClass: "bg-[#FF00FF]",
  },
  {
    id: 4,
    quote: '"Finally one app that actually shows what\'s going on tonight. No gatekeeping, no dead group chats."',
    name: "D*** // CofC '25",
    bgClass: "bg-[#00FF00]",
  },
  {
    id: 5,
    quote: '"Posted my first event in 30 seconds. The headcount feature is insane—everyone actually shows up."',
    name: "E*** // CofC '26",
    bgClass: "bg-[#FFA500]",
  },
  {
    id: 6,
    quote: '"This is how you find the vibe. Real events, real people. King Street who?"',
    name: "F*** // CofC '25",
    bgClass: "bg-[#00CFFF]",
  },
];

/** Generic profile silhouette (bust/person) for anonymized testimonials */
function ProfileSilhouetteIcon() {
  return (
    <svg
      className="w-7 h-7 text-black"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

function TestimonialCard({ quote, name, bgClass }) {
  return (
    <article
      className={`${bgClass} border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black relative overflow-hidden`}
      aria-label={`Testimonial by ${name}`}
    >
      <span
        className="absolute -bottom-8 -right-4 text-9xl font-black opacity-10 leading-none select-none"
        aria-hidden
      >
        &quot;
      </span>
      <p className="font-bold text-lg mb-6 relative z-10">{quote}</p>
      <div className="flex flex-row items-center gap-3 relative z-10">
        <div className="w-12 h-12 rounded-full border-2 border-black bg-white flex-shrink-0 flex items-center justify-center">
          <ProfileSilhouetteIcon />
        </div>
        <span className="font-black text-sm uppercase">{name}</span>
      </div>
    </article>
  );
}

export default function TestimonialMarquee() {
  return (
    <section
      className="w-full border-t-4 border-black bg-white"
      aria-label="Student testimonials"
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 px-4 py-16 max-w-7xl mx-auto">
        {TESTIMONIALS_GRID.map((t) => (
          <TestimonialCard
            key={t.id}
            quote={t.quote}
            name={t.name}
            bgClass={t.bgClass}
          />
        ))}
      </div>
    </section>
  );
}
