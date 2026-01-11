import { useState, useRef, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

function AddMediaModal({ isOpen, onClose, communityId, onUploadSuccess }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Clean up preview URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFiles([]);
      setPreviewUrls([]);
      setIsUploading(false);
    }
  }, [isOpen]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Filter only image files
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast.error('Please select only image files');
    }

    if (imageFiles.length > 0) {
      const newFiles = [...selectedFiles, ...imageFiles];
      setSelectedFiles(newFiles);

      // Create preview URLs for all files
      const newPreviewUrls = imageFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  const handleRemoveFile = (index) => {
    // Revoke the preview URL
    if (previewUrls[index]?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrls[index]);
    }

    // Remove from both arrays
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);

    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setIsUploading(true);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error('Please sign in to upload photos');
        setIsUploading(false);
        return;
      }

      // Loop through each file
      for (let index = 0; index < selectedFiles.length; index++) {
        const file = selectedFiles[index];
        try {
          // Generate unique file path
          const filePath = `${communityId}/${Date.now()}_${index}_${file.name}`;

          // Upload to Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from('community-content')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('Upload error:', uploadError);
            toast.error(`Failed to upload ${file.name}`);
            continue;
          }

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('community-content')
            .getPublicUrl(filePath);

          const publicUrl = urlData.publicUrl;

          // Insert into database
          const { error: insertError } = await supabase
            .from('community_media')
            .insert({
              community_id: communityId,
              user_id: user.id,
              image_url: publicUrl
            });

          if (insertError) {
            console.error('Insert error:', insertError);
            toast.error(`Failed to save ${file.name}`);
            continue;
          }
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          toast.error(`Failed to process ${file.name}`);
        }
      }

      // Success - refresh the gallery
      toast.success('Photos uploaded successfully!');
      
      // Clean up preview URLs
      previewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });

      // Reset state
      setSelectedFiles([]);
      setPreviewUrls([]);

      // Call success callback
      if (onUploadSuccess) {
        await onUploadSuccess();
      }

      // Close modal
      onClose();
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('Failed to upload photos');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add Photos</h2>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Upload Box - Always First */}
          <button
            type="button"
            onClick={handleUploadClick}
            disabled={isUploading}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Add Pictures</span>
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Preview Images */}
          {previewUrls.map((previewUrl, index) => (
            <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-200 relative group">
              <img
                src={previewUrl}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                disabled={isUploading}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center text-white transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-6 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || isUploading}
            className={`px-6 py-2 rounded-lg font-medium text-white transition-all duration-200 flex items-center gap-2 ${
              selectedFiles.length > 0 && !isUploading
                ? 'bg-black hover:bg-gray-800'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isUploading ? 'Uploading...' : 'Upload Photos'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddMediaModal;

