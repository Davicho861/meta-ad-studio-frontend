export const videoExamples = [
  {
    id: '1',
    prompt:
      'Campaña publicitaria de neón para una bebida energética futurista, estilo cyberpunk, en Shibuya Crossing de noche.',
    thumbnailUrl: '/assets/metaverse-shibuya.jpg',
    videoUrl: '/assets/samples/shibuya-loop.mp4',
    author: { name: 'Studio Neon', avatarUrl: '/assets/avatars/creator1.jpg' },
    likes: 124,
  },
  {
    id: '2',
    prompt:
      'Proyección holográfica de un reloj de lujo en el Burj Khalifa, con partículas doradas flotando.',
    thumbnailUrl: '/assets/metaverse-burj-khalifa.jpg',
    videoUrl: '/assets/samples/burj-loop.mp4',
    author: { name: 'Aurora Labs', avatarUrl: '/assets/avatars/creator2.jpg' },
    likes: 98,
  },
  {
    id: '3',
    prompt:
      'Anuncio gigante de zapatillas de edición limitada en Times Square, arte callejero, colores vibrantes.',
    thumbnailUrl: '/assets/metaverse-times-square.jpg',
    videoUrl: '/assets/samples/times-loop.mp4',
    author: {
      name: 'Street Creative',
      avatarUrl: '/assets/avatars/creator3.jpg',
    },
    likes: 210,
  },
  {
    id: '4',
    prompt:
      'Pantallas holográficas interactivas para un nuevo smartphone en Akihabara, con efectos de realidad aumentada.',
    thumbnailUrl: '/assets/metaverse-akihabara.jpg',
    videoUrl: '/assets/samples/akihabara-loop.mp4',
    author: { name: 'PixelWorks', avatarUrl: '/assets/avatars/creator4.jpg' },
    likes: 76,
  },
  {
    id: '5',
    prompt:
      'Espectáculo de luces en la Sphere de Las Vegas para un concierto virtual, con avatares bailando.',
    thumbnailUrl: '/assets/metaverse-vegas-sphere.jpg',
    videoUrl: '/assets/samples/vegas-loop.mp4',
    author: { name: 'Live Meta', avatarUrl: '/assets/avatars/creator5.jpg' },
    likes: 302,
  },
]

// Mantener compatibilidad con módulos que importan `examples` (usado por otros componentes)
export const examples = videoExamples.map((v, index) => ({
  id: index + 1,
  title: v.prompt.split('.').shift() ?? `Campaign ${index + 1}`,
  location: '',
  imageUrl: v.thumbnailUrl,
  prompt: v.prompt,
}))
