import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Import Button component
import { MapPin, TrendingUp, Loader2, XCircle, Sparkles } from "lucide-react"; // Added Loader2, XCircle, and Sparkles

// Interface for the API request payload
interface GenerateVideoRequest {
  imageUrl: string;
}

// Interface for the API response payload
interface GenerateVideoResponse {
  videoUrl: string;
}

// Extended interface for gallery item state
interface GalleryItemState {
  loading: boolean;
  videoUrl: string | null;
  error: string | null;
  adLoading: boolean; // New state for Gemini ad generation
}

interface GalleryPreviewProps {
  preview: {
    id: number;
    title: string;
    description: string;
    image: string;
    engagement: string;
    location: string;
  };
}

export const GalleryPreview: React.FC<GalleryPreviewProps> = ({ preview }) => {
  const [itemState, setItemState] = useState<GalleryItemState>({
    loading: false,
    videoUrl: null,
    error: null,
    adLoading: false,
  });

  const handleImageClick = async () => {
    if (itemState.loading || itemState.videoUrl) {
      return;
    }

    setItemState((prevState) => ({ ...prevState, loading: true, error: null }));

    try {
      const requestBody: GenerateVideoRequest = { imageUrl: preview.image };
      const response = await fetch("/api/v1/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GenerateVideoResponse = await response.json();
      setItemState((prevState) => ({
        ...prevState,
        loading: false,
        videoUrl: data.videoUrl,
      }));
    } catch (error) {
      console.error("Error generating video:", error);
      setItemState((prevState) => ({
        ...prevState,
        loading: false,
        error: "Failed to generate video.",
      }));
    }
  };

  const handleGenerateAd = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the main card click handler from firing
    if (itemState.adLoading) return;

    setItemState((prevState) => ({ ...prevState, adLoading: true, error: null }));

    try {
      const requestBody = { imageUrl: preview.image };
      const response = await fetch("/api/v1/generate-ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: GenerateVideoResponse = await response.json();
      // We are replacing the main content with the generated ad
      setItemState((prevState) => ({
        ...prevState,
        adLoading: false,
        videoUrl: data.videoUrl,
      }));
    } catch (error) {
      console.error("Error generating ad with Gemini:", error);
      setItemState((prevState) => ({
        ...prevState,
        adLoading: false,
        error: "Failed to generate ad.",
      }));
    }
  };

  return (
    <div
      data-cy="gallery-card"
      className="group bg-card rounded-lg overflow-hidden border border-border/50 hover:border-silver/30 transition-all duration-300 hover:shadow-card hover:shadow-executive-blue/10 flex flex-col"
    >
      <div
        onClick={handleImageClick}
        className="aspect-video relative overflow-hidden cursor-pointer"
      >
        {(itemState.loading || itemState.adLoading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-executive-blue" />
          </div>
        )}
        {itemState.error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/70 text-white z-10 p-2 text-center">
            <XCircle className="h-8 w-8 mb-2" />
            <span className="text-sm font-medium">{itemState.error}</span>
          </div>
        )}
        {itemState.videoUrl ? (
          <video
            src={itemState.videoUrl}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={preview.image}
            alt={preview.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              itemState.loading || itemState.adLoading ? "opacity-50" : ""
            }`}
          />
        )}
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
      <div className="p-3 space-y-2 flex-grow flex flex-col">
        <h4 className="font-medium text-sm text-silver group-hover:text-gold transition-colors leading-tight">
          {preview.title}
        </h4>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-grow">
          {preview.description}
        </p>
        <Button
          onClick={handleGenerateAd}
          disabled={itemState.adLoading}
          className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white"
          size="sm"
        >
          {itemState.adLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Crear Anuncio con Gemini
        </Button>
      </div>
    </div>
  );
};
