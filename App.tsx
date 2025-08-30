
import React, { useState, useCallback } from 'react';
import type { UploadedImage } from './types';
import { virtualTryOn } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import { ArrowRightIcon, SparklesIcon } from './components/Icons';

export default function App(): React.ReactElement {
  const [personImage, setPersonImage] = useState<UploadedImage | null>(null);
  const [clothingImage, setClothingImage] = useState<UploadedImage | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleVirtualTryOn = useCallback(async () => {
    if (!personImage || !clothingImage) {
      setError('Please upload both an image of a person and an image of the clothing.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);
    setResultText('');

    try {
      const result = await virtualTryOn(personImage, clothingImage);
      if (result.image) {
        setResultImage(`data:image/png;base64,${result.image}`);
      } else {
         setError('The AI could not generate an image. Please try different images.');
      }
      setResultText(result.text || '');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate image: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [personImage, clothingImage]);

  const isButtonDisabled = !personImage || !clothingImage || isLoading;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <ImageUploader
              id="person-uploader"
              label="Upload Person Image"
              onImageSelect={setPersonImage}
              onImageRemove={() => setPersonImage(null)}
            />
            <ImageUploader
              id="clothing-uploader"
              label="Upload Clothing Image"
              onImageSelect={setClothingImage}
              onImageRemove={() => setClothingImage(null)}
            />
          </div>

          <div className="text-center my-8">
            <button
              onClick={handleVirtualTryOn}
              disabled={isButtonDisabled}
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-bold rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:bg-primary-hover disabled:bg-primary-disabled disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105"
            >
              <SparklesIcon className="w-6 h-6 mr-3" />
              {isLoading ? 'Generating...' : 'Virtual Try-On'}
            </button>
          </div>
          
          {isLoading && <Loader />}

          {error && (
            <div className="mt-8 p-4 text-center bg-red-100 text-red-700 border border-red-200 rounded-lg">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}

          {resultImage && !isLoading && (
            <ResultDisplay image={resultImage} text={resultText} />
          )}

        </div>
      </main>
    </div>
  );
}
