function BarterCard({ post }) {
  const have = post.haveInput || '';
  const want = post.wantInput || '';
  const mode = post.mode === 'favors' ? 'FAVORS' : 'GOODS';
  const imageUrl = post.imageUrl || post.image_url || null;

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] break-inside-avoid">
      {/* Colored Header */}
      <div className="bg-[#5DA9FF] h-10 flex items-center px-4 border-b-2 border-black">
        <p className="text-xs font-black uppercase text-black">BARTER · {mode}</p>
      </div>
      {/* Image - Top of content (only for goods) */}
      {imageUrl && mode === 'GOODS' && (
        <div className="w-full border-b-2 border-black">
          <img
            src={imageUrl}
            alt={have}
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
        <div className="space-y-2">
          <div>
            <p className="text-[10px] font-bold uppercase text-black/70">I HAVE</p>
            <p className="text-black font-medium text-sm">{have}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-black/70">I WANT</p>
            <p className="text-black font-medium text-sm">{want}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BarterCard;
