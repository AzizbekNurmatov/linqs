import { useRef, useState } from 'react';
import { CategoryModal, featuredTags } from './CategoryModal';

function FilterBar({ selectedCategories, onCategoryToggle, onCategoryClick }) {
  const scrollContainerRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCategoryClick = (category) => {
    onCategoryClick(category);
  };

  return (
    <>
      {/* Filter Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          {/* Left Side - Scrollable Priority Pills */}
          <div className="flex-1 relative">
            <div
              ref={scrollContainerRef}
              className="flex items-center gap-3 overflow-x-auto scrollbar-hide"
              style={{
                maskImage: 'linear-gradient(to right, black 0%, black 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, black 0%, black 85%, transparent 100%)',
              }}
            >
              {featuredTags.slice(0, 6).map((tag) => {
                const isActive = selectedCategories.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleCategoryClick(tag)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-200 ease-out hover:scale-105 active:scale-95 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                        : 'bg-white text-slate-600 shadow-sm border border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side - Filter Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-all duration-200 ease-out active:scale-95 shadow-md hover:shadow-lg flex-shrink-0"
            aria-label="Open filter modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCategories={selectedCategories}
        onCategoryToggle={onCategoryToggle}
      />
    </>
  );
}

export default FilterBar;
