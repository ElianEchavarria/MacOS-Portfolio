'use client'

import { useRef } from "react"
import React from 'react'
import dockApps from "@/dockApp"

/*
 * Displacement map for the liquid-glass refraction.
 * Red channel = horizontal shift, green = vertical shift; 50% gray = no shift.
 * The blurred neutral-gray inner rect keeps the center optically flat, so the
 * backdrop only bends near the rim — the way Apple's Liquid Glass refracts.
 */
const DISPLACEMENT_MAP = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="100">
  <defs>
    <linearGradient id="dx" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff0000"/>
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>
    <linearGradient id="dy" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#00ff00"/>
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>
    <filter id="soften"><feGaussianBlur stdDeviation="8"/></filter>
  </defs>
  <rect width="1000" height="100" fill="#808080"/>
  <g filter="url(#soften)">
    <rect width="1000" height="100" rx="50" fill="url(#dx)"/>
    <rect width="1000" height="100" rx="50" fill="url(#dy)" style="mix-blend-mode:screen"/>
    <rect x="22" y="22" width="956" height="56" rx="28" fill="#808080"/>
  </g>
</svg>`

const Dock = () => {
    const dockRef = useRef(null);

    const toggleApp = (app) => {
        if (!app.canOpen) return;
        // TODO: open/close the window for app.id
    }

    return (
        <section
            id="dock"
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-50 select-none max-sm:hidden"
        >
            <div
                ref={dockRef}
                className="liquidGlass-wrapper dock items-end px-3 py-2"
            >
                {/* Liquid glass layers */}
                <div className="liquidGlass-effect" />
                <div className="liquidGlass-tint" />
                <div className="liquidGlass-shine" />

                {/* Icon row (sits above the glass layers) */}
                <div className="relative z-10 flex items-end gap-2">
                {dockApps.map(({ id, name, icon, canOpen, section, fullBleed }) => (
                    <React.Fragment key={id}>
                        {section === 'trash' && (
                            <span className="mx-1 h-12 w-px self-center bg-white/30" />
                        )}
                    <div className="group relative flex flex-col items-center">
                        {/* Glass tooltip */}
                        <span
                            className="dock-tooltip pointer-events-none absolute -top-16 whitespace-nowrap rounded-lg px-3 py-1 text-xs font-medium text-white opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
                        >
                            {name}
                        </span>

                        <button
                            type="button"
                            aria-label={name}
                            disabled={!canOpen}
                            onClick={() => toggleApp({ id, canOpen })}
                            className="dock-item flex size-14 3xl:size-16 cursor-pointer items-center justify-center disabled:cursor-not-allowed"
                        >
                            <img
                                src={`/${icon}`}
                                alt={name}
                                loading="lazy"
                                draggable={false}
                                className={`size-full object-contain drop-shadow-md ${fullBleed ? 'scale-[0.84]' : ''} ${canOpen ? '' : 'opacity-60'}`}
                            />
                        </button>

                        {/* Running-app indicator */}
                        <span
                            className={`absolute -bottom-1 size-1 rounded-full bg-white/80 transition-opacity ${canOpen ? 'opacity-100' : 'opacity-0'}`}
                        />
                    </div>
                    </React.Fragment>
                ))}
                </div>
            </div>

            {/* SVG refraction filter used by .liquidGlass-effect — bends the
                backdrop at the rim only, leaving the center optically clear */}
            <svg aria-hidden="true" width="0" height="0" className="absolute">
                <defs>
                    <filter
                        id="glass-distortion"
                        x="0%"
                        y="0%"
                        width="100%"
                        height="100%"
                        filterUnits="objectBoundingBox"
                    >
                        <feImage
                            href={`data:image/svg+xml,${encodeURIComponent(DISPLACEMENT_MAP)}`}
                            x="0"
                            y="0"
                            width="100%"
                            height="100%"
                            preserveAspectRatio="none"
                            result="map"
                        />
                        {/* Chromatic aberration: each color channel refracts at a
                            slightly different strength, then they're recombined —
                            produces the subtle RGB fringing of real glass edges */}
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="map"
                            scale="68"
                            xChannelSelector="R"
                            yChannelSelector="G"
                            result="dispRed"
                        />
                        <feColorMatrix
                            in="dispRed"
                            type="matrix"
                            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                            result="red"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="map"
                            scale="60"
                            xChannelSelector="R"
                            yChannelSelector="G"
                            result="dispGreen"
                        />
                        <feColorMatrix
                            in="dispGreen"
                            type="matrix"
                            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                            result="green"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="map"
                            scale="52"
                            xChannelSelector="R"
                            yChannelSelector="G"
                            result="dispBlue"
                        />
                        <feColorMatrix
                            in="dispBlue"
                            type="matrix"
                            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                            result="blue"
                        />
                        <feBlend in="red" in2="green" mode="screen" result="redGreen" />
                        <feBlend in="redGreen" in2="blue" mode="screen" />
                    </filter>
                </defs>
            </svg>
        </section>
    )
}

export default Dock
