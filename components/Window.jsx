'use client'

import React, { useRef } from 'react'
import useWindowStore from '@/store/window'
import { fitToDesktop } from '@/windowConfig'

// Each handle names the edges it drags, so one handler covers all eight. They
// sit a couple of pixels outside the panel: the panel's rounded corners clip
// their own corner pixels out of hit-testing, so a handle flush with the edge
// would be ungrabbable exactly where people aim for it.
const RESIZE_HANDLES = [
    { dir: 'n', className: '-top-0.5 left-4 right-4 h-2 cursor-ns-resize' },
    { dir: 's', className: '-bottom-0.5 left-4 right-4 h-2 cursor-ns-resize' },
    { dir: 'w', className: '-left-0.5 top-4 bottom-4 w-2 cursor-ew-resize' },
    { dir: 'e', className: '-right-0.5 top-4 bottom-4 w-2 cursor-ew-resize' },
    { dir: 'nw', className: '-top-0.5 -left-0.5 size-4 cursor-nwse-resize' },
    { dir: 'ne', className: '-top-0.5 -right-0.5 size-4 cursor-nesw-resize' },
    { dir: 'sw', className: '-bottom-0.5 -left-0.5 size-4 cursor-nesw-resize' },
    { dir: 'se', className: '-bottom-0.5 -right-0.5 size-4 cursor-nwse-resize' },
]

/**
 * Runs a pointer drag against window-level listeners, so the gesture survives
 * the cursor outrunning the element it started on.
 *
 * Moves are coalesced onto animation frames. pointermove fires at the mouse's
 * polling rate — 1000Hz on a gaming mouse — so handling every event would do
 * several times more work per frame than the screen can ever show. `onMove`
 * runs at most once per frame; `onEnd` gets the last delta to commit.
 */
const startDrag = (event, onMove, onEnd) => {
    event.preventDefault()

    const startX = event.clientX
    const startY = event.clientY

    let dx = 0
    let dy = 0
    let frame = null

    document.documentElement.dataset.windowDragging = 'true'

    const flush = () => {
        frame = null
        onMove(dx, dy)
    }

    const handleMove = (e) => {
        dx = e.clientX - startX
        dy = e.clientY - startY
        if (frame === null) frame = requestAnimationFrame(flush)
    }

    const handleUp = () => {
        if (frame !== null) cancelAnimationFrame(frame)
        delete document.documentElement.dataset.windowDragging

        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)

        onEnd(dx, dy)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
}

const TrafficLight = ({ color, symbol, label, onClick, disabled }) => (
    <button
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        // The dot keeps its colour while the glyph only appears on hover,
        // matching how macOS reveals the symbols.
        className={`flex size-3 items-center justify-center rounded-full text-[8px] font-bold leading-none text-black/60 transition-opacity ${color} ${disabled ? 'opacity-40' : ''}`}
    >
        <span className="opacity-0 group-hover/lights:opacity-100">
            {disabled ? '' : symbol}
        </span>
    </button>
)

const Window = ({ id, children }) => {
    const nodeRef = useRef(null)

    const win = useWindowStore((s) => s.windows.find((w) => w.id === id))

    const focusWindow = useWindowStore((s) => s.focusWindow)
    const closeWindow = useWindowStore((s) => s.closeWindow)
    const minimizeWindow = useWindowStore((s) => s.minimizeWindow)
    const toggleMaximize = useWindowStore((s) => s.toggleMaximize)
    const moveWindow = useWindowStore((s) => s.moveWindow)
    const setBounds = useWindowStore((s) => s.setBounds)

    if (!win || win.isMinimized) return null

    const { title, position, size, minSize, resizable, zIndex, isMaximized } = win

    // During a gesture the geometry is written straight to the node and the
    // store is left alone, so no frame costs an immer draft plus a React
    // render. The store is the source of truth again the moment it's committed
    // on pointerup, and the committed value matches what's on screen, so the
    // re-render is a no-op rather than a jump.
    const paint = ({ x, y, width, height }) => {
        const node = nodeRef.current
        if (!node) return

        node.style.left = `${x}px`
        node.style.top = `${y}px`
        if (width !== undefined) node.style.width = `${width}px`
        if (height !== undefined) node.style.height = `${height}px`
    }

    const handleTitleBarDown = (event) => {
        focusWindow(id)
        if (isMaximized) return

        const origin = { ...position, ...size }
        const at = (dx, dy) =>
            fitToDesktop({ x: origin.x + dx, y: origin.y + dy, ...size })

        startDrag(
            event,
            (dx, dy) => paint(at(dx, dy)),
            (dx, dy) => {
                const end = at(dx, dy)
                moveWindow(id, end.x, end.y)
            }
        )
    }

    const handleResizeDown = (dir) => (event) => {
        event.stopPropagation()
        focusWindow(id)

        const start = { ...position, ...size }

        // minSize is applied here rather than in the store: when the north or
        // west edge is dragged, the opposite edge has to stay pinned, so
        // whoever clamps the size also has to adjust the position.
        const at = (dx, dy) => {
            let { x, y, width, height } = start

            if (dir.includes('e')) {
                width = Math.max(minSize.width, start.width + dx)
            }
            if (dir.includes('s')) {
                height = Math.max(minSize.height, start.height + dy)
            }
            if (dir.includes('w')) {
                width = Math.max(minSize.width, start.width - dx)
                x = start.x + (start.width - width)
            }
            if (dir.includes('n')) {
                height = Math.max(minSize.height, start.height - dy)
                y = start.y + (start.height - height)
            }

            return fitToDesktop({ x, y, width, height })
        }

        startDrag(
            event,
            (dx, dy) => paint(at(dx, dy)),
            (dx, dy) => setBounds(id, at(dx, dy))
        )
    }

    return (
        <section
            ref={nodeRef}
            aria-label={title}
            onPointerDown={() => focusWindow(id)}
            style={{
                left: position.x,
                top: position.y,
                width: size.width,
                height: size.height,
                zIndex,
            }}
            className="fixed"
        >
            {/* The clipping lives on this inner panel, not the section, so the
                resize handles below stay outside it and keep their hit area. */}
            <div className="window-panel flex h-full flex-col overflow-hidden rounded-xl">
            {/* Title bar */}
            <header
                onPointerDown={handleTitleBarDown}
                onDoubleClick={() => toggleMaximize(id)}
                className={`relative flex h-9 shrink-0 items-center border-b border-white/10 bg-white/5 px-3 ${isMaximized ? '' : 'cursor-grab active:cursor-grabbing'}`}
            >
                <div
                    className="group/lights flex items-center gap-2"
                    // Keeps a click on the buttons from starting a window drag.
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <TrafficLight
                        color="bg-[#FF5F57]"
                        symbol="✕"
                        label={`Close ${title}`}
                        onClick={() => closeWindow(id)}
                    />
                    <TrafficLight
                        color="bg-[#FEBC2E]"
                        symbol="—"
                        label={`Minimize ${title}`}
                        onClick={() => minimizeWindow(id)}
                    />
                    <TrafficLight
                        color="bg-[#28C840]"
                        symbol="+"
                        label={`Zoom ${title}`}
                        disabled={!resizable}
                        onClick={() => toggleMaximize(id)}
                    />
                </div>

                <span className="pointer-events-none absolute inset-x-0 text-center font-inter text-[13px] font-medium text-white/80">
                    {title}
                </span>
            </header>

            <div className="min-h-0 flex-1 overflow-auto text-white/90">
                {children}
            </div>
            </div>

            {resizable && !isMaximized && RESIZE_HANDLES.map(({ dir, className }) => (
                <span
                    key={dir}
                    onPointerDown={handleResizeDown(dir)}
                    className={`absolute z-10 ${className}`}
                />
            ))}
        </section>
    )
}

export default Window
