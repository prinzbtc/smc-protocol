'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import ImageDebug from './ImageDebug';

interface ThumbnailUploadProps {
  initialUrl?: string;
  onImageChange: (url: string) => void;
  contentType: 'article' | 'report';
}

const ThumbnailUpload: React.FC<ThumbnailUploadProps> = ({ initialUrl, onImageChange, contentType }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(initialUrl || '');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, or WEBP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);

      // Log for debugging
      console.log('Uploading file:', file.name, file.type, file.size);

      // Upload the file to our API endpoint
      const response = await fetch(`/api/upload?type=${contentType}`, {
        method: 'POST',
        body: formData,
      });

      // Log the response status
      console.log('Upload response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload error response:', errorData);
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      console.log('Upload success response:', data);
      const imageUrl = data.url;
      
      // Update the state and notify parent component
      setThumbnailUrl(imageUrl);
      onImageChange(imageUrl);
      setIsUploading(false);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Failed to upload image');
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setThumbnailUrl('');
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-bold">
        Thumbnail Image
      </label>
      
      <div className="mb-2">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="thumbnail-upload"
        />
        <label 
          htmlFor="thumbnail-upload" 
          className="btn-primary cursor-pointer inline-block"
        >
          {thumbnailUrl ? 'Change Image' : 'Upload Image'}
        </label>
        
        {thumbnailUrl && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="ml-2 text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        )}
      </div>
      
      {isUploading && (
        <div className="mb-2">
          <p>Uploading...</p>
        </div>
      )}
      
      {error && (
        <div className="mb-2">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {thumbnailUrl && (
        <div className="mb-2 border border-gray-200 p-2 inline-block">
          <img 
            src={thumbnailUrl} 
            alt="Thumbnail preview" 
            width={200} 
            height={150} 
            className="object-cover w-[200px] h-[150px]"
            onError={(e) => {
              console.error('Image failed to load:', thumbnailUrl);
              e.currentTarget.src = '/placeholder-image.png';
            }}
          />
          <p className="text-sm text-gray-500 mt-1">Thumbnail Preview</p>
          <p className="text-xs text-gray-400 break-all">{thumbnailUrl}</p>
        </div>
      )}
      
      <p className="text-sm mt-1">
        Upload a thumbnail image for this content. Recommended size: 1200x630 pixels.
      </p>
    </div>
  );
};

export default ThumbnailUpload;
