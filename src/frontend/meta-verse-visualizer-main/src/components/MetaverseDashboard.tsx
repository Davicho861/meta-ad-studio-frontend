import React, { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import { MainContent } from './MainContent'
import { examples } from '../data/gallery-examples'

// Import all generated metaverse images
import timesSquareImg from '@/assets/metaverse-times-square.jpg'
import shibuyaImg from '@/assets/metaverse-shibuya.jpg'
import piccadillyImg from '@/assets/metaverse-piccadilly.jpg'
import burjKhalifaImg from '@/assets/metaverse-burj-khalifa.jpg'
import vegasSphereImg from '@/assets/metaverse-vegas-sphere.jpg'
import sydneyOperaImg from '@/assets/metaverse-sydney-opera.jpg'
import akihabaraImg from '@/assets/metaverse-akihabara.jpg'
import dubaiAirportImg from '@/assets/metaverse-dubai-airport.jpg'

const _galleryPreviews = [
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
  const [inspirationData, setInspirationData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simula una llamada a la API para precargar los datos de la galería
    /* CODemod: console.log('PRECARGANDO DATOS DE INSPIRACIÓN...')
     */setTimeout(() => {
      setInspirationData(examples)
      setIsLoading(false)
      /* CODemod: console.log('DATOS DE INSPIRACIÓN CARGADOS.')
     */}, 1000) // Simular delay de 1 segundo
  }, [])

  return (
    <div className='flex h-screen bg-background-dark text-primary-text font-sans'>
      <Sidebar />
      <main className='flex-1 overflow-y-auto'>
        <MainContent inspirationData={inspirationData} isLoading={isLoading} />
      </main>
    </div>
  )
}
