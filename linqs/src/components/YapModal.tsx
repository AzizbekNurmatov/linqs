import { useState, useEffect } from 'react';

const MAX_CHARS = 280;

export interface YapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function YapModal({ isOpen, onClose }: YapModalProps) {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your post logic here
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="yap-modal-title"
    >
      <div
        className="w-full max-w-lg bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-black px-4 py-3">
          <h2
            id="yap-modal-title"
            className="text-white font-bold uppercase text-sm tracking-wide"
          >
            START A YAP // CAMPUS CHATTER
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white font-bold text-xl leading-none hover:opacity-80 transition-opacity p-1"
            aria-label="Close modal"
          >
            [X]
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
              placeholder="What's the tea? Spill it here..."
              className="w-full min-h-[140px] bg-white border-[2px] border-black p-3 rounded-none font-sans text-black placeholder:text-gray-500 focus:outline-none focus:ring-0 resize-y"
              maxLength={MAX_CHARS}
              aria-describedby="yap-char-count"
            />
            <p
              id="yap-char-count"
              className="text-right text-sm font-bold text-black mt-1"
            >
              {content.length}/{MAX_CHARS}
            </p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-5 h-5 border-[3px] border-black rounded-none accent-pink-400 cursor-pointer"
            />
            <span className="font-bold uppercase text-sm text-black">
              Anonymous Post
            </span>
          </label>

          {/* Footer / Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#F472B6] text-black font-bold uppercase border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all duration-100 ease-out"
            >
              Post Yap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default YapModal;
