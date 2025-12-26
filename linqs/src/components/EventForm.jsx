import { useState, useRef, useEffect } from 'react';
import { Calendar, MapPin, X } from 'lucide-react';

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

// Genre configuration
const genres = [
  { value: 'live-music', label: 'Music' },
  { value: 'tech', label: 'Tech' },
  { value: 'food', label: 'Food' },
  { value: 'sports', label: 'Sports' },
  { value: 'arts', label: 'Arts' },
  { value: 'nightlife', label: 'Nightlife' },
];

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
  const [imagePreview, setImagePreview] = useState('');
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [formData.description]);

  const handleImageChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      image: value
    }));
    setImagePreview(value);
  };

  const handleImageClick = () => {
    // Focus on image input (we'll use a hidden input)
    const imageInput = document.getElementById('image-input');
    if (imageInput) {
      imageInput.focus();
      imageInput.select();
    }
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
      setImagePreview('');
      onClose();
    }
  };

  const isFormValid = formData.title && formData.description && formData.location && formData.date && formData.time && formData.genre;

  return (
    <form onSubmit={handleSubmit} className="bg-white relative">
      {/* Cover Image Section */}
      <div 
        className="relative w-full h-[200px] mb-6 rounded-t-2xl overflow-hidden cursor-pointer group"
        onClick={handleImageClick}
      >
        {imagePreview ? (
          <>
            <img 
              src={imagePreview} 
              alt="Cover preview" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
              <button
                type="button"
                className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-semibold text-gray-900 transition-opacity duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick();
                }}
              >
                Change
              </button>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div 
              className="w-full h-full opacity-30"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)`,
              }}
            />
            <button
              type="button"
              className="absolute px-6 py-3 bg-white rounded-lg text-sm font-semibold text-gray-700 shadow-md hover:bg-gray-50 transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
                handleImageClick();
              }}
            >
              Add Cover Image
            </button>
          </div>
        )}
        {/* Hidden image input */}
        <input
          type="url"
          id="image-input"
          name="image"
          value={formData.image}
          onChange={handleImageChange}
          placeholder="https://example.com/image.jpg"
          className="absolute opacity-0 pointer-events-none"
        />
      </div>

      {/* Close Button */}
      <div className="absolute top-4 right-4">
        <button 
          type="button" 
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-600 transition-all duration-200 ease-out active:scale-95 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Title Section - Huge Header */}
      <div className="mb-8">
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Event Name"
          className="w-full text-3xl font-bold bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400 focus:placeholder:text-gray-300"
        />
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Date & Time Combined */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-transparent hover:bg-gray-50 transition-colors duration-200 group">
          <Calendar className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          <div className="flex-1 flex gap-2">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm"
            />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm"
            />
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-transparent hover:bg-gray-50 transition-colors duration-200 group">
          <MapPin className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Location"
            className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm"
          />
        </div>
      </div>

      {/* Description Section - Auto-expanding */}
      <div className="mb-8">
        <textarea
          ref={textareaRef}
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Describe your event..."
          className="w-full bg-transparent border-none outline-none text-gray-600 placeholder:text-gray-400 resize-none overflow-hidden min-h-[100px]"
        />
      </div>

      {/* Genre Selection - Pills */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre.value}
              type="button"
              onClick={() => handleGenreSelect(genre.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                formData.genre === genre.value
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {genre.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tags Section - Inline Badges */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 rounded-lg bg-transparent hover:bg-gray-50 transition-colors duration-200 min-h-[48px]">
          {/* Display existing tags */}
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-gray-900 transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {/* Tag Input */}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder={formData.tags.length === 0 ? "Add tags..." : ""}
            className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm min-w-[120px]"
          />
        </div>
      </div>

      {/* Footer - Full Width Button */}
      <div className="pt-6 border-t border-gray-200">
        <button 
          type="submit"
          disabled={!isFormValid}
          className={`w-full px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
            isFormValid
              ? 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Create Event
        </button>
      </div>
    </form>
  );
}

export default EventForm;
