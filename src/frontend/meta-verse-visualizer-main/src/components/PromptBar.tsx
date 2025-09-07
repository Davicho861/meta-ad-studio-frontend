import React from 'react';
import { Sparkles } from 'lucide-react';

interface PromptBarProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
}

export const PromptBar = ({ prompt, onPromptChange, onGenerate, isGenerating = false }: PromptBarProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative bg-surface-dark rounded-lg shadow-lg border border-accent-blue/20">
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="w-full p-4 pr-20 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue/50 transition-all duration-300 resize-none text-primary-text placeholder-secondary-text"
          placeholder="Describe el anuncio que quieres generar..."
          rows={3}
        />
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-accent-blue text-white font-bold rounded-lg hover:bg-accent-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generar
            </>
          )}
        </button>
      </div>
    </div>
  );
};