import React from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp } from "lucide-react";

interface GalleryPreviewProps {
  preview: {
    id: number;
    title: string;
    description: string;
    image: string;
    engagement: string;
    location: string;
  };
  onClick: () => void;
}

export const GalleryPreview: React.FC<GalleryPreviewProps> = ({ preview, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer bg-card rounded-lg overflow-hidden border border-border/50 hover:border-silver/30 transition-all duration-300 hover:shadow-card hover:shadow-executive-blue/10"
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={preview.image} 
          alt={preview.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge className="bg-executive-blue/90 text-white text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            {preview.engagement}
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-1 text-xs text-silver/80">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{preview.location}</span>
          </div>
        </div>
      </div>
      <div className="p-3 space-y-2">
        <h4 className="font-medium text-sm text-silver group-hover:text-gold transition-colors leading-tight">
          {preview.title}
        </h4>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {preview.description}
        </p>
      </div>
    </div>
  );
};