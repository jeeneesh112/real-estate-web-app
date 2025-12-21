import React, { Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Typography } from '@mui/material';
import type { Image } from '../../redux/slices/gallerySlice';

interface Hotspot {
  position: [number, number, number];
  targetIndex: number;
  label: string;
}

const hotspotLabelStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  backgroundColor: '#f8fafc',
  color: '#0f172a',
  padding: '8px 14px',
  borderRadius: 999,
  whiteSpace: 'nowrap',
  pointerEvents: 'auto',
  cursor: 'pointer',
  fontSize: 13,
  border: '1px solid #e2e8f0',
  boxShadow: '0 6px 14px rgba(15,23,42,0.12)',
};

function Hotspot({ position, label, onClick }: { position: [number, number, number]; label: string; onClick: () => void }) {
  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Invisible click target (larger hit area) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[16, 14, 14]} />
        <meshBasicMaterial transparent opacity={0.001} />
      </mesh>
      {/* Label pill only (clickable) */}
      <Html center distanceFactor={180} position={[0, 10, 0]}>
        <div style={hotspotLabelStyle} onClick={() => onClick()} role="button" aria-label={`Go to ${label}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22s7-6.1 7-12.1A7 7 0 0 0 5 9.9C5 15.9 12 22 12 22Z" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="10" r="2.5" fill="#0f172a" />
          </svg>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#0f172a' }}>
            {label}
          </Typography>
        </div>
      </Html>
    </group>
  );
}

function SpherePanorama({ imageUrl, hotspots, onHotspotClick }: { imageUrl: string; hotspots: Hotspot[]; onHotspotClick: (index: number) => void }) {
  const texture = useLoader(THREE.TextureLoader, imageUrl, undefined, (error) => {
    console.error('Failed to load texture:', error);
  });
  texture.colorSpace = THREE.SRGBColorSpace as any;
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.needsUpdate = true;

  return (
    <>
      <mesh>
        <sphereGeometry args={[500, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
      {hotspots.map((hotspot, i) => (
        <Hotspot
          key={i}
          position={hotspot.position}
          label={hotspot.label}
          onClick={() => onHotspotClick(hotspot.targetIndex)}
        />
      ))}
    </>
  );
}

export interface PanoramaViewerProps {
  imageUrl: string;
  onHotspotClick?: (targetIndex: number) => void;
  currentIndex?: number;
  totalScenes?: number;
  images?: Image[];
  isFullscreen?: boolean;
}

export const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ 
  imageUrl, 
  onHotspotClick = () => {}, 
  currentIndex = 0, 
  totalScenes = 1,
  images = [],
  isFullscreen = false,
}) => {
  // Generate hotspots for prev/next rooms
  const hotspots = useMemo(() => {
    const spots: Hotspot[] = [];
    
    // Previous room hotspot (left)
    if (currentIndex > 0 && images[currentIndex - 1]) {
      spots.push({
        position: [-200, 0, -200],
        label: images[currentIndex - 1].roomType || `Room ${currentIndex}`,
        targetIndex: currentIndex - 1,
      });
    }
    
    // Next room hotspot (right)
    if (currentIndex < totalScenes - 1 && images[currentIndex + 1]) {
      spots.push({
        position: [200, 0, -200],
        label: images[currentIndex + 1].roomType || `Room ${currentIndex + 2}`,
        targetIndex: currentIndex + 1,
      });
    }
    
    return spots;
  }, [currentIndex, totalScenes, images]);

  return (
    <Canvas 
      key={imageUrl}
      camera={{ fov: 75, position: [0, 0, 0.1] }} 
      style={{ 
        width: '100%', 
        height: isFullscreen ? 'calc(100vh - 64px)' : '70vh', 
        background: '#000', 
        marginTop: isFullscreen ? 32 : 0,
        marginBottom: isFullscreen ? 32 : 0,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor('#000000');
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1} />
        <SpherePanorama imageUrl={imageUrl} hotspots={hotspots} onHotspotClick={onHotspotClick} />
        <OrbitControls enablePan={false} enableZoom={true} rotateSpeed={-0.25} />
      </Suspense>
    </Canvas>
  );
};
