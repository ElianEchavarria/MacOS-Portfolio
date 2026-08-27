'use client'

import dynamic from 'next/dynamic'

// liquid-glass-react reads `navigator` during render, so it cannot be
// server-rendered. Every consumer should import it from here.
const LiquidGlass = dynamic(() => import('liquid-glass-react'), { ssr: false })

export default LiquidGlass
