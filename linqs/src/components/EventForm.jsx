import { useState, useRef, useEffect } from 'react';
import { Calendar, MapPin, X, ChevronDown, ChevronUp, Users, ExternalLink, Eye, EyeOff } from 'lucide-react';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    image: '',
    genre: '',
    tags: [],
    capacity: '',
    externalLink: '',
    visibility: 'public', // 'public' | 'private'
    isOnline: false,
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
    // Basic validation for quick mode
    const basicValid = formData.title && formData.date && formData.time && (formData.location || formData.isOnline);
    
    // Advanced validation only if expanded
    const advancedValid = !isExpanded || true; // Advanced fields are optional
    
    if (basicValid && advancedValid) {
      onAddEvent(formData);
      setFormData({
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        image: '',
        genre: '',
        tags: [],
        capacity: '',
        externalLink: '',
        visibility: 'public',
        isOnline: false,
      });
      setTagInput('');
      setImagePreview('');
      setIsExpanded(false);
      onClose();
    }
  };

  // Conditional validation: only basic fields required in quick mode
  const isFormValid = formData.title && formData.date && formData.time && (formData.location || formData.isOnline);

  return (
    <form onSubmit={handleSubmit} className="bg-white relative">
      {/* Close Button */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          type="button" 
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-600 transition-all duration-200 ease-out active:scale-95 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Cover Image Section - Only show when expanded */}
      {isExpanded && (
        <div 
          className="relative w-full h-[200px] mb-6 rounded-t-2xl overflow-hidden cursor-pointer group transition-all duration-300"
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
      )}
      
      {/* Title Section */}
      <div className="mb-6">
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Event Name"
          className="w-full text-2xl md:text-3xl font-bold bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400 focus:placeholder:text-gray-300"
        />
        <p className="text-sm text-gray-500 mt-2">
          Study group, casual run, coffee meetup…
        </p>
      </div>

      {/* Metadata Grid - Quick Mode */}
      <div className="space-y-4 mb-6">
        {/* Date & Time */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 group">
          <Calendar className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
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

        {/* Location or Online */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 group">
          <MapPin className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required={!formData.isOnline}
            disabled={formData.isOnline}
            placeholder={formData.isOnline ? "Online event" : "Location"}
            className={`flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm ${formData.isOnline ? 'opacity-50' : ''}`}
          />
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isOnline}
              onChange={(e) => setFormData(prev => ({ ...prev, isOnline: e.target.checked, location: e.target.checked ? 'Online' : '' }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span>Online</span>
          </label>
        </div>
      </div>

      {/* Tags Section - Quick Mode (Optional) */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 min-h-[48px]">
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
            placeholder={formData.tags.length === 0 ? "Add tags (optional)..." : ""}
            className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm min-w-[120px]"
          />
        </div>
      </div>

      {/* Expand/Collapse Toggle */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Add more details
            </>
          )}
        </button>
      </div>

      {/* Advanced Fields - Only show when expanded */}
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="space-y-6 mb-6">
          {/* Description Section - Auto-expanding */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              ref={textareaRef}
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event in detail..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-600 placeholder:text-gray-400 resize-none overflow-hidden min-h-[100px] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Attendees (Optional)</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <Users className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="No limit"
                min="1"
                className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm"
              />
            </div>
          </div>

          {/* External Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">External Link (Optional)</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="url"
                name="externalLink"
                value={formData.externalLink}
                onChange={handleChange}
                placeholder="https://example.com"
                className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm"
              />
            </div>
          </div>

          {/* Visibility Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, visibility: 'public' }))}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                  formData.visibility === 'public'
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Public</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, visibility: 'private' }))}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                  formData.visibility === 'private'
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <EyeOff className="w-4 h-4" />
                <span className="text-sm font-medium">Private</span>
              </button>
            </div>
          </div>
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
          {isExpanded ? 'Publish Event' : 'Post Hangout'}
        </button>
      </div>
    </form>
  );
}

export default EventForm;
