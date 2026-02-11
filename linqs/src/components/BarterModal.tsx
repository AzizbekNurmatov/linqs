import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

const BARTER_BLUE = '#589BF2';

export interface BarterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BarterMode = 'goods' | 'favors';

export function BarterModal({ isOpen, onClose }: BarterModalProps) {
  const [mode, setMode] = useState<BarterMode>('goods');
  const [haveInput, setHaveInput] = useState('');
  const [wantInput, setWantInput] = useState('');

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
    if (haveInput && wantInput) {
      // Add your barter post logic here
      console.log({ mode, haveInput, wantInput });
      onClose();
      setHaveInput('');
      setWantInput('');
    }
  };

  const handlePhotoUpload = () => {
    // Add photo upload logic here
    console.log('Photo upload triggered');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="barter-modal-title"
    >
      <div
        className="w-full max-w-lg bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b-[4px] border-black"
          style={{ backgroundColor: BARTER_BLUE }}
        >
          <h2
            id="barter-modal-title"
            className="text-black font-bold uppercase text-sm tracking-wide"
          >
            START A TRADE // BARTER
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-black font-bold text-xl leading-none hover:opacity-80 transition-opacity p-1"
            aria-label="Close modal"
          >
            [X]
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-6">
          {/* Mode Toggle: GOODS vs FAVORS */}
          <div className="flex">
            <button
              type="button"
              onClick={() => setMode('goods')}
              className={`flex-1 px-5 py-2.5 font-bold text-sm uppercase border-[2px] border-black border-r-0 transition-all duration-200 ${
                mode === 'goods'
                  ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
              }`}
              style={{ borderRadius: '2px 0 0 2px' }}
            >
              GOODS
            </button>
            <button
              type="button"
              onClick={() => setMode('favors')}
              className={`flex-1 px-5 py-2.5 font-bold text-sm uppercase border-[2px] border-black transition-all duration-200 ${
                mode === 'favors'
                  ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
              }`}
              style={{ borderRadius: '0 2px 2px 0' }}
            >
              FAVORS
            </button>
          </div>

          {/* I HAVE... Section */}
          <div>
            <label htmlFor="barter-have" className="block text-sm font-bold text-black mb-3 uppercase tracking-wide">
              I HAVE...
            </label>
            <div className="flex gap-2 flex-wrap">
              <input
                id="barter-have"
                type="text"
                value={haveInput}
                onChange={(e) => setHaveInput(e.target.value)}
                placeholder="What are you trading?"
                className="flex-1 min-w-[200px] px-4 py-3 bg-white border-[2px] border-black text-black font-medium placeholder:text-gray-500 focus:outline-none focus:ring-0 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                style={{ borderRadius: '2px' }}
              />
              {mode === 'goods' && (
                <button
                  type="button"
                  onClick={handlePhotoUpload}
                  className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white border-[2px] border-black text-black hover:opacity-80 transition-opacity shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  style={{ borderRadius: '2px' }}
                  aria-label="Upload photo"
                >
                  <Camera className="w-5 h-5" strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>

          {/* I WANT... Section */}
          <div>
            <label htmlFor="barter-want" className="block text-sm font-bold text-black mb-3 uppercase tracking-wide">
              I WANT...
            </label>
            <input
              id="barter-want"
              type="text"
              value={wantInput}
              onChange={(e) => setWantInput(e.target.value)}
              placeholder="What do you want in return?"
              className="w-full px-4 py-3 bg-white border-[2px] border-black text-black font-medium placeholder:text-gray-500 focus:outline-none focus:ring-0 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              style={{ borderRadius: '2px' }}
            />
          </div>

          {/* Footer - POST TRADE Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!haveInput || !wantInput}
              className="w-full py-3 font-bold uppercase border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              style={{ backgroundColor: BARTER_BLUE, borderRadius: '2px' }}
            >
              POST TRADE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BarterModal;
