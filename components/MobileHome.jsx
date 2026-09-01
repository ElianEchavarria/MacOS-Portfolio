'use client'

import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { BatteryFull, Wifi } from 'lucide-react'
import { useShallow } from 'zustand/shallow'

import DynamicIsland from '@/components/DynamicIsland'
import dockApps from '@/dockApp'
import useWindowStore from '@/store/window'

const DOCK_IDS = ['finder', 'safari', 'photos', 'contact']
const HIDDEN_ON_MOBILE = ['trash']

const AppIcon = ({ app, onOpen, size }) => (
    <button
        type="button"
        onClick={() => onOpen(app.id)}
        disabled={!app.canOpen}
        className="flex flex-col items-center gap-1.5 disabled:opacity-50"
    >
        <span
            className={`flex items-center justify-center overflow-hidden rounded-[22%] ${size}`}
        >
            <img
                src={`/${app.icon}`}
                alt=""
                draggable={false}
                className={`object-contain drop-shadow-md ${
                    app.fullBleed ? 'size-[86%]' : 'size-full'
                }`}
            />
        </span>
    </button>
)

const MobileHome = () => {
    const [now, setNow] = useState(null)
    const openApp = useWindowStore((s) => s.openApp)
    const openIds = useWindowStore(useShallow((s) => s.windows.map((w) => w.id)))

    useEffect(() => {
        setNow(dayjs())
        const id = setInterval(() => setNow(dayjs()), 10000)
        return () => clearInterval(id)
    }, [])

    const homeApps = dockApps.filter(
        (app) => !DOCK_IDS.includes(app.id) && !HIDDEN_ON_MOBILE.includes(app.id)
    )
    const dockedApps = DOCK_IDS.map((id) => dockApps.find((app) => app.id === id)).filter(
        Boolean
    )

    return (
        <div className="sm:hidden">
            <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] px-6 pt-3">
                <div className="flex h-8 items-center justify-between">
                    <span className="text-sm font-medium text-white drop-shadow">
                        {now?.format('h:mm A')}
                    </span>

                    <span className="flex items-center gap-1.5 text-white drop-shadow">
                        <Wifi className="size-4" />
                        <BatteryFull className="size-5" />
                    </span>
                </div>

                <div className="absolute inset-x-0 top-3 flex justify-center">
                    <DynamicIsland />
                </div>
            </div>

            <div className="fixed inset-x-0 top-28 z-10 px-6">
                <div className="grid grid-cols-4 gap-x-4 gap-y-5">
                    {homeApps.map((app) => (
                        <AppIcon key={app.id} app={app} onOpen={openApp} size="size-14" />
                    ))}
                </div>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-10 px-4 pb-6">
                <div className="flex items-center justify-around rounded-[28px] border border-white/15 bg-white/10 px-3 py-3 backdrop-blur-xl">
                    {dockedApps.map((app) => (
                        <span key={app.id} className="relative">
                            <AppIcon app={app} onOpen={openApp} size="size-14" />
                            <span
                                className={`absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-white/80 transition-opacity ${
                                    openIds.includes(app.id) ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MobileHome
