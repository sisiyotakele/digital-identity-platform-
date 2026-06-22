'use client'

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { Children, cloneElement, useEffect, useMemo, useRef, useState, type ReactElement } from 'react'

interface SpringOptions { mass?: number; stiffness?: number; damping?: number }

interface DockItemData {
    icon: React.ReactNode
    label: string
    onClick: () => void
    className?: string
}

interface DockItemProps {
    children: ReactElement[]
    className?: string
    onClick?: () => void
    mouseX: ReturnType<typeof useMotionValue<number>>
    spring: SpringOptions
    distance: number
    magnification: number
    baseItemSize: number
    label: string
    isHovered?: ReturnType<typeof useMotionValue<number>>
}

function DockItem({ children, className = '', onClick, mouseX, spring, distance, magnification, baseItemSize, label }: DockItemProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isHovered = useMotionValue(0)

    const mouseDistance = useTransform(mouseX, (val) => {
        const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize }
        return val - rect.x - baseItemSize / 2
    })

    const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize])
    const size = useSpring(targetSize, spring)

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.() }
    }

    return (
        <motion.div
            ref={ref}
            style={{ width: size, height: size }}
            onHoverStart={() => isHovered.set(1)}
            onHoverEnd={() => isHovered.set(0)}
            onFocus={() => isHovered.set(1)}
            onBlur={() => isHovered.set(0)}
            onClick={onClick}
            className={`dock-item ${className}`}
            tabIndex={0}
            role="button"
            aria-label={label}
            onKeyDown={handleKeyDown}
        >
            {Children.map(children, (child) =>
                cloneElement(child as ReactElement<{ isHovered: ReturnType<typeof useMotionValue<number>> }>, { isHovered })
            )}
        </motion.div>
    )
}

function DockLabel({ children, className = '', isHovered }: {
    children: React.ReactNode
    className?: string
    isHovered?: ReturnType<typeof useMotionValue<number>>
}) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (!isHovered) return
        const unsub = isHovered.on('change', (v) => setIsVisible(v === 1))
        return unsub
    }, [isHovered])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: -10 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.18 }}
                    className={`dock-label ${className}`}
                    role="tooltip"
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

function DockIcon({ children, className = '', isHovered }: {
    children: React.ReactNode
    className?: string
    isHovered?: ReturnType<typeof useMotionValue<number>>
}) {
    return <div className={`dock-icon ${className}`}>{children}</div>
}

interface DockProps {
    items: DockItemData[]
    className?: string
    spring?: SpringOptions
    magnification?: number
    distance?: number
    panelHeight?: number
    dockHeight?: number
    baseItemSize?: number
}

export function Dock({
    items,
    className = '',
    spring = { mass: 0.1, stiffness: 150, damping: 12 },
    magnification = 56,
    distance = 200,
    panelHeight = 60,
    dockHeight = 220,
    baseItemSize = 42,
}: DockProps) {
    const mouseX = useMotionValue(Infinity)
    const isHovered = useMotionValue(0)

    const maxHeight = useMemo(
        () => Math.max(dockHeight, magnification + magnification / 2 + 4),
        [magnification, dockHeight]
    )
    const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight])
    const height = useSpring(heightRow, spring)

    return (
        <motion.div style={{ height, scrollbarWidth: 'none' }} className="dock-outer">
            <motion.div
                onMouseMove={({ pageX }) => { isHovered.set(1); mouseX.set(pageX) }}
                onMouseLeave={() => { isHovered.set(0); mouseX.set(Infinity) }}
                className={`dock-panel ${className}`}
                style={{ height: panelHeight }}
                role="toolbar"
                aria-label="Navigation dock"
            >
                {items.map((item, i) => (
                    <DockItem
                        key={i}
                        onClick={item.onClick}
                        className={item.className}
                        mouseX={mouseX}
                        spring={spring}
                        distance={distance}
                        magnification={magnification}
                        baseItemSize={baseItemSize}
                        label={item.label}
                    >
                        <DockIcon>{item.icon}</DockIcon>
                        <DockLabel>{item.label}</DockLabel>
                    </DockItem>
                ))}
            </motion.div>
        </motion.div>
    )
}
