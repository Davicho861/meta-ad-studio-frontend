import React, { useState, useRef } from 'react';
import { PromptBarV2 } from './PromptBarV2';
import { InspirationCarousel } from './InspirationCarousel';
import { SceneSelector } from './SceneSelector';
import { GenerationGrid } from './GenerationGrid';

interface GenerationResult {
  id: number;
  imageUrl?: string;
  prompt: string;
  isLoading: boolean;
  progress: number;
}

interface MainContentProps {
  inspirationData: Array<{ id: number; title: string; location: string; imageUrl: string; prompt: string }>;
  isLoading: boolean;
}

const TabButton = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={`px-4 py-2 font-semibold rounded-md transition-colors ${active ? 'bg-surface-dark text-primary-text' : 'text-secondary-text hover:bg-surface-dark/50'}`}>
    {label}
  </button>
);

export const MainContent = ({ inspirationData, isLoading }: MainContentProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [activeTab, setActiveTab] = useState('inspiracion');
  const promptTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePromptClick = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSceneSelect = (sceneName: string) => {
    setPrompt(`Un anuncio en ${sceneName} sobre `);
    promptTextareaRef.current?.focus();
  };

  const handleGenerate = () => {
    if (!prompt) return;
    setIsGenerating(true);
    const newResult: GenerationResult = {
      id: Date.now(),
      prompt,
      isLoading: true,
      progress: 0,
    };
    setResults(prev => [newResult, ...prev]);

    // Simular progreso
    const interval = setInterval(() => {
      setResults(prev =>
        prev.map(result =>
          result.id === newResult.id && result.progress < 100
            ? { ...result, progress: result.progress + 10 }
            : result
        )
      );
    }, 300);

    // Simular finalización
    setTimeout(() => {
      clearInterval(interval);
      setResults(prev =>
        prev.map(result =>
          result.id === newResult.id
            ? { ...result, isLoading: false, imageUrl: '/assets/generated-image.jpg' } // Placeholder
            : result
        )
      );
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-2">Generador de Publicidad para el Metaverso</h2>
      <p className="text-secondary-text mb-8">Usa un prompt o inspírate en la galería para crear tu próxima gran campaña.</p>

      <div className="mt-8">
        <PromptBarV2
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      </div>

      <div className="mt-12">
        <div className="flex gap-4 border-b border-surface-dark mb-6">
          <TabButton label="Galería de Inspiración" active={activeTab === 'inspiracion'} onClick={() => setActiveTab('inspiracion')} />
          <TabButton label="Mis Generaciones" active={activeTab === 'generaciones'} onClick={() => setActiveTab('generaciones')} />
        </div>

        {activeTab === 'inspiracion' && (
          <div>
            {isLoading ? <div>Cargando inspiración...</div> : <InspirationCarousel onPromptClick={handlePromptClick} examples={inspirationData} />}
            <SceneSelector onSceneSelect={handleSceneSelect} />
          </div>
        )}
        {activeTab === 'generaciones' && <GenerationGrid results={results} isGenerating={isGenerating} />}
      </div>
    </div>
  );
};