'use client';

import { Canvas } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';

function FloatingParticles() {
    const ref = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const temp = new Float32Array(6000);
        for (let i = 0; i < 2000; i++) {
            temp[i * 3] = (Math.random() - 0.5) * 15;
            temp[i * 3 + 1] = (Math.random() - 0.5) * 10;
            temp[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return temp;
    }, []);

    useEffect(() => {
        let frameId: number;

        const animate = () => {
            if (ref.current) {
                ref.current.rotation.x += 0.0005;
                ref.current.rotation.y += 0.0003;
            }
            frameId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(frameId);
    }, []);

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial transparent color="#67e8f9" size={0.03} sizeAttenuation depthWrite={false} />
        </Points>
    );
}

export default function AnimatedBackground() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <FloatingParticles />
            </Canvas>
        </div>
    );
}
