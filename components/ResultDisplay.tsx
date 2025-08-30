
import React from 'react';
import { ImageIcon } from './Icons';

interface ResultDisplayProps {
  image: string | null;
  text: string;
}

export default function ResultDisplay({ image, text }: ResultDisplayProps): React.ReactElement {
  return (
    <div className="mt-12 bg-white p-6 rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-secondary mb-6 flex items-center justify-center">
        <ImageIcon className="w-8 h-8 mr-3 text-primary" />
        Generated Image
      </h2>
      <div className="w-full max-w-lg mx-auto aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
        {image ? (
          <img src={image} alt="Generated virtual try-on" className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <p>No image generated.</p>
          </div>
        )}
      </div>
      {text && (
         <div className="mt-6 text-center text-gray-600 bg-gray-50 p-4 rounded-lg">
            <p>{text}</p>
         </div>
      )}
    </div>
  );
}
