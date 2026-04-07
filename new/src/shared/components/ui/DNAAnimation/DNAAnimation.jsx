import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import './DNAAnimation.scss';

const DNAHelix = ({ count = 30, spacing = 0.4, radius = 1.2 }) => {
    const helixRef = useRef();

    // Create the geometry for the base pairs and strands once
    const { bases, connectors } = useMemo(() => {
        const bases = [];
        const connectors = [];

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 4; // 2 full turns
            const y = (i - count / 2) * spacing;

            // Strand 1
            const x1 = Math.cos(angle) * radius;
            const z1 = Math.sin(angle) * radius;

            // Strand 2 (180 degrees offset)
            const x2 = Math.cos(angle + Math.PI) * radius;
            const z2 = Math.sin(angle + Math.PI) * radius;

            bases.push({ position: [x1, y, z1], color: '#0088ff' });
            bases.push({ position: [x2, y, z2], color: '#00ccff' });

            // Connectors (base pairs)
            connectors.push({
                p1: [x1, y, z1],
                p2: [x2, y, z2],
                color: '#e0f2ff'
            });
        }
        return { bases, connectors };
    }, [count, spacing, radius]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (helixRef.current) {
            helixRef.current.rotation.y = t * 0.5;
            helixRef.current.position.y = Math.sin(t * 0.5) * 0.2;
        }
    });

    return (
        <group ref={helixRef}>
            {/* Strands as Spheres */}
            {bases.map((base, idx) => (
                <mesh key={`base-${idx}`} position={base.position}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshStandardMaterial
                        color={base.color}
                        emissive={base.color}
                        emissiveIntensity={0.5}
                        roughness={0.3}
                        metalness={0.8}
                    />
                </mesh>
            ))}

            {/* Connectors as Cylinders */}
            {connectors.map((conn, idx) => {
                const p1 = new THREE.Vector3(...conn.p1);
                const p2 = new THREE.Vector3(...conn.p2);
                const distance = p1.distanceTo(p2);
                const midPoint = p1.clone().add(p2).multiplyScalar(0.5);

                // Rotation to align cylinder with the two points
                const direction = p2.clone().sub(p1).normalize();
                const quaternion = new THREE.Quaternion().setFromUnitVectors(
                    new THREE.Vector3(0, 1, 0),
                    direction
                );

                return (
                    <mesh
                        key={`conn-${idx}`}
                        position={midPoint}
                        quaternion={quaternion}
                    >
                        <cylinderGeometry args={[0.03, 0.03, distance, 8]} />
                        <meshStandardMaterial
                            color={conn.color}
                            transparent
                            opacity={0.6}
                            emissive={conn.color}
                            emissiveIntensity={0.2}
                        />
                    </mesh>
                );
            })}
        </group>
    );
};

const DNAAnimation = () => {
    return (
        <div className="dna-canvas-container">
            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#0088ff" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#00ccff" />
                <spotLight position={[0, 5, 0]} intensity={1} />

                <Float
                    speed={2}
                    rotationIntensity={1}
                    floatIntensity={1.5}
                >
                    <DNAHelix />
                </Float>

                <Environment preset="city" />
            </Canvas>
        </div>
    );
};

export default DNAAnimation;
