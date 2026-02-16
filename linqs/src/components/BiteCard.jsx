function BiteCard({ post }) {
  const what = post.whatInput || '';
  const where = post.whereInput || '';
  const isFree = post.biteKind === 'free';

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] break-inside-avoid">
      {/* Colored Header */}
      <div className="bg-[#FF9046] h-10 flex items-center justify-between px-4 border-b-2 border-black">
        <p className="text-xs font-black uppercase text-black">BITES</p>
        <span className={`text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black ${isFree ? 'bg-[#FFD700]' : 'bg-white'}`}>
          {isFree ? 'FREE DROP' : 'DEAL'}
        </span>
      </div>
      {/* Content Body */}
      <div className="p-4">
        <p className="text-black font-black text-sm uppercase">{what}</p>
        <p className="text-black font-medium text-xs mt-1">{where}</p>
      </div>
    </div>
  );
}

export default BiteCard;
