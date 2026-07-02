'use client'

import React, { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'

const LockScreen = ({ onUnlock }) => {
    const [now, setNow] = useState(() => new Date())
    const [exiting, setExiting] = useState(false)
    const exitingRef = useRef(false)

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000 * 15)
        return () => clearInterval(id)
    }, [])

    const unlock = () => {
        if (exitingRef.current) return
        exitingRef.current = true
        setExiting(true)
        setTimeout(() => onUnlock?.(), 600)
    }

    useEffect(() => {
        const handler = () => unlock()
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [])

    const d = dayjs(now)

    return (
        <div
            onClick={unlock}
            className={`fixed inset-0 z-[90] flex cursor-pointer flex-col items-center bg-cover bg-center transition-opacity duration-500 ${exiting ? 'opacity-0' : 'opacity-100'}`}
            style={{ backgroundImage: 'url("/MacOSBackground.png")' }}
        >
            {/* Date + time */}
            <div className="mt-[7vh] flex flex-col items-center">
                <p className="font-sf text-xl font-semibold tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
                    {d.format('ddd MMM D')}
                </p>
                <p className="lockscreen-clock font-sf text-[8rem] font-bold leading-none tracking-tight max-md:text-[5.5rem]">
                    {d.format('h:mm')}
                </p>
            </div>

            {/* User / unlock hint */}
            <div className="absolute bottom-[9vh] flex flex-col items-center text-white">
                <div className="flex size-16 items-center justify-center rounded-full border border-white/30 bg-white/20 text-2xl font-medium backdrop-blur-md drop-shadow-lg">
                    EE
                </div>
                <p className="mt-3 text-sm font-medium drop-shadow">Elian Echavarria</p>
                <p className="mt-1 text-xs text-white/80 drop-shadow">Touch ID or Enter Password</p>
            </div>
        </div>
    )
}

export default LockScreen
