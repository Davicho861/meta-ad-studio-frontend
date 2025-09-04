import React from 'react';

interface SceneCardProps {
  scene: { name: string; location: string; imageUrl: string };
  onSelect: (sceneName: string) => void;
}

export const SceneCard = ({ scene, onSelect }: SceneCardProps) => {
  return (
    <div
      onClick={() => onSelect(scene.name)}
      className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-accent-blue/20"
    >
      <img src={scene.imageUrl} alt={scene.name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-end">
        <h3 className="text-white font-bold text-lg">{scene.name}</h3>
        <p className="text-sm text-secondary-text">{scene.location}</p>
      </div>
      <div className="absolute inset-0 bg-accent-blue opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
    </div>
  );
};