'use client'

import React from 'react'
import LiquidGlass from "@/components/LiquidGlass"
import dockApps from "@/dockApp"
// import { Tooltip } from 'react-tooltip'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import gsap from "gsap"

const Dock = () => {
    const dockRef = useRef(null);

    useGSAP(() => {
        const dock = dockRef.current;
        if (!dock) return;

        const icons = dock.querySelectorAll(".dock-icon");

        const animateIcons = (mouseX) => {
            const { left } = dock.getBoundClientRect();

            icons.forEach((icon) => {
                const { left: iconsLeft, width } = icons.getBoundClientRect();
                const center = iconsLeft - left + width / 2;
                const distance = Math.abs(mouseX - center);

                const intensity = Math.exp(-(distance ** 2.5) / 20000);

                gsap.to(icon, {
                    scale: 1 + 0.25 * intensity,
                    y: -15 * intensity,
                    duration: 0.2,
                    ease: "power1.out",
                })
            });
        };

        const handleMouseMove = (e) => {
            const { left } = dock.getBoundClientRect();

            animateIcons(e.clientX - left);

        };

        const resetIcons = () => icons.forEach((icon) => {
            gsap.to(icon, {
                scale: 1, y: 0, duration: 0.3, ease: "power1.out",
            })
        });

        dock.addEventListener('mouseover', handleMouseMove);
        dock.addEventListener('mouseleave', resetIcons);

        return () => {
            dock.removeEventListener("mousemove", handleMouseMove);
            dock.removeEventListener("mouseleave", resetIcons)
        };
    }, []);


    const toggleApp = (app) => {
        if (!app.canOpen) return;
        // TODO: open/close the window for app.id
    }

    return (
        // Own stacking context: the library's rim-highlight layers are DOM
        // siblings of the glass, so z-index has to live on the parent or it
        // would paint them underneath.
        <section id="dock" className="relative z-50 select-none max-sm:hidden">
            <LiquidGlass
                className="dock-glass"
                // "shader" is the library's most accurate mode but it throws on
                // mount (createImageData with zero width) and renders nothing.
                mode="standard"
                displacementScale={70}
                blurAmount={0.06}
                saturation={140}
                aberrationIntensity={2}
                elasticity={0.22}
                cornerRadius={32}
                padding="10px 14px"
                // LiquidGlass always centers itself on its top/left via a
                // translate(-50%,-50%), so it needs explicit coordinates.
                // display:flex stops the library's block-level outer div from
                // adding a text line box around the inline-flex pane, which
                // would make it taller than the dock and throw off both the
                // centering and the rim highlight.
                style={{
                    position: 'fixed',
                    top: 'var(--dock-top)',
                    left: '50%',
                    display: 'flex',
                    pointerEvents: 'auto',
                }}
            >
                <div className="flex items-end gap-2">
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
                                    data-tooltip-content={name}
                                    data-tooltip-id='dock-tooltip'
                                    data-tooltip-delay-show={150}
                                    disabled={!canOpen}
                                    onClick={() => toggleApp({ id, canOpen })}
                                    className="dock-item flex size-14 cursor-pointer items-center justify-center disabled:cursor-not-allowed"
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
            </LiquidGlass>
        </section>
    )
}

export default Dock
