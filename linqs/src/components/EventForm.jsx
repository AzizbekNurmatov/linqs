import { useState, useRef, useEffect } from 'react';
import { Calendar, MapPin, X, Link as LinkIcon, Upload, Clock, Plus, Coffee, Sparkles, Code, Briefcase, ChevronDown, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Custom minimalist SVG icons matching lucide-react style
const WellnessIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CultureIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <rect x="7" y="7" width="10" height="10" />
  </svg>
);

const FoodIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v0" />
    <path d="M21 15v7" />
  </svg>
);

// Category definitions
const categories = [
  { name: 'Social Activities', icon: Coffee, value: 'Social Activities' },
  { name: 'Hobbies', icon: Sparkles, value: 'Hobbies' },
  { name: 'Wellness', icon: WellnessIcon, value: 'Wellness' },
  { name: 'Tech', icon: Code, value: 'Tech' },
  { name: 'Business', icon: Briefcase, value: 'Business' },
  { name: 'Culture', icon: CultureIcon, value: 'Culture' },
  { name: 'Food', icon: FoodIcon, value: 'Food' },
];

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

function EventForm({ onAddEvent, onClose, communityId = null }) {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    meetingLink: '',
    date: '',
    endDate: '',
    time: '',
    endTime: '',
    image: '',
    tags: [],
    isOnline: false,
    category: 'Social Activities', // Default to Social
  });
  
  const [hasEndDate, setHasEndDate] = useState(false);
  const [hasEndTime, setHasEndTime] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdEventId, setCreatedEventId] = useState(null);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const dateInputRef = useRef(null);
  const endDateInputRef = useRef(null);
  const timeInputRef = useRef(null);
  const endTimeInputRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  // Close category dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
        setIsCategoryOpen(false);
      }
    };

    if (isCategoryOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isCategoryOpen]);

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
      // Store the file object for Supabase upload
      setImageFile(file);
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
      setImageFile(null);
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
      // Store the file object for Supabase upload
      setImageFile(file);
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

  // Format time for display (handles ranges)
  const formatTimeForDisplay = (startTime, endTime) => {
    if (!startTime) return '';
    
    const formatTime = (timeStr) => {
      if (!timeStr) return '';
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    const formattedStart = formatTime(startTime);
    if (endTime) {
      const formattedEnd = formatTime(endTime);
      return `${formattedStart} - ${formattedEnd}`;
    }
    return formattedStart;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = formData.title && 
                    formData.date && 
                    formData.time && 
                    (!hasEndDate || formData.endDate) &&
                    (!hasEndTime || formData.endTime) &&
                    (formData.isOnline ? formData.meetingLink : formData.location);
    
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      // Step A: Get Current User
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        alert('Please sign in to post');
        setIsSubmitting(false);
        return;
      }

      const userId = user.id;
      let imageUrl = null;

      // Step B: Handle Image Upload (If exists)
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `public/${userId}/${fileName}`;

        // Upload to event-banners bucket
        const { error: uploadError } = await supabase.storage
          .from('event-banners')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Image upload error:', uploadError);
          throw uploadError;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('event-banners')
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      } else if (formData.image && formData.image.startsWith('http')) {
        // If image is already a URL (not a file), use it directly
        imageUrl = formData.image;
      }

      // Step C: Insert Event Record
      const eventData = {
        user_id: userId,
        title: formData.title,
        start_date: formData.date,
        start_time: formData.time,
        end_date: hasEndDate && formData.endDate ? formData.endDate : null,
        end_time: hasEndTime && formData.endTime ? formData.endTime : null,
        category: formData.category,
        tags: formData.tags,
        is_online: formData.isOnline,
        location_link: formData.isOnline ? formData.meetingLink : null,
        address: !formData.isOnline ? formData.location : null,
        image_url: imageUrl,
        community_id: communityId, // Include community_id if provided
      };

      const { data: insertedData, error: insertError } = await supabase
        .from('events')
        .insert([eventData])
        .select();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        throw insertError;
      }

      // Step D: Success - Show success state
      const newEventId = insertedData?.[0]?.id;
      setCreatedEventId(newEventId);
      
      // Reset form
      setFormData({
        title: '',
        location: '',
        meetingLink: '',
        date: '',
        endDate: '',
        time: '',
        endTime: '',
        image: '',
        tags: [],
        isOnline: false,
        category: 'Social Activities',
      });
      setHasEndDate(false);
      setHasEndTime(false);
      setTagInput('');
      setImagePreview('');
      setImageFile(null);
      
      // Show success state
      setIsSuccess(true);
      
    } catch (error) {
      // Step D: Error Handling
      console.error('Error posting event:', error);
      alert(`Error posting event: ${error.message || 'Please try again'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.title && 
                      formData.date && 
                      formData.time && 
                      (!hasEndDate || formData.endDate) &&
                      (!hasEndTime || formData.endTime) &&
                      (formData.isOnline ? formData.meetingLink : formData.location);

  // Calculate min values for validation
  const getEndDateMin = () => {
    return formData.date || '';
  };

  const getEndTimeMin = () => {
    // If same day (no end date or end date equals start date), end time must be after start time
    if (!hasEndDate || formData.endDate === formData.date) {
      return formData.time || '';
    }
    // If different day, any time is valid
    return '';
  };

  // Success state UI
  if (isSuccess) {
    return (
      <div className="bg-white relative rounded-3xl p-12">
        {/* Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            type="button" 
            onClick={() => {
              setIsSuccess(false);
              setCreatedEventId(null);
              onClose();
              window.location.reload(); // Refresh to show new event
            }}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-600 transition-all duration-200 ease-out active:scale-95 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Content */}
        <div className="flex flex-col items-center justify-center text-center py-8">
          {/* Animated Checkmark */}
          <div className="mb-6">
            <CheckCircle2 className="w-20 h-20 text-green-500 animate-checkmark-in" />
          </div>
          
          {/* Success Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Your event is live!
          </h2>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <button
              type="button"
              onClick={() => {
                window.location.reload(); // Refresh to show new event
              }}
              className="flex-1 px-6 py-3 rounded-lg font-semibold bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] transition-all duration-200"
            >
              View My Event
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSuccess(false);
                setCreatedEventId(null);
                onClose();
                window.location.reload(); // Refresh to show new event
              }}
              className="flex-1 px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-[0.98] transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Date & Time Section - Context-Aware Layout */}
      <div className="mb-6 space-y-4">
        {hasEndDate ? (
          // Multi-Day Layout: Two rows with Date + Time side-by-side
          <>
            {/* Row 1: Start Date + Start Time */}
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => {
                  dateInputRef.current?.showPicker?.() || dateInputRef.current?.click();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 group cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 pointer-events-none" />
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Start Date</span>
                  <input
                    ref={dateInputRef}
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="flex-1 bg-transparent border-none outline-none text-gray-700 text-sm cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <div 
                onClick={() => {
                  timeInputRef.current?.showPicker?.() || timeInputRef.current?.click();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 group cursor-pointer"
              >
                <Clock className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 pointer-events-none" />
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Start Time</span>
                  <input
                    ref={timeInputRef}
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="flex-1 bg-transparent border-none outline-none text-gray-700 text-sm cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </div>

            {/* Row 2: End Date + End Time */}
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => {
                  endDateInputRef.current?.showPicker?.() || endDateInputRef.current?.click();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 group cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 pointer-events-none" />
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">End Date</span>
                  <input
                    ref={endDateInputRef}
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required={hasEndDate}
                    min={getEndDateMin()}
                    className="flex-1 bg-transparent border-none outline-none text-gray-700 text-sm cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setHasEndDate(false);
                    setFormData(prev => ({ ...prev, endDate: '' }));
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  aria-label="Remove end date"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div 
                onClick={() => {
                  if (hasEndTime) {
                    endTimeInputRef.current?.showPicker?.() || endTimeInputRef.current?.click();
                  }
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 group cursor-pointer"
              >
                <Clock className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 pointer-events-none" />
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">End Time</span>
                  {hasEndTime ? (
                    <>
                      <input
                        ref={endTimeInputRef}
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required={hasEndTime}
                        min={getEndTimeMin()}
                        className="flex-1 bg-transparent border-none outline-none text-gray-700 text-sm cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setHasEndTime(false);
                          setFormData(prev => ({ ...prev, endTime: '' }));
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                        aria-label="Remove end time"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setHasEndTime(true);
                      }}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add end time</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          // Single-Day Layout: Date on its own row, Time(s) on another row
          <>
            {/* Date Row */}
            <div className="flex items-center gap-2">
              <div 
                onClick={() => {
                  dateInputRef.current?.showPicker?.() || dateInputRef.current?.click();
                }}
                className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 group cursor-pointer"
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
              <button
                type="button"
                onClick={() => setHasEndDate(true)}
                className="flex items-center gap-1.5 px-3 py-3 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add end date</span>
              </button>
            </div>

            {/* Time Row */}
            <div className="flex items-center gap-2">
              <div 
                onClick={() => {
                  timeInputRef.current?.showPicker?.() || timeInputRef.current?.click();
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 group cursor-pointer ${
                  hasEndTime ? 'flex-1' : 'flex-1'
                }`}
              >
                <Clock className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 pointer-events-none" />
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Start Time</span>
                  <input
                    ref={timeInputRef}
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="flex-1 bg-transparent border-none outline-none text-gray-700 text-sm cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              {hasEndTime ? (
                <div 
                  onClick={() => {
                    endTimeInputRef.current?.showPicker?.() || endTimeInputRef.current?.click();
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 group cursor-pointer"
                >
                  <Clock className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 pointer-events-none" />
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">End Time</span>
                    <input
                      ref={endTimeInputRef}
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      required={hasEndTime}
                      min={getEndTimeMin()}
                      className="flex-1 bg-transparent border-none outline-none text-gray-700 text-sm cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setHasEndTime(false);
                      setFormData(prev => ({ ...prev, endTime: '' }));
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                    aria-label="Remove end time"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setHasEndTime(true)}
                  className="flex items-center gap-1.5 px-3 py-3 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add end time</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Online Event Toggle & Location - Clearly Separated */}
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

      {/* Category Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <div className="relative" ref={categoryDropdownRef}>
          <button
            type="button"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 bg-white"
          >
            <div className="flex items-center gap-3">
              {(() => {
                const selectedCategory = categories.find(cat => cat.value === formData.category);
                const IconComponent = selectedCategory?.icon || Coffee;
                return <IconComponent className="w-5 h-5 text-gray-600 flex-shrink-0" />;
              })()}
              <span className="text-sm text-gray-700">{formData.category}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isCategoryOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, category: category.value }));
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                      formData.category === category.value ? 'bg-blue-50' : ''
                    }`}
                  >
                    <IconComponent className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{category.name}</span>
                    {formData.category === category.value && (
                      <span className="ml-auto text-blue-600">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
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
            placeholder={formData.tags.length === 0 ? "Add a phrase or word to create a tag..." : ""}
            className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm min-w-[120px]"
          />
        </div>
      </div>

      {/* Post Button */}
      <div className="pt-6 border-t border-gray-200">
        <button 
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`w-full px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            isFormValid && !isSubmitting
              ? 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting && (
            <Loader2 className="w-5 h-5 animate-spin" />
          )}
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
}

export default EventForm;
