function FlashCard({ post }) {
  const activity = post.activity || '';
  const location = post.location || '';
  const timeFrame = post.timeFrame || 'now';
  const timeLabel = timeFrame === 'now' ? 'NOW ⚡' : timeFrame === '1h' ? 'IN 1 HR' : 'TONIGHT';

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] break-inside-avoid">
      {/* Colored Header */}
      <div className="bg-[#F54298] h-10 flex items-center px-4 border-b-2 border-black">
        <p className="text-xs font-black uppercase text-black">FLASH</p>
      </div>
      {/* Content Body */}
      <div className="p-4">
        <p className="text-black font-black text-lg uppercase">{activity}</p>
        <p className="text-black font-medium text-sm mt-1">{location}</p>
        <p className="text-xs font-bold uppercase text-black/80 mt-2">{timeLabel}</p>
      </div>
    </div>
  );
}

export default FlashCard;
