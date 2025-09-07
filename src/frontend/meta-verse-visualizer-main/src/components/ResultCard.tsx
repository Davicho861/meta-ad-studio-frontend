import React from 'react';
import { Download, RotateCcw, Wand2 } from 'lucide-react';

interface ResultCardProps {
  imageUrl: string;
  prompt: string;
  isLoading?: boolean;
}

export const ResultCard = ({ imageUrl, prompt, isLoading = false }: ResultCardProps) => {
  if (isLoading) {
    return (
      <div className="group relative rounded-lg overflow-hidden bg-surface-dark border border-accent-blue/20">
        <div className="aspect-square bg-surface-dark animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="p-3">
          <div className="h-4 bg-secondary-text/20 rounded animate-pulse mb-2"></div>
          <div className="h-3 bg-secondary-text/10 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative rounded-lg overflow-hidden bg-surface-dark border border-accent-blue/20 hover:border-accent-blue/50 transition-all duration-300">
      <div className="aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={prompt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Overlay que aparece al hacer hover */}
      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-secondary-text text-center line-clamp-3">{prompt}</p>
        </div>

        <div className="flex gap-2 justify-center">
          <button className="p-2 bg-accent-purple/80 hover:bg-accent-purple text-white rounded-lg transition-colors">
            <Wand2 className="w-4 h-4" />
          </button>
          <button className="p-2 bg-accent-blue/80 hover:bg-accent-blue text-white rounded-lg transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button className="p-2 bg-secondary-text/80 hover:bg-secondary-text text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};