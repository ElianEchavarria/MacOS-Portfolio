'use client'

import React, { useEffect, useState } from 'react'
import BootScreen from './BootScreen'
import LockScreen from './LockScreen'

const BOOT_DURATION = 3800

const BootSequence = ({ children }) => {
    // 'boot' -> 'lock' -> 'desktop'
    const [phase, setPhase] = useState('boot')

    useEffect(() => {
        if (phase !== 'boot') return
        const t = setTimeout(() => setPhase('lock'), BOOT_DURATION)
        return () => clearTimeout(t)
    }, [phase])

    return (
        <>
            {children}
            {phase === 'boot' && <BootScreen />}
            {phase === 'lock' && <LockScreen onUnlock={() => setPhase('desktop')} />}
        </>
    )
}

export default BootSequence
