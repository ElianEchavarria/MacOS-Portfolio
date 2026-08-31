'use client'

import React, { useEffect } from 'react'
import { useShallow } from 'zustand/shallow'

import Window from '@/components/Window'
import useWindowStore from '@/store/window'

// Placeholder bodies. Swap these for the real app content as you build it.
const WINDOW_CONTENT = {
    finder: 'Projects, case studies and the work itself.',
    safari: 'Writing and articles.',
    photos: 'A gallery of shots.',
    terminal: 'A shell you can actually type into.',
    contact: 'Ways to reach me.',
    trash: 'Nothing in here yet.',
}

const Placeholder = ({ id }) => (
    <div className="flex h-full items-center justify-center p-8 text-center font-inter text-sm text-white/50">
        {WINDOW_CONTENT[id] ?? 'Coming soon.'}
    </div>
)

const WindowLayer = () => {
    // Only the ids, compared shallowly: this component re-renders when a window
    // opens or closes, but not on every frame of a drag or resize. Each Window
    // subscribes to its own entry for that.
    const ids = useWindowStore(useShallow((s) => s.windows.map((w) => w.id)))
    const reflowWindows = useWindowStore((s) => s.reflowWindows)

    useEffect(() => {
        window.addEventListener('resize', reflowWindows)
        return () => window.removeEventListener('resize', reflowWindows)
    }, [reflowWindows])

    return ids.map((id) => (
        <Window key={id} id={id}>
            <Placeholder id={id} />
        </Window>
    ))
}

export default WindowLayer
