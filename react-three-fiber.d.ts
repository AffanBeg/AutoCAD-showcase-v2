import * as THREE from 'three';
import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: {
        geometry?: THREE.BufferGeometry;
        scale?: number | [number, number, number];
        children?: React.ReactNode;
      };
      meshStandardMaterial: {
        color?: string;
        roughness?: number;
        metalness?: number;
      };
    }
  }
}

export {};
