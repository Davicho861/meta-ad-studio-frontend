import React from 'react';
import { InspirationCard } from './InspirationCard';

interface InspirationCarouselProps {
  onPromptClick: (prompt: string) => void;
  examples: Array<{ id: number; title: string; location: string; imageUrl: string; prompt: string }>;
}

export const InspirationCarousel = ({ onPromptClick, examples }: InspirationCarouselProps) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-4 text-secondary-text">¿Necesitas inspiración?</h3>
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-surface-dark scrollbar-track-transparent">
      {examples.map(item => (
        <InspirationCard key={item.id} item={item} onPromptClick={onPromptClick} />
      ))}
    </div>
  </div>
);