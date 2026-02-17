import { useState, useEffect, useRef } from 'react';
import { MapPin, Camera, Clock } from 'lucide-react';

const BITES_ORANGE = '#FF9F43';

export interface BitesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (post: {
    type: 'bites';
    biteKind: BiteType;
    whatInput: string;
    whereInput: string;
    untilGone?: boolean;
    endsAt?: string;
    proofFile?: File | null;
  }) => void;
}

type BiteType = 'free' | 'deal';

export function BitesModal({ isOpen, onClose, onSubmit }: BitesModalProps) {
  const [type, setType] = useState<BiteType>('free');
  const [whatInput, setWhatInput] = useState('');
  const [whereInput, setWhereInput] = useState('');
  const [untilGone, setUntilGone] = useState(false);
  const [endsAt, setEndsAt] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const proofInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      setProofFile(null);
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
    const validFree = type === 'free' && untilGone;
    const validDeal = type === 'deal' && endsAt;
    if (whatInput && whereInput && (validFree || validDeal)) {
      onSubmit?.({
        type: 'bites',
        biteKind: type,
        whatInput,
        whereInput,
        untilGone: type === 'free' ? untilGone : undefined,
        endsAt: type === 'deal' ? endsAt : undefined,
        proofFile: proofFile ?? undefined,
      });
      setWhatInput('');
      setWhereInput('');
      setUntilGone(false);
      setEndsAt('');
      setProofFile(null);
      onClose();
    }
  };

  const handlePhotoUpload = () => {
    proofInputRef.current?.click();
  };

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setProofFile(file);
    }
    e.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bites-modal-title"
    >
      <div
        className="w-full max-w-lg bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b-[4px] border-black"
          style={{ backgroundColor: BITES_ORANGE }}
        >
          <h2
            id="bites-modal-title"
            className="text-black font-bold uppercase text-sm tracking-wide"
          >
            POST A BITE // FOOD & DRINKS
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
          {/* Type Toggle: FREE DROP vs DEAL */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('free')}
              className={`flex-1 px-4 py-3 font-bold text-sm uppercase border-[2px] border-black transition-all duration-200 ${
                type === 'free'
                  ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
              style={{ borderRadius: '2px' }}
            >
              FREE DROP 🍕
            </button>
            <button
              type="button"
              onClick={() => setType('deal')}
              className={`flex-1 px-4 py-3 font-bold text-sm uppercase border-[2px] border-black transition-all duration-200 ${
                type === 'deal'
                  ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
              style={{ borderRadius: '2px' }}
            >
              DEAL / PROMO 💸
            </button>
          </div>

          {/* What is it? */}
          <div>
            <label htmlFor="bites-what" className="block text-sm font-bold text-black mb-3 uppercase tracking-wide">
              What is it?
            </label>
            <input
              id="bites-what"
              type="text"
              value={whatInput}
              onChange={(e) => setWhatInput(e.target.value)}
              placeholder="e.g. Pizza, Happy Hour 2-for-1..."
              className="w-full px-4 py-3 bg-white border-[2px] border-black text-black font-medium placeholder:text-gray-500 focus:outline-none focus:ring-0 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              style={{ borderRadius: '2px' }}
            />
          </div>

          {/* Where at? */}
          <div>
            <label htmlFor="bites-where" className="block text-sm font-bold text-black mb-3 uppercase tracking-wide">
              Where at?
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black pointer-events-none" />
              <input
                id="bites-where"
                type="text"
                value={whereInput}
                onChange={(e) => setWhereInput(e.target.value)}
                placeholder="e.g. Addie's, Library café..."
                className="w-full pl-12 pr-4 py-3 bg-white border-[2px] border-black text-black font-medium placeholder:text-gray-500 focus:outline-none focus:ring-0 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                style={{ borderRadius: '2px' }}
              />
            </div>
          </div>

          {/* Until When? - Conditional */}
          <div>
            <label className="block text-sm font-bold text-black mb-3 uppercase tracking-wide">
              Until When?
            </label>
            {type === 'free' ? (
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={untilGone}
                  onChange={(e) => setUntilGone(e.target.checked)}
                  className="w-5 h-5 border-[3px] border-black rounded-none accent-orange-400 cursor-pointer"
                />
                <span className="font-bold uppercase text-sm text-black">
                  Until it runs out (Gone when gone)
                </span>
              </label>
            ) : (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-black flex-shrink-0" />
                <input
                  type="datetime-local"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white border-[2px] border-black text-black font-medium focus:outline-none focus:ring-0 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  style={{ borderRadius: '2px' }}
                />
              </div>
            )}
          </div>

          {/* Add Proof - Image Upload (available for both Free Drop and Deal/Promo) */}
          <div>
            <label className="block text-sm font-bold text-black mb-3 uppercase tracking-wide">
              Add Proof
            </label>
            <input
              ref={proofInputRef}
              type="file"
              accept="image/*"
              onChange={handleProofChange}
              className="hidden"
              aria-hidden="true"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePhotoUpload}
                className="w-14 h-14 flex flex-col items-center justify-center gap-1 bg-white border-[2px] border-black text-black hover:opacity-80 transition-opacity shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0"
                style={{ borderRadius: '2px' }}
                aria-label="Add proof photo"
              >
                <Camera className="w-6 h-6" strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase">Proof</span>
              </button>
              {proofFile && (
                <span className="text-xs font-bold text-black uppercase border-2 border-black px-2 py-1 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {proofFile.name}
                </span>
              )}
            </div>
          </div>

          {/* Footer - BLAST BITE Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={
                !whatInput ||
                !whereInput ||
                (type === 'free' && !untilGone) ||
                (type === 'deal' && !endsAt)
              }
              className="w-full py-3 font-bold uppercase border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              style={{ backgroundColor: BITES_ORANGE, borderRadius: '2px' }}
            >
              BLAST BITE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BitesModal;
