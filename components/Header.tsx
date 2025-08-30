
import React from 'react';
import { ShirtIcon } from './Icons';

export default function Header(): React.ReactElement {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <div className="bg-primary p-2 rounded-lg mr-4">
          <ShirtIcon className="w-8 h-8 text-white" />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-secondary">Virtual Try-On AI</h1>
            <p className="text-medium">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>
    </header>
  );
}
