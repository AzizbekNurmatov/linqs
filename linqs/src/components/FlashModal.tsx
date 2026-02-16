import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

export interface FlashModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (post: { type: 'flash'; activity: string; location: string; timeFrame: string }) => void;
}

const ACTIVITIES = ['Study', 'Eat', 'Gym', 'Party', 'Coffee', 'Walk'];

export function FlashModal({ isOpen, onClose, onSubmit }: FlashModalProps) {
  const [activity, setActivity] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [timeFrame, setTimeFrame] = useState<string>('now');

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
    if (activity && location) {
      onSubmit?.({
        type: 'flash',
        activity,
        location,
        timeFrame,
      });
      setActivity('');
      setLocation('');
      setTimeFrame('now');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="flash-modal-title"
    >
      <div
        className="w-full max-w-lg bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-[#F05098] px-4 py-3 border-b-[4px] border-black">
          <h2
            id="flash-modal-title"
            className="text-black font-bold uppercase text-lg tracking-wide"
          >
            WHO IS FREE? ⚡️
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
          {/* Status Pills - Horizontal Scroll */}
          <div>
            <label className="block text-sm font-bold text-black mb-3 uppercase tracking-wide">
              Status
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {ACTIVITIES.map((act) => (
                <button
                  key={act}
                  type="button"
                  onClick={() => setActivity(act)}
                  className={`px-5 py-2.5 font-bold text-sm uppercase border-[2px] border-black transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                    activity === act
                      ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                  style={{ borderRadius: '2px' }}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>

          {/* Location Input */}
          <div>
            <label htmlFor="flash-location" className="block text-sm font-bold text-black mb-3 uppercase tracking-wide">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
              <input
                id="flash-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Addie's, Library, Stern Center..."
                className="w-full pl-12 pr-4 py-3 bg-white border-[2px] border-black text-black font-medium placeholder:text-gray-500 focus:outline-none focus:ring-0 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                style={{ borderRadius: '2px' }}
              />
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-bold text-black mb-3 uppercase tracking-wide">
              When?
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTimeFrame('now')}
                className={`flex-1 px-5 py-2.5 font-bold text-sm uppercase border-[2px] border-black transition-all duration-200 ${
                  timeFrame === 'now'
                    ? 'bg-[#F05098] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
                style={{ borderRadius: '2px' }}
              >
                NOW ⚡️
              </button>
              <button
                type="button"
                onClick={() => setTimeFrame('1h')}
                className={`flex-1 px-5 py-2.5 font-bold text-sm uppercase border-[2px] border-black transition-all duration-200 ${
                  timeFrame === '1h'
                    ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
                style={{ borderRadius: '2px' }}
              >
                IN 1 HR
              </button>
              <button
                type="button"
                onClick={() => setTimeFrame('tonight')}
                className={`flex-1 px-5 py-2.5 font-bold text-sm uppercase border-[2px] border-black transition-all duration-200 ${
                  timeFrame === 'tonight'
                    ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
                style={{ borderRadius: '2px' }}
              >
                TONIGHT
              </button>
            </div>
          </div>

          {/* Broadcast Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!activity || !location}
              className="w-full py-3 bg-black text-white font-bold uppercase border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-100 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              style={{ borderRadius: '2px' }}
            >
              Broadcast
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FlashModal;
