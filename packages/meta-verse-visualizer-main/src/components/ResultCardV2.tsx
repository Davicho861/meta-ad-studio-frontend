import React from 'react';
import { Download, RotateCcw, Wand2 } from 'lucide-react';

interface ResultCardProps {
  result: { imageUrl?: string; prompt: string; isLoading: boolean; progress: number };
}

export const ResultCardV2 = ({ result }: ResultCardProps) => {
  if (result.isLoading) {
    return (
      <div className="relative rounded-lg aspect-square bg-surface-dark flex flex-col items-center justify-center text-center p-4 animate-pulse">
        <div className="w-full h-full bg-gray-700/50 absolute inset-0 filter blur-md"></div>
        <p className="text-sm text-secondary-text z-10">{result.prompt.substring(0, 40)}...</p>
        <div className="w-full bg-gray-600 rounded-full h-2.5 mt-4 z-10">
          <div className="bg-accent-blue h-2.5 rounded-full" style={{ width: `${result.progress}%` }}></div>
        </div>
        <p className="text-accent-blue font-mono mt-2 z-10">{result.progress}%</p>
      </div>
    );
  }

  return (
    <div className="group relative rounded-lg overflow-hidden aspect-square">
      <img src={result.imageUrl} alt={result.prompt} className="w-full h-full object-cover" />
      {/* Overlay que aparece al hacer hover */}
      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-secondary-text text-center line-clamp-3">{result.prompt}</p>
        </div>

        <div className="flex gap-2 justify-center">
          <button className="p-2 bg-accent-purple/80 hover:bg-accent-purple text-white rounded-lg transition-colors">
            <Wand2 className="w-4 h-4" />
          </button>
          <button
            className="p-2 bg-accent-green/80 hover:bg-accent-green text-white rounded-lg transition-colors"
            onClick={() => {
              // onClick vacío por ahora — Sprint 1 implementará la navegación/props
            }}
            title="Visualizar en Escenario 3D"
          >
            {/* Icono simple: usar Wand2 como placeholder o reemplazar por otro */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2v4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 9l14-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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