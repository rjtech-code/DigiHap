import React, { useRef, useState } from 'react';

/**
 * ImageUploader Component
 * Handles profile image upload with preview and validation
 */
const ImageUploader = ({ 
  currentImage, 
  onImageSelect, 
  onImageRemove, 
  disabled = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(currentImage || null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file) => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return 'Invalid file type. Please upload JPG, PNG, or WEBP images only';
    }

    // Check file size
    if (file.size > maxSize) {
      return `Image size should be less than ${maxSize / (1024 * 1024)}MB`;
    }

    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onImageSelect?.(file, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onImageSelect?.(file, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageRemove?.();
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
      >
        {preview ? (
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-green-500 shadow-lg"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                  aria-label="Remove image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600 font-medium">Click or drag to replace image</p>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP (Max {maxSize / (1024 * 1024)}MB)</p>
          </div>
        ) : (
          <div className="py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              {isDragging ? 'Drop your image here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500">JPG, PNG, WEBP (Max {maxSize / (1024 * 1024)}MB)</p>
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;