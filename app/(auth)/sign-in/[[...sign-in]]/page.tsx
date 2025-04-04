'use client';

import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { SignIn, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

function Stars() {
  const ref = useRef<THREE.Points>(null);
  const [positions, setPositions] = useState<Float32Array | null>(null);

  useEffect(() => {
    // Create a flat array of coordinates for better performance
    const temp = new Float32Array(6000);
    for (let i = 0; i < 2000; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 10;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 10;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    setPositions(temp);
  }, []);

  // Use useFrame hook for animation instead of setInterval
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.0005;
      ref.current.rotation.y += 0.0003;
    }
  });

  if (!positions) return null;

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

export default function Page() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Three.js Background - positioned absolutely to fill the entire screen */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <Stars />
        </Canvas>
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Login Section */}
        <div className="flex flex-col items-center justify-center px-4 py-10">
          <div className="text-center space-y-4">
            <h1 className="font-bold text-3xl text-white">Hola Mate!!</h1>
            <p className="text-base text-gray-100">
              Log in or create account to get back to your <span className="font-bold text-[#97fdf5]">MedicalRx</span> dashboard.
            </p>
          </div>
          <div className="flex items-center justify-center mt-8">
            <ClerkLoaded>
              <SignIn path="/sign-in" />
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className="animate-spin text-muted-foreground" />
            </ClerkLoading>
          </div>
        </div>

        {/* Branding Section */}
        <div className="hidden lg:flex flex-col space-y-2 items-center justify-center">
          <Image src="/logo.svg" height={100} width={100} alt="logo" />
          <span className="font-bold text-2xl text-white">MedicalRx</span>
          <span className="font-semibold text-xl text-[#67e8f9]">AI-driven medical assistance & healthcare platform 💊</span>
          <span className="font-semibold text-sm text-gray-400">From Ashu, with ❤️—caring for your health, always.</span>
        </div>
      </div>
    </div>
  );
}