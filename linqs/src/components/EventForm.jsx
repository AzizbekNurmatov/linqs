import { useState } from 'react';

// Tag color function matching FeaturesBentoGrid
function getTagColor(tagString) {
  const colors = [
    'bg-indigo-100 text-indigo-700',
    'bg-rose-100 text-rose-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
  ];

  let hash = 0;
  for (let i = 0; i < tagString.length; i++) {
    const char = tagString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

// Genre configuration with colors matching Explore page
const genres = [
  { value: 'live-music', label: 'Music', gradient: 'from-rose-600 via-pink-600 to-orange-600' },
  { value: 'tech', label: 'Tech', gradient: 'from-emerald-600 via-teal-600 to-cyan-600' },
  { value: 'food', label: 'Food', gradient: 'from-amber-600 via-orange-600 to-red-600' },
  { value: 'sports', label: 'Sports', gradient: 'from-blue-600 via-cyan-600 to-teal-600' },
  { value: 'arts', label: 'Arts', gradient: 'from-violet-600 via-indigo-600 to-purple-600' },
  { value: 'nightlife', label: 'Nightlife', gradient: 'from-red-600 via-rose-600 to-pink-600' },
];

const suggestedTags = ['#Party', '#Networking', '#Free', '#Workshop', '#Outdoor', '#Family-Friendly'];

function EventForm({ onAddEvent, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    image: '',
    genre: '',
    tags: []
  });
  
  const [tagInput, setTagInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenreSelect = (genreValue) => {
    setFormData(prev => ({
      ...prev,
      genre: genreValue
    }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddSuggestedTag = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.description && formData.location && formData.date && formData.time && formData.genre) {
      onAddEvent(formData);
      setFormData({
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        image: '',
        genre: '',
        tags: []
      });
      setTagInput('');
      onClose();
    }
  };

  const isFormValid = formData.title && formData.description && formData.location && formData.date && formData.time && formData.genre;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-bold text-2xl text-[#2D3436]">Create New Event</h3>
        <button 
          type="button" 
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-[#FAFAFA] hover:bg-gray-100 flex items-center justify-center text-[#636E72] transition-all duration-200 ease-out active:scale-95"
        >
          ×
        </button>
      </div>
      
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-[#2D3436] mb-2">
          Event Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter event title"
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all duration-200"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-[#2D3436] mb-2">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="3"
          placeholder="Enter event description (1-2 sentences)"
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all duration-200 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-[#2D3436] mb-2">
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Enter location"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all duration-200"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-semibold text-[#2D3436] mb-2">
            Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all duration-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="time" className="block text-sm font-semibold text-[#2D3436] mb-2">
            Time *
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all duration-200"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-semibold text-[#2D3436] mb-2">
            Image URL (Optional)
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all duration-200"
          />
        </div>
      </div>

      {/* Genre Selection */}
      <div>
        <label className="block text-sm font-semibold text-[#2D3436] mb-3">
          Select Genre *
        </label>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre.value}
              type="button"
              onClick={() => handleGenreSelect(genre.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                formData.genre === genre.value
                  ? `bg-gradient-to-r ${genre.gradient} text-white shadow-lg scale-105`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {genre.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tags Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tags" className="block text-sm font-semibold text-[#2D3436] mb-2">
            Add Tags
          </label>
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Type and press Enter to add"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none transition-all duration-200"
          />
          
          {/* Suggested Tags */}
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Suggested:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddSuggestedTag(tag)}
                  disabled={formData.tags.includes(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                    formData.tags.includes(tag)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : `${getTagColor(tag)} hover:scale-105 cursor-pointer`
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tag Display */}
        <div>
          <label className="block text-sm font-semibold text-[#2D3436] mb-2">
            Selected Tags
          </label>
          <div className="min-h-[60px] p-3 rounded-2xl border border-gray-200 bg-gray-50">
            {formData.tags.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No tags added yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getTagColor(tag)}`}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:scale-110 transition-transform duration-200"
                      aria-label={`Remove ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button 
          type="button" 
          onClick={onClose}
          className="flex-1 px-6 py-3 rounded-full bg-[#FAFAFA] text-[#2D3436] font-semibold hover:bg-gray-100 transition-all duration-200 ease-out active:scale-95"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={!isFormValid}
          className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all duration-200 ease-out shadow-lg ${
            isFormValid
              ? 'bg-gradient-to-r from-[#6C5CE7] to-[#FF7675] text-white hover:scale-105 active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Create Event
        </button>
      </div>
    </form>
  );
}

export default EventForm;
