import { MapPin, Clock } from 'lucide-react';

function formatEndsAt(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function BiteCard({ post }) {
  const what = post.whatInput || '';
  const location = post.whereInput || '';
  const isFree = post.biteKind === 'free';
  const endsAt = post.endsAt || '';
  const imageUrl = post.imageUrl || post.image_url || null;

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] break-inside-avoid">
      {/* Colored Header */}
      <div className="bg-[#FF9046] h-10 flex items-center justify-between px-4 border-b-2 border-black">
        <p className="text-xs font-black uppercase text-black">BITES</p>
        <span className={`text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black ${isFree ? 'bg-[#FFD700]' : 'bg-white'}`}>
          {isFree ? 'FREE DROP' : 'DEAL'}
        </span>
      </div>
      {/* Image - Top of content */}
      {imageUrl && (
        <div className="w-full border-b-2 border-black">
          <img
            src={imageUrl}
            alt={what}
            className="w-full h-48 object-cover border-2 border-black"
            onError={(e) => {
              // Hide image on error
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      {/* Content Body */}
      <div className="p-4">
        <p className="text-black font-black text-sm uppercase">{what}</p>
        {location ? (
          <p className="text-black font-medium text-xs mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2.5} />
            <span>{location}</span>
          </p>
        ) : null}
        {!isFree && endsAt ? (
          <p className="text-black/80 font-bold text-[10px] uppercase mt-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2.5} />
            <span>Until {formatEndsAt(endsAt)}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default BiteCard;
