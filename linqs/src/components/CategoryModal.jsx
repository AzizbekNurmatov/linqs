import { useEffect, useState } from 'react';

// Category data structure - organized by sections
const categories = {
  "Vibe": ["Chill", "Party", "Networking", "Intense"],
  "Topic": ["Tech", "Art", "Music", "Business"],
  "Campus": ["UNC", "NYU", "Main Quad"],
  "Activities": ["Hiking", "Yoga", "Gaming", "Reading", "Cooking", "Photography"],
  "Social": ["Dating", "Friendship", "Study Group", "Book Club", "Fitness"]
};

// Featured tags for the priority bar (top 6 most popular)
const featuredTags = ["Tech", "Music", "Art", "Party", "Networking", "Yoga"];

function CategoryModal({ isOpen, onClose, selectedCategories, onCategoryToggle }) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSelected = (category) => {
    return selectedCategories.includes(category);
  };

  const getTagColor = (tag) => {
    if (isSelected(tag)) {
      // Gradient for selected tags
      return 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white';
    }
    // Gray/white for unselected
    return 'bg-white text-slate-600 border border-slate-200';
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      {/* Glass Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
      
      {/* Modal Panel */}
      <div
        className={`relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto transform transition-all duration-300 ease-out ${
          isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-bold text-2xl text-slate-800">Filter by Category</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-all duration-200 ease-out active:scale-95"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Grid of Sections */}
        <div className="p-6 space-y-8">
          {/* Section 1: Vibe */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-4">
              BY VIBE
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories["Vibe"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => onCategoryToggle(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-out hover:scale-105 active:scale-95 ${getTagColor(tag)}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Topic */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-4">
              BY TOPIC
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories["Topic"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => onCategoryToggle(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-out hover:scale-105 active:scale-95 ${getTagColor(tag)}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Campus */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-4">
              BY CAMPUS
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories["Campus"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => onCategoryToggle(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-out hover:scale-105 active:scale-95 ${getTagColor(tag)}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Sections */}
          {Object.entries(categories)
            .filter(([sectionName]) => !["Vibe", "Topic", "Campus"].includes(sectionName))
            .map(([sectionName, tags]) => (
              <div key={sectionName}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-4">
                  BY {sectionName.toUpperCase()}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => onCategoryToggle(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-out hover:scale-105 active:scale-95 ${getTagColor(tag)}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={() => {
              // Clear all selections
              selectedCategories.forEach(cat => onCategoryToggle(cat));
            }}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all duration-200 ease-out active:scale-95"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export { CategoryModal, categories, featuredTags };
