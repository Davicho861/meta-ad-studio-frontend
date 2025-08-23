import React, { useState, useEffect } from 'react';

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
        // Assuming the API endpoint is available and correctly configured
        const response = await fetch('/api/multiverse/videos');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Video[] = await response.json();
        setVideos(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Failed to fetch videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div>Loading gallery...</div>;
  }

  if (error) {
    return <div>Error loading gallery: {error}</div>;
  }

  return (
    <div className="multiverse-gallery">
      <h2>Multiverse Video Gallery</h2>
      {videos.length > 0 ? (
        <div className="video-grid">
          {videos.map((video) => (
            <div key={video.id} className="video-item">
              <video src={video.url} autoPlay loop muted playsInline data-testid="video-element" />
              <p>{video.caption}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No videos found in the gallery.</p>
      )}
      <style>{`
        .multiverse-gallery {
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .multiverse-gallery h2 {
          margin-bottom: 20px;
          color: #333;
        }
        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }
        .video-item {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: center;
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .video-item video {
          max-width: 100%;
          height: 200px; /* Fixed height for consistency */
          object-fit: cover; /* Ensures video covers the area */
          margin-bottom: 10px;
        }
        .video-item p {
          margin: 0;
          font-size: 0.9em;
          color: #555;
        }
      `}</style>
    </div>
  );
};

export default MultiverseGallery;