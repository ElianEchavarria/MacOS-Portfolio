'use client'

import React, { useEffect, useRef, useState } from 'react'
import LiquidGlass from '@/components/LiquidGlass'

/**
 * Menu-bar item with liquid glass that fades in behind it on hover.
 *
 * The glass stays mounted and is revealed with opacity rather than mounted on
 * hover: liquid-glass-react measures itself in an effect, so a fresh mount
 * shows its 270x69 default rim for one frame before correcting.
 */
const GlassHover = ({
    as: Tag = 'span',
    className = '',
    cornerRadius = 10,
    children,
    ...rest
}) => {
    const ref = useRef(null)
    const [size, setSize] = useState(null)

    // LiquidGlass sizes itself to its children, so it gets a spacer matching
    // the item's own box. Observed rather than measured once, because the
    // clock's width changes as the time does.
    useEffect(() => {
        const el = ref.current
        if (!el) return

        const measure = () => {
            const { width, height } = el.getBoundingClientRect()
            setSize({ width, height })
        }

        measure()
        const observer = new ResizeObserver(measure)
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <Tag ref={ref} className={`group relative ${className}`} {...rest}>
            {/* pointer-events-none keeps the hover target on the item itself;
                the glass reads the cursor from `mouseContainer` instead, which
                is what drives its elastic tilt. */}
            <span className='pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                {size && (
                    <LiquidGlass
                        mode='standard'
                        displacementScale={28}
                        blurAmount={0.11}
                        saturation={160}
                        aberrationIntensity={1.5}
                        elasticity={0.3}
                        cornerRadius={cornerRadius}
                        padding='0px'
                        mouseContainer={ref}
                        // display:flex is load-bearing. The library's outer div
                        // is block-level around an inline-flex pane, so a text
                        // line box makes it taller than the pane — and it
                        // centers itself with translate(-50%) of that inflated
                        // height, floating the glass above the item.
                        style={{ position: 'absolute', top: '50%', left: '50%', display: 'flex' }}
                    >
                        {/* `block` matters: the library forces 20px/1 on its
                            content wrapper, and an inline child would inherit
                            that strut and outgrow the item. */}
                        <span
                            className='block'
                            style={{ width: size.width, height: size.height }}
                        />
                    </LiquidGlass>
                )}
            </span>

            <span className='relative z-10'>{children}</span>
        </Tag>
    )
}

export default GlassHover
