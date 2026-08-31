'use client'

import React from 'react'
import LiquidGlass from "@/components/LiquidGlass"
import dockApps from "@/dockApp"
// import { Tooltip } from 'react-tooltip'
import { useGSAP } from '@gsap/react'
import { useEffect, useState } from 'react'
import gsap from "gsap"

const Dock = () => {
    // An odd dock width makes the library's translate(-50%) land on a half
    // pixel, which puts every icon on a fractional coordinate and softens them
    // on any display that isn't exactly 2x. The spare pixel goes on the right
    // only — splitting it would make the width even but shift the icons onto
    // half pixels instead, just moving the blur. Parity is read from the icon
    // row, so the padding it sets can't feed back into the measurement.
    const [iconRow, setIconRow] = useState(null);
    const [padRight, setPadRight] = useState(14);

    useEffect(() => {
        if (!iconRow) return;

        const keepWidthEven = () => {
            const { width } = iconRow.getBoundingClientRect();
            setPadRight(Math.round(width) % 2 === 0 ? 14 : 15);
        };

        keepWidthEven();
        const observer = new ResizeObserver(keepWidthEven);
        observer.observe(iconRow);
        return () => observer.disconnect();
    }, [iconRow]);

    useGSAP(() => {
        const row = iconRow;
        if (!row) return;

        // Measure the wrappers, not the buttons: a transform on the button
        // doesn't move its parent's layout box, so these centers stay at their
        // resting values even while the icons are mid-magnification. Reading
        // the buttons instead would feed each icon's own scale back into the
        // distance calculation and make the row jitter.
        const apps = [...row.querySelectorAll('.dock-app')].map((el) => ({
            el,
            icon: el.querySelector('.dock-item'),
        }));
        if (!apps.length) return;

        let centers = [];
        const measure = () => {
            const rowLeft = row.getBoundingClientRect().left;
            centers = apps.map(({ el }) => {
                const { left, width } = el.getBoundingClientRect();
                return left - rowLeft + width / 2;
            });
        };
        measure();

        const animateIcons = (mouseX) => {
            apps.forEach(({ icon }, i) => {
                const distance = Math.abs(mouseX - centers[i]);
                const intensity = Math.exp(-(distance ** 2) / 4200);

                gsap.to(icon, {
                    scale: 1 + 0.35 * intensity,
                    y: -16 * intensity,
                    duration: 0.22,
                    ease: "power2.out",
                    overwrite: "auto",
                    // Keeps GSAP from adding translateZ(0), which would promote
                    // the icon to a GPU layer and freeze its raster scale —
                    // the magnified icon would then be an upscaled bitmap.
                    force3D: false,
                });
            });
        };

        const handleMouseMove = (e) => {
            animateIcons(e.clientX - row.getBoundingClientRect().left);
        };

        const resetIcons = () => {
            apps.forEach(({ icon }) => {
                gsap.to(icon, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: "auto",
                    force3D: false,
                });
            });
        };

        row.addEventListener("mousemove", handleMouseMove);
        row.addEventListener("mouseleave", resetIcons);
        window.addEventListener("resize", measure);

        return () => {
            row.removeEventListener("mousemove", handleMouseMove);
            row.removeEventListener("mouseleave", resetIcons);
            window.removeEventListener("resize", measure);
        };
    }, [iconRow]);


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
                padding={`10px ${padRight}px 10px 14px`}
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
                <div ref={setIconRow} className="flex items-end gap-2">
                    {dockApps.map(({ id, name, icon, canOpen, section, fullBleed }) => (
                        <React.Fragment key={id}>
                            {section === 'trash' && (
                                <span className="mx-1 h-12 w-px self-center bg-white/30" />
                            )}
                            <div className="dock-app group relative flex flex-col items-center">
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
                                        draggable={false}
                                        // size-12 rather than scale-[0.84]: the
                                        // transform rendered these at 47.04px and
                                        // resampled an already-rasterized layer,
                                        // where a plain 48px box lets the browser
                                        // sample the source directly.
                                        className={`object-contain drop-shadow-md ${fullBleed ? 'size-12' : 'size-full'} ${canOpen ? '' : 'opacity-60'}`}
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
