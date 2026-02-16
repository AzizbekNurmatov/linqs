function YapCard({ post }) {
  const content = post.content || '';
  const isAnonymous = post.isAnonymous;

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] break-inside-avoid">
      {/* Colored Header */}
      <div className="bg-[#FFD02F] h-10 flex items-center px-4 border-b-2 border-black">
        <p className="text-xs font-black uppercase text-black">YAP</p>
      </div>
      {/* Content Body */}
      <div className="p-4">
        <p className="text-black font-medium text-sm leading-snug whitespace-pre-wrap">
          {content}
        </p>
        {isAnonymous && (
          <p className="text-xs font-bold uppercase text-black/60 mt-2">Anonymous</p>
        )}
      </div>
    </div>
  );
}

export default YapCard;
