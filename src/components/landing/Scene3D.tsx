import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import FloatingHeart3D from './FloatingHeart3D';

const Scene3D = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ec4899" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7c3aed" />
        
        <Suspense fallback={null}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <FloatingHeart3D position={[-3, 2, 0]} />
          <FloatingHeart3D position={[3, -2, -2]} />
          <FloatingHeart3D position={[0, 3, -3]} />
          <FloatingHeart3D position={[-2, -3, -1]} />
        </Suspense>
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

export default Scene3D;
