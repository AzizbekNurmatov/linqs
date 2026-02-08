import { useState } from 'react';
import { MessageSquare, Zap, RefreshCw, UtensilsCrossed } from 'lucide-react';
import { YapModal } from './YapModal';

function BoardFilters() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [isYapModalOpen, setIsYapModalOpen] = useState(false);

  const filters = [
    {
      id: 'yap',
      label: 'YAP',
      icon: MessageSquare,
      color: 'bg-yellow-400',
      textColor: 'text-black',
      subtitle: 'Campus chatter & rumors.',
    },
    {
      id: 'flash',
      label: 'FLASH',
      icon: Zap,
      color: 'bg-pink-500',
      textColor: 'text-white',
      subtitle: 'Who is free right now?',
    },
    {
      id: 'barter',
      label: 'BARTER',
      icon: RefreshCw,
      color: 'bg-blue-400',
      textColor: 'text-black',
      subtitle: 'Trade favors & goods.',
    },
    {
      id: 'bites',
      label: 'BITES',
      icon: UtensilsCrossed,
      color: 'bg-orange-400',
      textColor: 'text-black',
      subtitle: 'Happy hours & food drops.',
    },
  ];

  const handleFilterClick = (filterId) => {
    if (filterId === 'yap') {
      setIsYapModalOpen(true);
      return;
    }
    setActiveFilter(activeFilter === filterId ? null : filterId);
  };

  return (
    <>
      <YapModal
        isOpen={isYapModalOpen}
        onClose={() => setIsYapModalOpen(false)}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.id;
        
        return (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            className={`
              ${filter.color}
              ${filter.textColor}
              border-4 border-black
              ${isActive 
                ? 'translate-x-[2px] translate-y-[2px] shadow-none' 
                : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'
              }
              transition-all duration-100 ease-out
              p-6
              flex flex-col items-center justify-center
              text-center
            `}
          >
            <Icon className="w-8 h-8 mb-2" />
            <h3 className="text-xl font-black uppercase mb-1">
              {filter.label}
            </h3>
            <p className="text-xs font-bold uppercase opacity-90">
              {filter.subtitle}
            </p>
          </button>
        );
      })}
    </div>
    </>
  );
}

export default BoardFilters;
