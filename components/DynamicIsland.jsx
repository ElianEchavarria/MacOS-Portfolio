'use client'

import React, { useEffect, useState } from 'react'
import { Pause, Play } from 'lucide-react'

import nowPlaying from '@/nowPlaying'

const BAR_DELAYS = ['0ms', '150ms', '300ms', '450ms']

const formatTime = (seconds) => {
    const whole = Math.max(0, Math.floor(seconds))
    const mins = Math.floor(whole / 60)
    const secs = whole % 60
    return `${mins}:${String(secs).padStart(2, '0')}`
}

const Bars = ({ playing, className = 'bg-emerald-400' }) => (
    <span className="flex h-4 items-center gap-[3px]">
        {BAR_DELAYS.map((delay) => (
            <span
                key={delay}
                style={{ animationDelay: playing ? delay : undefined }}
                className={`w-[3px] rounded-full ${className} ${
                    playing ? 'island-bar h-4' : 'h-1.5'
                }`}
            />
        ))}
    </span>
)

const Artwork = ({ className }) =>
    nowPlaying.art ? (
        <img
            src={nowPlaying.art}
            alt=""
            draggable={false}
            className={`shrink-0 rounded-md object-cover ${className}`}
        />
    ) : (
        <span
            className={`block shrink-0 rounded-md ${className}`}
            style={{
                backgroundImage: `linear-gradient(135deg, ${nowPlaying.artFrom}, ${nowPlaying.artTo})`,
            }}
        />
    )

const DynamicIsland = () => {
    const [expanded, setExpanded] = useState(false)
    const [playing, setPlaying] = useState(true)
    const [elapsed, setElapsed] = useState(nowPlaying.startAt ?? 0)

    useEffect(() => {
        if (!playing) return

        const id = setInterval(() => {
            setElapsed((prev) => (prev + 1) % nowPlaying.duration)
        }, 1000)

        return () => clearInterval(id)
    }, [playing])

    const progress = (elapsed / nowPlaying.duration) * 100

    return (
        <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-label={`${nowPlaying.title} by ${nowPlaying.artist}`}
            className={`pointer-events-auto overflow-hidden bg-black text-left transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                expanded
                    ? 'w-64 rounded-[28px] px-4 py-3'
                    : 'flex w-32 items-center justify-center gap-2.5 rounded-full px-3 py-1.5'
            }`}
        >
            {expanded ? (
                <>
                    <div className="flex items-center gap-3">
                        <Artwork className="size-11" />

                        <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-medium text-white">
                                {nowPlaying.title}
                            </span>
                            <span className="block truncate text-[11px] text-white/50">
                                {nowPlaying.artist}
                            </span>
                        </span>

                        <span
                            role="button"
                            tabIndex={-1}
                            onClick={(e) => {
                                e.stopPropagation()
                                setPlaying((prev) => !prev)
                            }}
                            className="shrink-0 rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/10"
                        >
                            {playing ? (
                                <Pause className="size-4" />
                            ) : (
                                <Play className="size-4" />
                            )}
                        </span>
                    </div>

                    <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/15">
                        <div
                            style={{ width: `${progress}%` }}
                            className="h-full rounded-full bg-white/70 transition-[width] duration-1000 ease-linear"
                        />
                    </div>

                    <div className="mt-1.5 flex justify-between text-[10px] tabular-nums text-white/40">
                        <span>{formatTime(elapsed)}</span>
                        <span>-{formatTime(nowPlaying.duration - elapsed)}</span>
                    </div>
                </>
            ) : (
                <>
                    <Artwork className="size-5" />
                    <Bars playing={playing} />
                </>
            )}
        </button>
    )
}

export default DynamicIsland
