import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Video {
  id: string;
  url: string;
  caption: string;
}

const MultiverseGallery: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/multiverse/videos');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Video[] = await response.json();
        setVideos(data);
      } catch (err: unknown) {
        setError((err as Error).message);
        console.error("Failed to fetch videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <p className="text-muted-foreground">Loading gallery...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-10 bg-destructive/10 rounded-lg">
        <p className="text-destructive-foreground">Error loading gallery: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">Multiverse Video Gallery</h2>
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
              <CardContent className="p-0">
                <video src={video.url} autoPlay loop muted playsInline data-testid="video-element" title={video.caption} className="w-full h-48 object-cover" />
              </CardContent>
              <CardFooter className="p-4">
                <p className="text-sm font-medium text-foreground truncate">{video.caption}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center p-10 border-2 border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">No videos found in the gallery.</p>
        </div>
      )}
    </div>
  );
};

export default MultiverseGallery;
