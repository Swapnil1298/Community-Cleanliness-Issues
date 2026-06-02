import React, { useEffect, useRef, useState } from 'react';
import { FiCamera, FiUpload, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ImageUpload = ({ onImageSelect, label = "Upload Image", previewImage = null, accepting = 'image/*', openCameraOnMount = false }) => {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [preview, setPreview] = useState(previewImage);
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (openCameraOnMount && cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  }, [openCameraOnMount]);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await processImage(file);
    }
  };

  const handleCameraCapture = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await processImage(file);
    }
  };

  const processImage = async (file) => {
    setIsLoading(true);
    try {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Call the callback with the file
      onImageSelect(file);
      toast.success('Image selected successfully!');
      setShowOptions(false);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Error processing image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearImage = () => {
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
        <FiUpload size={16} className="text-indigo-600 dark:text-indigo-400" />
        {label}
      </label>

      {/* Preview */}
      {preview ? (
        <div className="relative mb-4 rounded-lg overflow-hidden border-2 border-green-500 dark:border-green-600">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiUpload size={18} />
              Change
            </button>
            <button
              type="button"
              onClick={handleClearImage}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FiX size={18} />
              Remove
            </button>
          </div>
          <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full">
            <FiCheck size={18} />
          </div>
        </div>
      ) : (
        <div
          className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-300"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3 py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Processing image...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 py-8">
              <FiUpload size={24} className="text-gray-400" />
              <span className="text-gray-500">No image selected</span>
            </div>
          )}
        </div>
      )}

      {/* Upload Options */}
      <div className="mt-4 flex gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiUpload size={18} />
          Choose from File
        </button>

        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiCamera size={18} />
          Take Photo
        </button>

        {preview && (
          <button
            type="button"
            onClick={handleClearImage}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiX size={18} />
            Clear
          </button>
        )}
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accepting}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isLoading}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraCapture}
        className="hidden"
        disabled={isLoading}
      />

      {/* Help Text */}
      <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
        Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB
      </p>
    </div>
  );
};

export default ImageUpload;
