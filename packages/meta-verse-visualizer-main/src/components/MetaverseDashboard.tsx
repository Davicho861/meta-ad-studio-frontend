import React, { useState, useEffect, lazy, Suspense } from 'react'
import { gsap } from 'gsap';
import '@/styles/metaverse-theme.css';
import { auth } from '@/firebaseConfig'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import useAuthStore from '@/store/authStore'
import { Button } from '@/components/ui/button-premium'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CustomizationModal } from './CustomizationModal'
import { GalleryPreview } from './GalleryPreview'
import { Pagination } from './ui/pagination'
const MetaverseScene = lazy(() => import('./MetaverseScene'))
import {
  Search,
  Sparkles,
  Globe,
  Settings,
  Users,
  Edit3,
  Share2,
  Download,
} from 'lucide-react'

// Import all generated metaverse images
import timesSquareImg from '@/assets/metaverse-times-square.jpg'
import shibuyaImg from '@/assets/metaverse-shibuya.jpg'
import piccadillyImg from '@/assets/metaverse-piccadilly.jpg'
import burjKhalifaImg from '@/assets/metaverse-burj-khalifa.jpg'
import vegasSphereImg from '@/assets/metaverse-vegas-sphere.jpg'
import sydneyOperaImg from '@/assets/metaverse-sydney-opera.jpg'
import akihabaraImg from '@/assets/metaverse-akihabara.jpg'
import dubaiAirportImg from '@/assets/metaverse-dubai-airport.jpg'

const galleryPreviews = [
  {
    id: 1,
    title: 'Virtual Times Square - New York Metaverse',
    description:
      'Massive curved holographic billboard during New Year celebrations with avatar interactions',
    image: timesSquareImg,
    engagement: '94%',
    location: 'Times Square Virtual, NYC Metaverse',
  },
  {
    id: 2,
    title: 'Digital Shibuya Crossing - Tokyo Metaverse',
    description:
      'Iconic neon signs and LED walls with portal transitions between universes',
    image: shibuyaImg,
    engagement: '89%',
    location: 'Shibuya Virtual, Tokyo Metaverse',
  },
  {
    id: 3,
    title: 'Metaverse Piccadilly Circus - London',
    description:
      'Curved LED facade under neon mist with morphing futuristic vehicles',
    image: piccadillyImg,
    engagement: '91%',
    location: 'Piccadilly Circus, London Metaverse',
  },
  {
    id: 4,
    title: 'Burj Khalifa Light Show - Dubai Multiverse',
    description:
      'Golden monogram patterns flowing like desert sands with diamond sparkles',
    image: burjKhalifaImg,
    engagement: '96%',
    location: 'Burj Khalifa, Dubai Multiverse',
  },
  {
    id: 5,
    title: 'Las Vegas Sphere - Multiverse Event',
    description:
      'Planet-scale Super Bowl advertisement with zero-gravity athletes',
    image: vegasSphereImg,
    engagement: '92%',
    location: 'Las Vegas Sphere, Nevada Metaverse',
  },
  {
    id: 6,
    title: 'Sydney Opera House - Harbor Metaverse',
    description:
      'Opera sails projecting campaigns over digital waters at sunset',
    image: sydneyOperaImg,
    engagement: '87%',
    location: 'Sydney Harbor, Australia Metaverse',
  },
  {
    id: 7,
    title: 'Akihabara Tech District - Tokyo Multiverse',
    description:
      'Interactive holographic walls with dimensional marketplace portals',
    image: akihabaraImg,
    engagement: '90%',
    location: 'Akihabara Virtual, Tokyo Multiverse',
  },
  {
    id: 8,
    title: 'Dubai Airport International - Metaverse Hub',
    description:
      'Luxury perfume campaigns reflected in virtual marble with avatar travelers',
    image: dubaiAirportImg,
    engagement: '88%',
    location: 'Dubai Airport, UAE Metaverse',
  },
]

export const MetaverseDashboard = () => {
  const { user, loading, error, isLoggedIn, logout } = useAuthStore()
  const [selectedPreview, setSelectedPreview] = useState(null)
  const [prompt, setPrompt] = useState(
    "Overlay 'EtherAI Labs' branding on a massive virtual LED billboard in Times Square metaverse during multiverse New Year celebrations, with dynamic holographic lighting, avatar crowd interaction across parallel dimensions and real-time engagement metrics."
  )
  const [holographicBrightness, setHolographicBrightness] = useState([75])
  const [interactivity, setInteractivity] = useState([85])
  const [dimensionalMapping, setDimensionalMapping] = useState([60])
  const [isGenerating, setIsGenerating] = useState(false)
  const [galleryData, setGalleryData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchVideos = async () => {
      if (auth.currentUser) {
        try {
          const token = await auth.currentUser.getIdToken();
          const response = await fetch('http://localhost:3001/api/v1/generate-video', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (data.success) {
            // The backend sends video URLs, but the frontend expects imported image objects.
            // I will map the backend data to the existing frontend structure for now.
            const formattedData = data.videos.map((video, index) => ({
              id: video.id,
              title: `Video ${video.id}`,
              description: `Description for video ${video.id}`,
              image: index % 2 === 0 ? timesSquareImg : shibuyaImg, // Placeholder mapping
              engagement: 'N/A',
              location: 'Fetched from Backend'
            }));
            setGalleryData(formattedData);
          }
        } catch (error) {
          console.error('Failed to fetch videos:', error);
        }
      }
    };

    fetchVideos();
  }, [user]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Error signing in with Google: ', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      logout()
    } catch (error) {
      console.error('Error signing out: ', error)
    }
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }


  // GSAP Animations to be added here

  return (
    <div className='min-h-screen bg-background text-foreground cosmic-gradient-background'>
      {/* Top Navigation Bar */}
      <header className='border-b border-border bg-surface'>
        <div className='dark-mode-toggle'></div>
        <div className='max-w-full px-8 py-6'>
          <div className='space-y-6'>
            {/* Main Prompt Input */}
            <div className='space-y-3'>
              <Label className='text-sm font-medium text-silver uppercase tracking-wider'>
                Generate Enterprise Metaverse Advertising Overlay
              </Label>
              <div className='relative'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground' />
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className='pl-12 pr-4 h-14 text-lg bg-surface-elevated border-border/50 focus:border-executive-blue focus:ring-executive-blue/20'
                  placeholder='Enter your metaverse advertising vision...'
                />
              </div>
            </div>

            {/* Navigation Tabs */}
            <Tabs defaultValue='explore' className='w-full'>
              <TabsList className='grid w-full grid-cols-5 bg-muted/50'>
                <TabsTrigger
                  value='explore'
                  className='data-[state=active]:bg-executive-blue data-[state=active]:text-white'
                >
                  <Globe className='w-4 h-4 mr-2' />
                  Explore Metaverse Ads
                </TabsTrigger>
                <TabsTrigger
                  value='create'
                  className='data-[state=active]:bg-executive-blue data-[state=active]:text-white'
                >
                  <Sparkles className='w-4 h-4 mr-2' />
                  Create Multiverse Overlay
                </TabsTrigger>
                <TabsTrigger
                  value='organize'
                  className='data-[state=active]:bg-executive-blue data-[state=active]:text-white'
                >
                  <Users className='w-4 h-4 mr-2' />
                  Organize Enterprise Campaigns
                </TabsTrigger>
                <TabsTrigger
                  value='edit'
                  className='data-[state=active]:bg-executive-blue data-[state=active]:text-white'
                >
                  <Edit3 className='w-4 h-4 mr-2' />
                  Edit Collaborative Assets
                </TabsTrigger>
                <TabsTrigger
                  value='customize'
                  className='data-[state=active]:bg-executive-blue data-[state=active]:text-white'
                >
                  <Settings className='w-4 h-4 mr-2' />
                  Customize Premium Styles
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      <div className='flex'>
        {/* Left Sidebar Controls */}
        <aside className='w-80 bg-surface border-r border-border p-8 space-y-8 overflow-y-auto h-screen'>
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-silver'>
              Enterprise Controls
            </h3>

            {/* Holographic Brightness */}
            <div className='space-y-3'>
              <Label className='text-sm font-medium'>
                Explosive Holographic Brightness
              </Label>
              <p className='text-xs text-muted-foreground'>
                For high-impact virtual night shows
              </p>
              <Slider
                value={holographicBrightness}
                onValueChange={setHolographicBrightness}
                max={100}
                step={1}
                className='w-full'
              />
              <Badge variant='outline' className='text-xs'>
                {holographicBrightness[0]}% Intensity
              </Badge>
            </div>

            {/* Interactivity Level */}
            <div className='space-y-3'>
              <Label className='text-sm font-medium'>
                Multiverse Avatar Interaction
              </Label>
              <p className='text-xs text-muted-foreground'>
                With gesture tracking and CRM integration
              </p>
              <Slider
                value={interactivity}
                onValueChange={setInteractivity}
                max={100}
                step={1}
                className='w-full'
              />
              <Badge variant='outline' className='text-xs'>
                {interactivity[0]}% Engagement
              </Badge>
            </div>

            {/* Dimensional Mapping */}
            <div className='space-y-3'>
              <Label className='text-sm font-medium'>
                3D Projection Mapping
              </Label>
              <p className='text-xs text-muted-foreground'>
                For architectural wonders in parallel realms
              </p>
              <Slider
                value={dimensionalMapping}
                onValueChange={setDimensionalMapping}
                max={100}
                step={1}
                className='w-full'
              />
              <Badge variant='outline' className='text-xs'>
                {dimensionalMapping[0]}% Precision
              </Badge>
            </div>

            {/* Aspect Ratio Presets */}
            <div className='space-y-3'>
              <Label className='text-sm font-medium'>Enterprise Presets</Label>
              <div className='grid grid-cols-2 gap-2'>
                <Button variant='enterprise' size='sm'>
                  16:9 Panoramic
                </Button>
                <Button variant='enterprise' size='sm'>
                  1:1 Kiosk
                </Button>
                <Button variant='enterprise' size='sm'>
                  9:16 Mobile
                </Button>
                <Button variant='enterprise' size='sm'>
                  3:4 Portal
                </Button>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              variant='generate'
              size='xl'
              className='w-full glow-on-hover'
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Sparkles className='w-5 h-5 mr-2 animate-spin' />
                  Generating Masterpiece...
                </>
              ) : (
                <>
                  <Sparkles className='w-5 h-5 mr-2' />
                  Generate Real-Time
                </>
              )}
            </Button>
            <div className='mt-auto'>
              {user ? (
                <div className='space-y-2'>
                  <p className='text-sm text-center text-muted-foreground'>
                    Welcome, {user.displayName}
                  </p>
                  <Button
                    variant='outline'
                    className='w-full'
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={signInWithGoogle}
                >
                  Sign In with Google
                </Button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className='flex-1 flex'>
          {/* Central Canvas */}
          <div className='flex-1 p-8'>
            {isGenerating ? (
              <div className='h-full bg-surface-elevated rounded-xl border border-border/50 flex items-center justify-center'>
                <div className='text-center space-y-4'>
                  <div className='w-24 h-24 mx-auto'>
                    <div className='w-full h-full border-4 border-executive-blue border-t-transparent rounded-full animate-spin'></div>
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-lg font-semibold text-silver'>
                      Scanning Iconic Metaverse Locations
                    </h3>
                    <p className='text-muted-foreground'>
                      Detecting optimal holographic displays for maximum
                      engagement
                    </p>
                    <Badge className='bg-executive-blue/20 text-executive-blue'>
                      AI Processing: 67%
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className='h-full bg-surface-elevated rounded-xl border border-border/50'>
                <Suspense fallback={<div className='flex items-center justify-center h-full'>Loading 3D Scene...</div>}>
                  <MetaverseScene />
                </Suspense>
              </div>
            )}
          </div>

          {/* Right Sidebar Gallery */}
          <aside className='w-96 bg-surface border-l border-border p-6 overflow-y-auto h-screen'>
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold text-silver'>
                  Premium Enterprise Gallery
                </h3>
                <div className='flex gap-2'>
                  <Button variant='ghost' size='icon'>
                    <Share2 className='w-4 h-4' />
                  </Button>
                  <Button variant='ghost' size='icon'>
                    <Download className='w-4 h-4' />
                  </Button>
                </div>
              </div>

              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10'
                  placeholder='Search gallery...'
                />
              </div>

              <div className='space-y-4'>
                {(galleryData.length > 0 ? galleryData : galleryPreviews)
                  .filter((preview) =>
                    preview.title.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((preview) => (
                    <div
                      key={preview.id}
                      onClick={() => setSelectedPreview(preview)}
                    >
                      <GalleryPreview preview={preview} />
                    </div>
                  ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil((galleryData.length > 0 ? galleryData.length : galleryPreviews.length) / itemsPerPage)}
                onPageChange={setCurrentPage}
              />

              {/* Premium Subscription Banner */}
              <div className='bg-gradient-gold rounded-xl p-6 text-center space-y-3 border border-gold/20'>
                <Sparkles className='w-8 h-8 mx-auto text-background' />
                <h4 className='font-semibold text-background'>
                  Unlimited Multiverse Overlays
                </h4>
                <p className='text-sm text-background/80'>
                  Access enterprise customization and real-time collaboration
                </p>
                <Button
                  variant='premium'
                  className='w-full bg-background text-gold hover:bg-background/90'
                >
                  Subscribe Now
                </Button>
              </div>
            </div>
          </aside>
        </main>
      </div>

      {/* Customization Modal */}
      {selectedPreview && (
        <CustomizationModal
          preview={selectedPreview}
          isOpen={!!selectedPreview}
          onClose={() => setSelectedPreview(null)}
        />
      )}
    </div>
  )
}
