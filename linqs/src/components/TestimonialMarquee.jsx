import React from 'react';

const TESTIMONIALS = [
  {
    id: 1,
    username: 'u*******99',
    quote: "Actually found a basement set that didn't get shut down in 10 mins. Linqs is undefeated rn.",
    platform: 'x',
    profileColor: '#00F5FF', // Neon Cyan
  },
  {
    id: 2,
    username: 'A*******',
    quote: "bro cancel the res, I found a rooftop thing on linqs. we're moving.",
    platform: 'imessage',
    profileColor: '#90EE90', // Light Green
  },
  {
    id: 3,
    username: 'c*******_',
    quote: "gatekeeping is officially dead. how did I not know about this site 😭",
    platform: 'tiktok',
    profileColor: '#FF2D92', // Neon Pink
  },
  {
    id: 4,
    username: 'm*******',
    quote: "weekend saved. no more aimless walking up and down King trying to find the vibe.",
    platform: 'camera',
    profileColor: '#B0B0B0', // Light Gray
  },
  {
    id: 5,
    username: 't*******',
    quote: "the fact that I can see 180 people are already going to the same tailgate... game changer.",
    platform: 'x',
    profileColor: '#FFE135', // Neon Yellow
  },
];

/** Person silhouette (head + shoulders) with distinct fill color, neobrutalist border */
function ProfileSilhouette({ fill, className = 'w-10 h-10' }) {
  return (
    <span
      className={`${className} flex-shrink-0 flex items-center justify-center border-2 border-black overflow-hidden bg-white`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="w-[85%] h-[85%]" fill={fill} stroke="black" strokeWidth="1.5" strokeLinejoin="miter">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </span>
  );
}

/** 𝕏 — larger, full black (X logo) */
function XIcon({ className = 'w-10 h-10' }) {
  return (
    <span className={`${className} flex items-center justify-center flex-shrink-0 text-black`} aria-hidden>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </span>
  );
}

/** 💬 — larger green iMessage bubble */
function IMessageIcon({ className = 'w-10 h-10' }) {
  return (
    <span
      className={`${className} flex items-center justify-center flex-shrink-0 rounded-full border-2 border-black`}
      style={{ backgroundColor: '#34C759' }}
      aria-hidden
    >
      <svg className="w-1/2 h-1/2 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
      </svg>
    </span>
  );
}

/** 🎵 — Legible TikTok: two vertical bars (cyan | pink), iconic and instantly recognizable */
function TikTokIcon({ className = 'w-10 h-10' }) {
  return (
    <span className={`${className} flex items-center justify-center flex-shrink-0 border-2 border-black overflow-hidden bg-white`} aria-hidden>
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect x="5" y="4" width="6" height="16" fill="#25F4EE" stroke="black" strokeWidth="1.5" />
        <rect x="13" y="4" width="6" height="16" fill="#FE2C55" stroke="black" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

/** 📸 — full camera icon, black */
function CameraIcon({ className = 'w-10 h-10' }) {
  return (
    <span className={`${className} flex items-center justify-center flex-shrink-0 text-black`} aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" className="w-full h-full">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    </span>
  );
}

function PlatformIcon({ platform, className }) {
  const size = 'w-10 h-10 sm:w-12 sm:h-12';
  switch (platform) {
    case 'x':
      return <XIcon className={className || size} />;
    case 'imessage':
      return <IMessageIcon className={className || size} />;
    case 'tiktok':
      return <TikTokIcon className={className || size} />;
    case 'camera':
      return <CameraIcon className={className || size} />;
    default:
      return <XIcon className={className || size} />;
  }
}

function TestimonialCard({ username, quote, platform, profileColor }) {
  return (
    <article
      className="w-80 flex-shrink-0 bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4"
      aria-label={`Testimonial by ${username}`}
    >
      <header className="flex items-center gap-3">
        <ProfileSilhouette fill={profileColor} className="w-11 h-11 sm:w-12 sm:h-12" />
        <div className="flex-1 min-w-0">
          <span className="font-mono text-sm font-bold text-black truncate block">{username}</span>
        </div>
        <PlatformIcon platform={platform} className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" />
      </header>
      <p className="font-sans text-sm sm:text-base font-medium text-black leading-snug flex-1">
        {quote}
      </p>
    </article>
  );
}

export default function TestimonialMarquee() {
  const duplicated = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section
      className="w-full border-y-4 border-black bg-white py-8 relative"
      aria-label="Testimonials"
    >
      {/* Same pattern as tags marquee under hero: scoped CSS + container/content */}
      <div className="testimonial-marquee-container">
        <div className="testimonial-marquee-content">
          {duplicated.map((t, index) => (
            <div key={`marquee-${index}`} className="testimonial-marquee-item">
              <TestimonialCard
                username={t.username}
                quote={t.quote}
                platform={t.platform}
                profileColor={t.profileColor}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes testimonial-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .testimonial-marquee-container {
          overflow: hidden;
          position: relative;
        }
        .testimonial-marquee-content {
          display: flex;
          gap: 1.5rem;
          width: fit-content;
          animation: testimonial-marquee 40s linear infinite;
        }
        .testimonial-marquee-item {
          flex-shrink: 0;
          padding-left: 1.5rem;
        }
        .testimonial-marquee-item:first-child {
          padding-left: 2rem;
        }
        @media (min-width: 640px) {
          .testimonial-marquee-item:first-child {
            padding-left: 3.5rem;
          }
        }
      `}</style>
    </section>
  );
}
