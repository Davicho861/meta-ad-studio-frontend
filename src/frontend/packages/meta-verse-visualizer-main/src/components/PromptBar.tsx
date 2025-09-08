import React from 'react';
import { Sparkles } from 'lucide-react';
import VisuallyHidden from './ui/VisuallyHidden.tsx';

interface PromptBarProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
}

export const PromptBar = ({ prompt, onPromptChange, onGenerate, isGenerating = false }: PromptBarProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative bg-surface-dark rounded-lg shadow-lg border border-accent-blue/20" role="region" aria-label="Barra de prompt">
        <label htmlFor="prompt-input">
          <VisuallyHidden>Prompt de generación</VisuallyHidden>
        </label>
        <textarea
          id="prompt-input"
          aria-label="Texto de prompt"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="w-full p-4 pr-20 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50 transition-all duration-300 resize-none text-primary-text placeholder-secondary-text"
          placeholder="Describe el anuncio que quieres generar..."
          rows={3}
        />
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          aria-pressed={isGenerating}
          className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-accent-blue text-white font-bold rounded-lg hover:bg-accent-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin motion-reduce:animate-none" />
              <span>Generando...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generar</span>
            </>
          )}
        </button>

        {/* Screen-reader status for generation */}
        <div aria-live="polite" role="status" className="sr-only">
          {isGenerating ? 'Generación en progreso' : 'Listo'}
        </div>
      </div>
    </div>
  );
};