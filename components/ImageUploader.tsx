
import React, { useRef, useState, useCallback, ChangeEvent } from 'react';
import type { UploadedImage } from '../types';
import { UploadIcon, XCircleIcon } from './Icons';

interface ImageUploaderProps {
  id: string;
  label: string;
  onImageSelect: (image: UploadedImage) => void;
  onImageRemove: () => void;
}

const fileToBase64 = (file: File): Promise<UploadedImage> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      if (base64) {
        resolve({ base64, mimeType: file.type });
      } else {
        reject(new Error('Failed to convert file to base64.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function ImageUploader({ id, label, onImageSelect, onImageRemove }: ImageUploaderProps): React.ReactElement {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const uploadedImage = await fileToBase64(file);
        onImageSelect(uploadedImage);
        setImagePreview(URL.createObjectURL(file));
      } catch (error) {
        console.error("Error processing file:", error);
        // Optionally, show an error to the user
      }
    }
  }, [onImageSelect]);

  const handleRemoveImage = useCallback(() => {
    onImageRemove();
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
  }, [onImageRemove]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
       const mockEvent = { target: { files: [file] } } as unknown as ChangeEvent<HTMLInputElement>;
       handleFileChange(mockEvent);
    }
  }, [handleFileChange]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-center text-secondary mb-4">{label}</h2>
      <div
        className="relative w-full aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 cursor-pointer hover:border-primary hover:bg-indigo-50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          id={id}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        {imagePreview ? (
          <>
            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              className="absolute top-2 right-2 p-1 bg-white rounded-full text-gray-600 hover:bg-red-500 hover:text-white transition-all"
              aria-label="Remove image"
            >
              <XCircleIcon className="w-8 h-8" />
            </button>
          </>
        ) : (
          <div className="text-center">
            <UploadIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="font-semibold">Click or drag & drop to upload</p>
            <p className="text-sm">PNG, JPG, WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
}
