import { useState } from 'react';
import { FaImage, FaCloudUploadAlt, FaTimesCircle } from 'react-icons/fa';

/**
 * A placeholder component for future image upload functionality.
 * Currently, it just shows a UI for selecting images but doesn't actually upload them.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onImageSelect - Function called when an image is selected (simulates selection)
 * @param {string} props.imageUrl - Optional URL for a placeholder image
 * @param {string} props.label - Label for the image upload area
 * @param {boolean} props.required - Whether the image is required
 * @param {string} props.className - Additional CSS classes
 */
const ImageUploadPlaceholder = ({ 
  onImageSelect = () => {}, 
  imageUrl = null, 
  label = 'Upload Image',
  required = false,
  className = ''
}) => {
  const [previewUrl, setPreviewUrl] = useState(imageUrl);
  const [isDragging, setIsDragging] = useState(false);
  
  // Simulate file selection from filesystem
  const handleFileSelect = (e) => {
    e.preventDefault();
    
    // In a real implementation, this would handle file upload
    // For now, we'll just simulate the selection with a placeholder image
    const placeholderImageUrl = 'https://via.placeholder.com/300x200/f2f2f2/cccccc?text=Image+Placeholder';
    setPreviewUrl(placeholderImageUrl);
    
    // Call the callback with a simulated file object
    onImageSelect({
      name: 'placeholder-image.jpg',
      size: 12345,
      type: 'image/jpeg',
      url: placeholderImageUrl
    });
  };
  
  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e);
  };
  
  // Remove the preview image
  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageSelect(null);
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-gray-700 text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {!previewUrl ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-44 transition-colors ${
            isDragging ? 'border-primary bg-primary bg-opacity-10' : 'border-gray-300 hover:border-primary'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleFileSelect}
        >
          <FaCloudUploadAlt className="text-4xl text-gray-400 mb-3" />
          <p className="text-sm text-gray-500 text-center mb-2">
            Drag and drop an image here, or click to select
          </p>
          <p className="text-xs text-gray-400 text-center">
            (This is a placeholder - no actual upload will occur)
          </p>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-44 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-white rounded-full p-1 text-red-500 hover:text-red-700 focus:outline-none"
            aria-label="Remove image"
          >
            <FaTimesCircle className="text-xl" />
          </button>
        </div>
      )}
      
      <p className="mt-1 text-xs text-gray-500">
        Note: Images are optional and can be added later. This is a placeholder for future functionality.
      </p>
    </div>
  );
};

export default ImageUploadPlaceholder; 