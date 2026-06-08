'use client'

import { useRef } from "react"
import React from 'react'
import dockApps from "@/dockApp"

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
                className="dock-glass flex items-end gap-2 rounded-3xl px-3 py-2"
            >
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
        </section>
    )
}

export default Dock
