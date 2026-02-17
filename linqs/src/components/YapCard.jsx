import { User, UserX } from 'lucide-react';

function YapCard({ post }) {
  const content = post.content || '';
  const isAnonymous = post.isAnonymous || false;
  const username = post.username || null;
  const avatarUrl = post.avatarUrl || null;

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
        {/* Author Section */}
        <div className="mt-3 flex items-center gap-2">
          {isAnonymous ? (
            <>
              <UserX className="w-4 h-4 text-black/60 flex-shrink-0" strokeWidth={2.5} />
              <p className="text-xs font-bold uppercase text-black/60">Anonymous</p>
            </>
          ) : (
            <>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={username || 'User'}
                  className="w-5 h-5 rounded-full border border-black object-cover flex-shrink-0"
                />
              ) : (
                <User className="w-5 h-5 text-black/60 flex-shrink-0" strokeWidth={2.5} />
              )}
              <p className="text-xs font-bold uppercase text-black/80">
                {username || 'Unknown User'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default YapCard;
