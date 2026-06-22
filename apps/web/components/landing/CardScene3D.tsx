'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export function CardScene3DCanvas() {
    const mountRef = useRef<HTMLDivElement>(null)
    const [flipped, setFlipped] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const flipRef = useRef(false)

    useEffect(() => {
        const container = mountRef.current
        if (!container) return

        let animId: number
        let THREE: typeof import('three')
        let renderer: import('three').WebGLRenderer
        let scene: import('three').Scene
        let camera: import('three').PerspectiveCamera
        let cardGroup: import('three').Group
        let particles: import('three').Points
        let orbGroup: import('three').Group

        async function init() {
            if (!container) return
            THREE = await import('three')

            const W = container.clientWidth || 480
            const H = container.clientHeight || 500

            // Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
            renderer.setSize(W, H)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            renderer.shadowMap.enabled = true
            renderer.shadowMap.type = THREE.PCFSoftShadowMap
            renderer.toneMapping = THREE.ACESFilmicToneMapping
            renderer.toneMappingExposure = 1.3
            container.appendChild(renderer.domElement)

            // Scene
            scene = new THREE.Scene()

            // Camera
            camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
            camera.position.set(0, 1, 6)
            camera.lookAt(0, 0, 0)

            // Lights
            const ambient = new THREE.AmbientLight(0xffffff, 0.4)
            scene.add(ambient)

            const spot1 = new THREE.SpotLight(0x6366f1, 60)
            spot1.position.set(4, 6, 3)
            spot1.angle = 0.4
            spot1.penumbra = 0.8
            spot1.castShadow = true
            scene.add(spot1)

            const spot2 = new THREE.SpotLight(0x3b82f6, 40)
            spot2.position.set(-4, 4, -2)
            spot2.angle = 0.5
            spot2.penumbra = 1
            scene.add(spot2)

            const pt = new THREE.PointLight(0xa5b4fc, 30)
            pt.position.set(0, 3, 2)
            scene.add(pt)

            const ptBack = new THREE.PointLight(0x7c3aed, 15)
            ptBack.position.set(0, -1, -3)
            scene.add(ptBack)

            // ── Business Card ─────────────────────────
            cardGroup = new THREE.Group()

            const cW = 3.2, cH = 2.0, cD = 0.06

            // Card body
            const cardGeo = new THREE.BoxGeometry(cW, cH, cD)
            const edgeMat = new THREE.MeshStandardMaterial({ color: 0x4f46e5, metalness: 0.5, roughness: 0.15 })
            const cardMesh = new THREE.Mesh(cardGeo, edgeMat)
            cardMesh.castShadow = true
            cardGroup.add(cardMesh)

            // Front face
            const frontCanvas = document.createElement('canvas')
            frontCanvas.width = 640; frontCanvas.height = 400
            const fCtx = frontCanvas.getContext('2d')!
            drawCardFront(fCtx, 640, 400)
            const frontTex = new THREE.CanvasTexture(frontCanvas)
            const frontMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(cW - 0.02, cH - 0.02),
                new THREE.MeshStandardMaterial({ map: frontTex, metalness: 0.1, roughness: 0.3 })
            )
            frontMesh.position.z = cD / 2 + 0.001
            cardGroup.add(frontMesh)

            // Back face
            const backCanvas = document.createElement('canvas')
            backCanvas.width = 640; backCanvas.height = 400
            const bCtx = backCanvas.getContext('2d')!
            drawCardBack(bCtx, 640, 400)
            const backTex = new THREE.CanvasTexture(backCanvas)
            const backMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(cW - 0.02, cH - 0.02),
                new THREE.MeshStandardMaterial({ map: backTex, metalness: 0.2, roughness: 0.2 })
            )
            backMesh.position.z = -(cD / 2 + 0.001)
            backMesh.rotation.y = Math.PI
            cardGroup.add(backMesh)

            scene.add(cardGroup)

            // ── Particle system ───────────────────────
            const pCount = 180
            const pPositions = new Float32Array(pCount * 3)
            for (let i = 0; i < pCount; i++) {
                pPositions[i * 3] = (Math.random() - 0.5) * 16
                pPositions[i * 3 + 1] = (Math.random() - 0.5) * 12
                pPositions[i * 3 + 2] = (Math.random() - 0.5) * 10
            }
            const pGeo = new THREE.BufferGeometry()
            pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))
            const pMat = new THREE.PointsMaterial({ size: 0.03, color: 0x818cf8, transparent: true, opacity: 0.7, sizeAttenuation: true })
            particles = new THREE.Points(pGeo, pMat)
            scene.add(particles)

            // ── Feature orbs ─────────────────────────
            orbGroup = new THREE.Group()
            const orbData = [
                { pos: [-2.8, 0.5, -0.3] as [number, number, number], color: 0x6366f1 },
                { pos: [2.8, 0.3, -0.3] as [number, number, number], color: 0x3b82f6 },
                { pos: [0, 1.8, -1.2] as [number, number, number], color: 0x7c3aed },
            ]
            orbData.forEach(({ pos, color }) => {
                const orb = new THREE.Mesh(
                    new THREE.SphereGeometry(0.22, 32, 32),
                    new THREE.MeshStandardMaterial({ color, metalness: 0.4, roughness: 0.2, transparent: true, opacity: 0.85 })
                )
                orb.position.set(...pos)
                orbGroup.add(orb)

                // Glow ring
                const ring = new THREE.Mesh(
                    new THREE.TorusGeometry(0.3, 0.015, 8, 32),
                    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.4 })
                )
                ring.position.set(...pos)
                orbGroup.add(ring)
            })
            scene.add(orbGroup)

            // ── Ground plane ─────────────────────────
            const groundMat = new THREE.MeshStandardMaterial({ color: 0x050510, metalness: 0.8, roughness: 0.2 })
            const ground = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), groundMat)
            ground.rotation.x = -Math.PI / 2
            ground.position.y = -2.2
            ground.receiveShadow = true
            scene.add(ground)

            setLoaded(true)

            // ── Animate ───────────────────────────────
            let t = 0
            let currentFlip = 0

            function animate() {
                animId = requestAnimationFrame(animate)
                t += 0.008

                // Camera orbit
                camera.position.x = Math.sin(t * 0.15) * 5.8
                camera.position.z = Math.cos(t * 0.15) * 5.8
                camera.position.y = 1.2 + Math.sin(t * 0.07) * 0.4
                camera.lookAt(0, 0, 0)

                // Card float
                cardGroup.position.y = Math.sin(t * 0.6) * 0.15

                // Card flip
                const targetFlip = flipRef.current ? Math.PI : 0
                currentFlip += (targetFlip - currentFlip) * 0.06
                cardGroup.rotation.y = currentFlip

                // Card gentle rotation
                cardGroup.rotation.x = Math.sin(t * 0.4) * 0.04
                cardGroup.rotation.z = Math.sin(t * 0.3) * 0.02

                // Particles drift
                const pos = particles.geometry.attributes['position']!.array as Float32Array
                for (let i = 0; i < pCount; i++) {
                    pos[i * 3 + 1] += 0.004
                    if (pos[i * 3 + 1] > 6) pos[i * 3 + 1] = -6
                }
                particles.geometry.attributes['position']!.needsUpdate = true
                particles.rotation.y += 0.0005

                // Orbs float
                orbGroup.children.forEach((child, i) => {
                    child.position.y = child.userData['baseY'] ?? child.position.y
                    child.position.y += Math.sin(t * 0.8 + i * 1.2) * 0.12
                    if (!child.userData['baseY']) child.userData['baseY'] = child.position.y
                })
                orbGroup.rotation.y += 0.003

                renderer.render(scene, camera)
            }
            animate()
        }

        // Handle resize
        function onResize() {
            if (!container || !renderer || !camera) return
            const W = container.clientWidth
            const H = container.clientHeight
            renderer.setSize(W, H)
            camera.aspect = W / H
            camera.updateProjectionMatrix()
        }
        window.addEventListener('resize', onResize)

        init()

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', onResize)
            if (renderer) {
                renderer.dispose()
                container.removeChild(renderer.domElement)
            }
        }
    }, [])

    // Sync flip state to ref (avoids stale closure)
    useEffect(() => {
        flipRef.current = flipped
    }, [flipped])

    return (
        <div className="relative w-full h-[420px] sm:h-[500px]">
            <div ref={mountRef} className="w-full h-full" />

            {/* Click to flip */}
            <button
                onClick={() => setFlipped((f) => !f)}
                className="absolute inset-0 z-10 cursor-pointer"
                aria-label="Flip card"
            />

            {/* Loading state */}
            {!loaded && <CardSceneFallback />}

            {/* Hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-20">
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="flex items-center gap-2 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2"
                >
                    <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-white/80 font-medium">Click to flip · Camera auto-rotates</span>
                </motion.div>
            </div>
        </div>
    )
}

/* ── Canvas 2D card front ────────────────────── */
function drawCardFront(ctx: CanvasRenderingContext2D, w: number, h: number) {
    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, w, h)
    grad.addColorStop(0, '#4338ca')
    grad.addColorStop(0.5, '#6d28d9')
    grad.addColorStop(1, '#312e81')
    ctx.fillStyle = grad
    roundRect(ctx, 0, 0, w, h, 24)
    ctx.fill()

    // Subtle grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'
    ctx.lineWidth = 1
    for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
    for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }

    // Light sweep
    const sweep = ctx.createLinearGradient(0, 0, w * 0.6, h * 0.4)
    sweep.addColorStop(0, 'rgba(255,255,255,0.00)')
    sweep.addColorStop(0.4, 'rgba(255,255,255,0.07)')
    sweep.addColorStop(1, 'rgba(255,255,255,0.00)')
    ctx.fillStyle = sweep
    ctx.fillRect(0, 0, w, h)

    // UNIQUE brand
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.font = 'bold 18px Arial'
    ctx.letterSpacing = '6px'
    ctx.fillText('UNIQUE', 44, 54)

    // Avatar circle
    ctx.beginPath()
    ctx.arc(80, 170, 44, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.18)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = 'bold 26px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('AA', 80, 178)
    ctx.textAlign = 'left'

    // Name
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 34px Arial'
    ctx.fillText('Abel Abebe', 44, 270)

    // Title
    ctx.fillStyle = '#a5b4fc'
    ctx.font = '500 22px Arial'
    ctx.fillText('Senior Product Designer', 44, 308)

    // Company
    ctx.fillStyle = 'rgba(165,180,252,0.6)'
    ctx.font = '18px Arial'
    ctx.fillText('UNIQUE Digital Card', 44, 338)

    // Contact icons row
    const icons = ['📞', '✉', '💼', '🌐']
    icons.forEach((icon, i) => {
        ctx.beginPath()
        ctx.roundRect(44 + i * 58, 362, 48, 28, 8)
        ctx.fillStyle = 'rgba(255,255,255,0.12)'
        ctx.fill()
        ctx.font = '14px Arial'
        ctx.fillText(icon, 55 + i * 58, 381)
    })

    // NFC rings top-right
    ctx.strokeStyle = 'rgba(165,180,252,0.5)'
    ctx.lineWidth = 2
        ;[18, 28, 38].forEach((r) => {
            ctx.beginPath()
            ctx.arc(w - 56, 56, r, -Math.PI * 0.6, Math.PI * 0.6)
            ctx.stroke()
        })
}

/* ── Canvas 2D card back ─────────────────────── */
function drawCardBack(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const grad = ctx.createLinearGradient(0, 0, w, h)
    grad.addColorStop(0, '#0f172a')
    grad.addColorStop(1, '#1e1b4b')
    ctx.fillStyle = grad
    roundRect(ctx, 0, 0, w, h, 24)
    ctx.fill()

    // Dot pattern
    ctx.fillStyle = 'rgba(99,102,241,0.12)'
    for (let x = 20; x < w; x += 24) {
        for (let y = 20; y < h; y += 24) {
            ctx.beginPath()
            ctx.arc(x, y, 1.5, 0, Math.PI * 2)
            ctx.fill()
        }
    }

    // QR code white box
    const qrX = w / 2 - 76, qrY = 60, qrS = 152
    ctx.fillStyle = '#ffffff'
    roundRect(ctx, qrX, qrY, qrS, qrS, 12)
    ctx.fill()

    // QR pixels
    ctx.fillStyle = '#0f172a'
    const cells = 8
    const cs = (qrS - 16) / cells
    const pattern = [
        [1, 1, 1, 1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0, 0, 1, 0],
        [1, 0, 1, 1, 1, 0, 1, 0],
        [1, 0, 1, 1, 1, 0, 1, 1],
        [1, 0, 1, 1, 1, 0, 1, 0],
        [1, 0, 0, 0, 0, 0, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
    ]
    pattern.forEach((row, ry) => {
        row.forEach((val, rx) => {
            if (val) {
                ctx.fillRect(qrX + 8 + rx * cs, qrY + 8 + ry * cs, cs - 2, cs - 2)
            }
        })
    })

    // Scan label
    ctx.fillStyle = '#a5b4fc'
    ctx.font = '500 20px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Scan to connect', w / 2, 238)

    // Branding
    ctx.fillStyle = 'rgba(99,102,241,0.4)'
    ctx.font = 'bold 14px Arial'
    ctx.letterSpacing = '4px'
    ctx.fillText('UNIQUE DIGITAL CARD', w / 2, 270)
    ctx.textAlign = 'left'
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
}

function CardSceneFallback() {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
                animate={{ y: [0, -12, 0], rotateZ: [0, 2, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-72 h-44 rounded-3xl bg-gradient-to-br from-blue-600 via-violet-700 to-indigo-800 shadow-2xl shadow-blue-500/40 flex items-center justify-center"
            >
                <div className="text-white/20 text-6xl">💳</div>
            </motion.div>
        </div>
    )
}
