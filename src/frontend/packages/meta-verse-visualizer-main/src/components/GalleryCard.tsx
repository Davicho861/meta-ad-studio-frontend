import React from 'react';
import toast from 'react-hot-toast';

interface GalleryCardProps {
  item: { title: string; imageUrl: string; prompt: string; location: string };
  onPromptClick: (prompt: string) => void;
}

export const GalleryCard = ({ item, onPromptClick }: GalleryCardProps) => {
  const handleUsePrompt = () => {
    onPromptClick(item.prompt);
    toast.success('¡Prompt copiado a la barra de creación!');
  };

  return (
    <div className="group relative rounded-lg overflow-hidden cursor-pointer">
      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
        <h3 className="font-bold text-white">{item.title}</h3>
        <p className="text-sm text-secondary-text mb-1">{item.location}</p>
        <p className="text-sm text-secondary-text mb-2">{item.prompt}</p>
        <button
          onClick={handleUsePrompt}
          className="text-sm bg-accent-blue text-white px-3 py-1 rounded-full self-start hover:bg-opacity-80 transition-colors"
        >
          Usar este prompt
        </button>
      </div>
    </div>
  );
};