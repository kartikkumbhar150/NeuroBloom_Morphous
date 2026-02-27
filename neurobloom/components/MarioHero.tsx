"use client";
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';

function Box(props: any) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state, delta) => (ref.current.rotation.x += delta * 0.5, ref.current.rotation.y += delta * 0.2));
  
  return (
    <mesh {...props} ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={props.color || '#FBD000'} />
      {/* Add a border effect */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial color="black" linewidth={2} />
      </lineSegments>
    </mesh>
  );
}

function Coin(props: any) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state, delta) => (ref.current.rotation.y += delta * 2));
  
  return (
    <mesh {...props} ref={ref}>
      <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
      <meshStandardMaterial color="#FBD000" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

export function MarioHero() {
  return (
    <div className="w-full h-[500px] relative bg-[#5C94FC] overflow-hidden rounded-3xl border-4 border-black shadow-lg">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Box position={[-2, 1, 0]} color="#E52521" />
          <Box position={[0, 1.5, -1]} color="#FBD000" />
          <Box position={[2, 0.5, 0]} color="#43B047" />
          
          <Coin position={[-1.5, -1, 1]} />
          <Coin position={[1.5, -0.5, 1]} />
          <Coin position={[0, -1.5, 0.5]} />
        </Float>

        <gridHelper args={[20, 20, '#ffffff', '#ffffff']} position={[0, -2, 0]} opacity={0.2} transparent />
      </Canvas>
      
      {/* Decorative CSS Clouds */}
      <div className="absolute top-10 left-10 w-24 h-8 bg-white rounded-full opacity-80 blur-sm" />
      <div className="absolute top-20 right-20 w-32 h-10 bg-white rounded-full opacity-60 blur-md" />
      <div className="absolute bottom-10 left-1/4 w-20 h-6 bg-white rounded-full opacity-70 blur-sm" />
    </div>
  );
}
