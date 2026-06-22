'use client'

import { useRef, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
    Float,
    Environment,
    ContactShadows,
    Text,
    MeshReflectorMaterial,
    SpotLight,
    useTexture,
    RoundedBox,
    Sparkles,
    Billboard,
} from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

/* ── Business Card Mesh ─────────────────────────────── */
function BusinessCard({ flipped }: { flipped: boolean }) {
    const cardRef = useRef<THREE.Group>(null!)
    const frontRef = useRef<THREE.Mesh>(null!)
    const backRef = useRef<THREE.Mesh>(null!)

    // Animate flip
    useFrame((_, delta) => {
        if (!cardRef.current) return
        const target = flipped ? Math.PI : 0
        cardRef.current.rotation.y = THREE.MathUtils.lerp(cardRef.current.rotation.y, target, delta * 3)
    })

    // Card dimensions — standard business card ratio 85.6mm × 54mm
    const W = 3.2
    const H = 2.0
    const D = 0.04

    // Front face material — gradient blue-violet
    const frontMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: new THREE.Color('#4f46e5'),
        metalness: 0.3,
        roughness: 0.2,
    }), [])

    // Back face material
    const backMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1e1b4b'),
        metalness: 0.4,
        roughness: 0.15,
    }), [])

    // Edge material
    const edgeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: new THREE.Color('#6366f1'),
        metalness: 0.6,
        roughness: 0.1,
    }), [])

    return (
        <group ref={cardRef}>
            {/* Card body */}
            <RoundedBox args={[W, H, D]} radius={0.06} smoothness={4}>
                <primitive object={edgeMaterial} attach="material" />
            </RoundedBox>

            {/* Front face */}
            <mesh position={[0, 0, D / 2 + 0.001]} ref={frontRef}>
                <planeGeometry args={[W - 0.01, H - 0.01]} />
                <primitive object={frontMaterial} attach="material" />
            </mesh>

            {/* Back face */}
            <mesh position={[0, 0, -(D / 2 + 0.001)]} rotation={[0, Math.PI, 0]} ref={backRef}>
                <planeGeometry args={[W - 0.01, H - 0.01]} />
                <primitive object={backMaterial} attach="material" />
            </mesh>

            {/* Front text — Name */}
            <Text
                position={[-0.9, -0.35, D / 2 + 0.01]}
                fontSize={0.22}
                color="white"
                font="/fonts/inter-bold.woff"
                anchorX="left"
                anchorY="middle"
                maxWidth={2}
            >
                Abel Abebe
            </Text>

            {/* Front text — Title */}
            <Text
                position={[-0.9, -0.62, D / 2 + 0.01]}
                fontSize={0.12}
                color="#a5b4fc"
                anchorX="left"
                anchorY="middle"
                maxWidth={2.2}
            >
                Senior Product Designer
            </Text>

            {/* Front text — Company */}
            <Text
                position={[-0.9, -0.82, D / 2 + 0.01]}
                fontSize={0.10}
                color="#818cf8"
                anchorX="left"
                anchorY="middle"
            >
                UNIQUE Digital Card
            </Text>

            {/* Front — UNIQUE logo text */}
            <Text
                position={[-0.88, 0.72, D / 2 + 0.01]}
                fontSize={0.10}
                color="rgba(255,255,255,0.4)"
                anchorX="left"
                anchorY="middle"
                letterSpacing={0.15}
            >
                UNIQUE
            </Text>

            {/* Back — QR label */}
            <Text
                position={[0, -0.6, -(D / 2 + 0.01)]}
                rotation={[0, Math.PI, 0]}
                fontSize={0.1}
                color="#818cf8"
                anchorX="center"
                anchorY="middle"
            >
                Scan to connect
            </Text>

            {/* NFC rings on front */}
            <NFCRings position={[1.2, 0.7, D / 2 + 0.01]} />

            {/* QR box on back */}
            <QRBox position={[0, 0.1, -(D / 2 + 0.01)]} />

            {/* Shine overlay */}
            <mesh position={[0, 0, D / 2 + 0.002]}>
                <planeGeometry args={[W, H]} />
                <meshStandardMaterial
                    color="white"
                    transparent
                    opacity={0.04}
                    metalness={1}
                    roughness={0}
                />
            </mesh>
        </group>
    )
}

function NFCRings({ position }: { position: [number, number, number] }) {
    const groupRef = useRef<THREE.Group>(null!)
    useFrame(({ clock }) => {
        if (!groupRef.current) return
        const t = clock.getElapsedTime()
        groupRef.current.children.forEach((child, i) => {
            ; (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
                color: '#a5b4fc',
                transparent: true,
                opacity: 0.3 + 0.4 * Math.sin(t * 2 + i * 0.8),
            })
        })
    })
    return (
        <group ref={groupRef} position={position}>
            {[0.08, 0.14, 0.20].map((r, i) => (
                <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[r, 0.008, 8, 32]} />
                    <meshBasicMaterial color="#a5b4fc" transparent opacity={0.5} />
                </mesh>
            ))}
        </group>
    )
}

function QRBox({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            <mesh>
                <planeGeometry args={[0.65, 0.65]} />
                <meshStandardMaterial color="white" />
            </mesh>
            {/* QR pixel grid */}
            {[
                [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
                [0, 1], [4, 1], [0, 2], [2, 2], [4, 2],
                [0, 3], [4, 3], [0, 4], [1, 4], [2, 4], [3, 4], [4, 4],
            ].map(([x, y], i) => (
                <mesh key={i} position={[-0.24 + x * 0.12, 0.24 - y * 0.12, 0.002]}>
                    <planeGeometry args={[0.09, 0.09]} />
                    <meshBasicMaterial color="#111827" />
                </mesh>
            ))}
        </group>
    )
}

/* ── Floating Feature Orbs ───────────────────────────── */
function FeatureOrb({ position, icon, label, color, delay }: {
    position: [number, number, number]
    icon: string
    label: string
    color: string
    delay: number
}) {
    const meshRef = useRef<THREE.Mesh>(null!)
    useFrame(({ clock }) => {
        if (!meshRef.current) return
        meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.8 + delay) * 0.15
    })

    const mat = useMemo(() => new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        metalness: 0.4,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9,
    }), [color])

    return (
        <group position={position}>
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.28, 32, 32]} />
                <primitive object={mat} attach="material" />
            </mesh>
            <Billboard follow={true} position={[0, 0.5, 0]}>
                <Text fontSize={0.13} color="white" anchorX="center" anchorY="middle">
                    {label}
                </Text>
            </Billboard>
        </group>
    )
}

/* ── Particle System ─────────────────────────────────── */
function ParticleField() {
    const pointsRef = useRef<THREE.Points>(null!)
    const count = 120

    const { positions, speeds } = useMemo(() => {
        const positions = new Float32Array(count * 3)
        const speeds = new Float32Array(count)
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 14
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10
            positions[i * 3 + 2] = (Math.random() - 0.5) * 8
            speeds[i] = Math.random() * 0.3 + 0.1
        }
        return { positions, speeds }
    }, [])

    useFrame(({ clock }) => {
        if (!pointsRef.current) return
        const pos = pointsRef.current.geometry.attributes['position'].array as Float32Array
        for (let i = 0; i < count; i++) {
            pos[i * 3 + 1] += speeds[i] * 0.005
            if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -5
        }
        pointsRef.current.geometry.attributes['position'].needsUpdate = true
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.025} color="#818cf8" transparent opacity={0.6} sizeAttenuation />
        </points>
    )
}

/* ── Ground reflection ───────────────────────────────── */
function Ground() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
            <planeGeometry args={[20, 20]} />
            <MeshReflectorMaterial
                blur={[300, 100]}
                resolution={512}
                mixBlur={1}
                mixStrength={40}
                roughness={1}
                depthScale={1.2}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color="#050505"
                metalness={0.6}
                mirror={0}
            />
        </mesh>
    )
}

/* ── Camera auto-rotate ──────────────────────────────── */
function AutoCamera() {
    const { camera } = useThree()
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * 0.12
        camera.position.x = Math.sin(t) * 5.5
        camera.position.z = Math.cos(t) * 5.5
        camera.position.y = 1.2 + Math.sin(t * 0.5) * 0.4
        camera.lookAt(0, 0, 0)
    })
    return null
}

/* ── Main Scene ──────────────────────────────────────── */
function Scene({ flipped }: { flipped: boolean }) {
    return (
        <>
            <AutoCamera />
            <ambientLight intensity={0.3} />
            <spotLight position={[4, 6, 3]} angle={0.4} penumbra={0.8} intensity={2} color="#6366f1" castShadow />
            <spotLight position={[-4, 4, -2]} angle={0.5} penumbra={1} intensity={1.5} color="#3b82f6" />
            <pointLight position={[0, 3, 2]} intensity={1} color="#a5b4fc" />
            <pointLight position={[0, -1, -3]} intensity={0.5} color="#7c3aed" />

            <Environment preset="city" />

            <ParticleField />

            <Sparkles
                count={60}
                scale={7}
                size={1.2}
                speed={0.3}
                opacity={0.5}
                color="#818cf8"
                noise={0.5}
            />

            {/* Main card — floats in center */}
            <Float
                speed={1.4}
                rotationIntensity={0.06}
                floatIntensity={0.4}
                floatingRange={[-0.15, 0.15]}
            >
                <BusinessCard flipped={flipped} />
            </Float>

            {/* Feature orbs */}
            <FeatureOrb position={[-2.8, 0.6, -0.5]} icon="📡" label="NFC" color="#6366f1" delay={0} />
            <FeatureOrb position={[2.8, 0.4, -0.5]} icon="📊" label="Analytics" color="#3b82f6" delay={1} />
            <FeatureOrb position={[0, 1.8, -1.5]} icon="🔗" label="QR Code" color="#7c3aed" delay={2} />

            <ContactShadows position={[0, -2.15, 0]} opacity={0.6} scale={10} blur={2} far={4} />
            <Ground />
        </>
    )
}

/* ── Exported component ──────────────────────────────── */
export function CardScene3DCanvas() {
    const [flipped, setFlipped] = useState(false)

    return (
        <div className="relative w-full h-[420px] sm:h-[500px]">
            <Canvas
                shadows
                camera={{ position: [0, 1.2, 5.5], fov: 45 }}
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
                style={{ background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    <Scene flipped={flipped} />
                </Suspense>
            </Canvas>

            {/* Click overlay */}
            <button
                onClick={() => setFlipped((f) => !f)}
                className="absolute inset-0 cursor-pointer z-10"
                aria-label="Flip card"
            />

            {/* UI overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-20">
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2"
                >
                    <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-white/80 font-medium">Click anywhere to flip · Drag to rotate</span>
                </motion.div>
            </div>
        </div>
    )
}
