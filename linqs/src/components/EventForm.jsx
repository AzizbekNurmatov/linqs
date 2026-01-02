import { useState, useRef } from 'react';
import { Calendar, MapPin, X, Link as LinkIcon, Upload, Clock } from 'lucide-react';

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

function EventForm({ onAddEvent, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    meetingLink: '',
    date: '',
    time: '',
    image: '',
    tags: [],
    isOnline: false,
  });
  
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setFormData(prev => ({
          ...prev,
          image: result
        }));
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    } else {
      // Fallback to URL input
      const { value } = e.target;
      setFormData(prev => ({
        ...prev,
        image: value
      }));
      setImagePreview(value);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setFormData(prev => ({
          ...prev,
          image: result
        }));
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerClick = () => {
    fileInputRef.current?.click();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = formData.title && 
                    formData.date && 
                    formData.time && 
                    (formData.isOnline ? formData.meetingLink : formData.location);
    
    if (isValid) {
      onAddEvent(formData);
      setFormData({
        title: '',
        location: '',
        meetingLink: '',
        date: '',
        time: '',
        image: '',
        tags: [],
        isOnline: false,
      });
      setTagInput('');
      setImagePreview('');
      onClose();
    }
  };

  const isFormValid = formData.title && 
                      formData.date && 
                      formData.time && 
                      (formData.isOnline ? formData.meetingLink : formData.location);

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

      {/* Banner Image Upload - Drag and Drop */}
      <div 
        ref={dropZoneRef}
        className={`relative w-full h-[200px] mb-6 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 border-2 border-dashed ${
          isDragging 
            ? 'border-gray-900 bg-gray-50' 
            : imagePreview 
              ? 'border-transparent' 
              : 'border-gray-200 hover:border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBannerClick}
      >
        {imagePreview ? (
          <>
            <img 
              src={imagePreview} 
              alt="Banner preview" 
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
                  handleBannerClick();
                }}
              >
                Change Image
              </button>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
            <Upload className="w-10 h-10 text-gray-400 mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              {isDragging ? 'Drop image here' : 'Drag & drop banner image'}
            </p>
            <p className="text-xs text-gray-500">
              or click to upload
            </p>
          </div>
        )}
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
      
      {/* Title Section */}
      <div className="mb-6">
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Event Title"
          className="w-full text-2xl md:text-3xl font-bold bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400 focus:placeholder:text-gray-300"
        />
      </div>

      {/* Date & Time Picker */}
      <div className="mb-6 space-y-4">
        {/* Date Input */}
        <div 
          onClick={() => {
            dateInputRef.current?.showPicker?.() || dateInputRef.current?.click();
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 group cursor-pointer"
        >
          <Calendar className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 pointer-events-none" />
          <input
            ref={dateInputRef}
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        {/* Time Input */}
        <div 
          onClick={() => {
            timeInputRef.current?.showPicker?.() || timeInputRef.current?.click();
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 group cursor-pointer"
        >
          <Clock className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 pointer-events-none" />
          <input
            ref={timeInputRef}
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {/* Online Event Toggle & Location */}
      <div className="mb-6 space-y-4">
        {/* Online Event Toggle */}
        <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200">
          <label className="flex items-center gap-3 cursor-pointer flex-1">
            <span className="text-sm font-medium text-gray-700">Online Event</span>
          </label>
          <button
            type="button"
            onClick={() => {
              setFormData(prev => ({ 
                ...prev, 
                isOnline: !prev.isOnline,
                location: prev.isOnline ? prev.location : '',
                meetingLink: !prev.isOnline ? prev.meetingLink : ''
              }));
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
              formData.isOnline ? 'bg-gray-900' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                formData.isOnline ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Conditional Location Input */}
        {formData.isOnline ? (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 group">
            <LinkIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
            <input
              type="url"
              name="meetingLink"
              value={formData.meetingLink}
              onChange={handleChange}
              required
              placeholder="Meeting Link (e.g., https://zoom.us/j/...)"
              className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 group">
            <MapPin className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Physical Location"
              className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm"
            />
          </div>
        )}
      </div>

      {/* Tags Section */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 min-h-[48px]">
          {/* Display existing tags */}
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getTagColor(tag)}`}
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:opacity-70 transition-opacity"
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

      {/* Post Button */}
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
          Post
        </button>
      </div>
    </form>
  );
}

export default EventForm;
