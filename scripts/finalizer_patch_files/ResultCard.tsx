import React from 'react';
import { Download, RotateCcw, Wand2 } from 'lucide-react';
import ActionIcon from './ui/ActionIcon';
import '../styles/blur-up.css';

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
          <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin-slow"></div>
        </div>
        <div className="p-6">
          <div className="h-4 bg-secondary-text/20 rounded animate-pulse mb-3"></div>
          <div className="h-3 bg-secondary-text/10 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div tabIndex={0} className="group relative rounded-lg overflow-hidden bg-surface-dark border border-accent-blue/20 hover:border-accent-blue/50 transition-all duration-350 ease-in-out-custom focus-within:ring-2 focus-within:ring-accent-blue/50">
      <div className="aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={prompt}
          loading="lazy"
          data-loaded={false}
          onLoad={(e) => {
            const t = e.currentTarget
            t.setAttribute('data-loaded', 'true')
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350 ease-in-out-custom motion-reduce:transition-none motion-reduce:transform-none blur-up"
        />
      </div>

      {/* Overlay que aparece al hacer hover */}
      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-350 ease-in-out-custom motion-reduce:transition-none flex flex-col justify-between p-6 focus-within:opacity-100">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-secondary-text text-center line-clamp-3 font-medium">{prompt}</p>
        </div>

        <div className="flex gap-3 justify-center">
          <ActionIcon label="Reintentar" className="p-2 bg-accent-purple/80 hover:bg-accent-purple text-white rounded-lg transition-colors">
            <Wand2 className="w-4 h-4" />
          </ActionIcon>
          <ActionIcon label="Rotar" className="p-2 bg-accent-blue/80 hover:bg-accent-blue text-white rounded-lg transition-colors">
            <RotateCcw className="w-4 h-4" />
          </ActionIcon>
          <ActionIcon label="Descargar" className="p-2 bg-secondary-text/80 hover:bg-secondary-text text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
          </ActionIcon>
        </div>
      </div>
    </div>
  );
};
