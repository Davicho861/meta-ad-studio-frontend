import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button-premium";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Play, Pause, Download, Share2, Settings, Sparkles, TrendingUp, MapPin, Clock } from "lucide-react";

interface CustomizationModalProps {
  preview: {
    id: number;
    title: string;
    description: string;
    image: string;
    engagement: string;
    location: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({ 
  preview, 
  isOpen, 
  onClose 
}) => {
  const [brandText, setBrandText] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleCustomize = () => {
    setIsCustomizing(true);
    // Simulate real-time customization
    setTimeout(() => {
      setIsCustomizing(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-surface border-border/50 p-0 overflow-hidden">
        <div className="flex h-[80vh]">
          {/* Main Video Preview */}
          <div className="flex-1 relative bg-background">
            <div className="absolute inset-0">
              <img 
                src={preview.image} 
                alt={preview.title}
                className="w-full h-full object-cover"
              />
              {/* Video Overlay Simulation */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
              
              {/* Brand Text Overlay Simulation */}
              {brandText && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-gradient-primary px-8 py-4 rounded-lg shadow-glow transform animate-pulse">
                    <h2 className="text-3xl font-bold text-primary-foreground text-center">
                      {brandText}
                    </h2>
                  </div>
                </div>
              )}

              {/* Processing Overlay */}
              {isCustomizing && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto border-4 border-executive-blue border-t-transparent rounded-full animate-spin"></div>
                    <div className="space-y-2">
                      <p className="text-silver font-medium">Applying Brand Integration</p>
                      <p className="text-sm text-muted-foreground">Rendering with millimetric precision</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <Button 
                variant="premium" 
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Badge className="bg-executive-blue/90 text-white">
                60 FPS • 4K Quality
              </Badge>
            </div>

            {/* Engagement Metrics */}
            <div className="absolute top-4 right-4 space-y-2">
              <Badge className="bg-surface-elevated/90 text-silver border border-silver/20">
                <TrendingUp className="w-3 h-3 mr-1" />
                Predicted Engagement: 89%
              </Badge>
              <Badge className="bg-surface-elevated/90 text-silver border border-silver/20">
                <Clock className="w-3 h-3 mr-1" />
                Real-time Preview
              </Badge>
            </div>

            {/* Close Button */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="absolute top-4 left-4 bg-background/80 hover:bg-background/90"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Customization Sidebar */}
          <div className="w-80 bg-surface-elevated border-l border-border/50 p-6 space-y-6 overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-silver">
                Enterprise Customization
              </DialogTitle>
            </DialogHeader>

            {/* Preview Info */}
            <div className="space-y-3">
              <h3 className="font-medium text-foreground">{preview.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{preview.location}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {preview.description}
              </p>
            </div>

            <Separator className="bg-border/50" />

            {/* Brand Customization */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-silver">
                BRAND TEXT OVERLAY
              </Label>
              <div className="space-y-3">
                <Input
                  value={brandText}
                  onChange={(e) => setBrandText(e.target.value)}
                  placeholder="Enter Your Brand Name Here"
                  className="bg-surface border-border/50 focus:border-executive-blue"
                />
                <Button 
                  variant="generate" 
                  className="w-full"
                  onClick={handleCustomize}
                  disabled={!brandText || isCustomizing}
                >
                  {isCustomizing ? (
                    <>
                      <Settings className="w-4 h-4 mr-2 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Apply Real-Time
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Style Presets */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-silver">STYLE PRESETS</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="enterprise" size="sm">Holographic</Button>
                <Button variant="enterprise" size="sm">Neon Glow</Button>
                <Button variant="enterprise" size="sm">Metallic</Button>
                <Button variant="enterprise" size="sm">Cinematic</Button>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-silver">PREDICTED PERFORMANCE</Label>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Engagement Rate</span>
                  <Badge variant="outline">89%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Click-through Rate</span>
                  <Badge variant="outline">12.4%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Conversion Potential</span>
                  <Badge variant="outline">High</Badge>
                </div>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button variant="gold" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export to Enterprise Campaign
              </Button>
              <Button variant="premium" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share with Team
              </Button>
              <Button variant="generate" className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Customize & Purchase Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};