'use client';
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Html } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

function STLMesh({ url }: { url: string }) {
  const geom = useLoader(STLLoader, url);
  geom.computeVertexNormals();
  const box = new THREE.Box3().setFromBufferAttribute(geom.getAttribute('position'));
  const size = new THREE.Vector3(); box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = 1.5 / maxDim;
  return (
    <mesh geometry={geom} scale={scale}>
      <meshStandardMaterial color="#9fb7ff" roughness={0.45} metalness={0.2} />
    </mesh>
  );
}

export default function ViewerSTL({ url }: { url: string }){
  return (
    <div className="relative h-[460px] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0b]">
      <Canvas shadows camera={{ position: [2.5,2,2.5], fov: 42 }}>
        <color attach="background" args={["#0a0a0b"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5,8,5]} intensity={1} castShadow />
        <Suspense fallback={<Html center className="text-white/80 text-sm">Loading STL…</Html>}>
          {url ? <STLMesh url={url} /> : <Html center className="text-white/60 text-sm">Paste a public STL URL or choose a local .stl file</Html>}
        </Suspense>
        <Grid args={[8,8]} position={[0,-0.75,0]} />
        <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
      </Canvas>
    </div>
  );
}
