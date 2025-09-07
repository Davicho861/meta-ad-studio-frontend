import React from 'react';
import { scenes } from '../data/scenes';
import { SceneCard } from './SceneCard';

interface SceneSelectorProps {
  onSceneSelect: (sceneName: string) => void;
}

export const SceneSelector = ({ onSceneSelect }: SceneSelectorProps) => {
  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-4 text-primary-text">O elige un escenario como punto de partida</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {scenes.map(scene => (
          <SceneCard key={scene.id} scene={scene} onSelect={onSceneSelect} />
        ))}
      </div>
    </div>
  );
};