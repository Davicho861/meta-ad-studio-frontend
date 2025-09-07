import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Object3D } from 'three'

type VisualizationStageProps = {
  sceneId?: string
  onClose?: () => void
}

const Model: React.FC<{ path?: string }> = ({ path }) => {
  const gltf = useGLTF(path || '/models/placeholder-scene.glb')
  // cast explícito para cumplir con typing de primitive
  return <primitive object={gltf.scene as unknown as Object3D} />
}

const VisualizationStage: React.FC<VisualizationStageProps> = ({
  sceneId,
  onClose,
}) => {
  // skeleton component: will lazy-load GLTF in Sprint 1
  // Example: const gltf = useGLTF(`/models/${sceneId || 'placeholder-scene'}.glb`);

  return (
    <div className='w-full h-full bg-black'>
      <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Model path={`/models/${sceneId || 'placeholder-scene'}.glb`} />
        </Suspense>
        <OrbitControls enablePan enableRotate enableZoom />
      </Canvas>

      <div className='absolute top-4 left-4 z-60'>
        <button
          onClick={() => onClose?.()}
          className='px-3 py-2 bg-black/60 text-white rounded-md backdrop-blur-sm'
        >
          Volver al Hub
        </button>
      </div>
    </div>
  )
}

export default VisualizationStage
