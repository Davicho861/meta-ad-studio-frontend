import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

type VisualizationStageProps = {
  sceneId?: string;
  imageUrl?: string;
  onClose?: () => void;
};

const GLTFPlaceholder: React.FC<{ path?: string }> = ({ path }) => {
  // Placeholder for GLTF loading. In Sprint 1 this will be replaced with useGLTF(path)
  // Keep a simple box so the Canvas renders correctly.
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#ff6a00" />
    </mesh>
  );
};

const VisualizationStage: React.FC<VisualizationStageProps> = ({ sceneId, imageUrl, onClose }) => {
  // skeleton component: will lazy-load GLTF in Sprint 1
  // Example: const gltf = useGLTF(`/models/${sceneId || 'placeholder-scene'}.glb`);

  return (
    <div className="w-full h-full bg-black">
      <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <GLTFPlaceholder path={`/models/${sceneId || 'placeholder-scene'}.glb`} />
        <OrbitControls enablePan enableRotate enableZoom />
      </Canvas>
    </div>
  );
};

export default VisualizationStage;
