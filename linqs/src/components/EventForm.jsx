import { useState } from 'react';

function EventForm({ onAddEvent, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.description && formData.location && formData.date && formData.time) {
      onAddEvent(formData);
      setFormData({
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        image: ''
      });
      onClose();
    }
  };

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
          className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#FF7675] text-white font-semibold hover:scale-105 active:scale-95 transition-all duration-200 ease-out shadow-lg"
        >
          Create Event
        </button>
      </div>
    </form>
  );
}

export default EventForm;
