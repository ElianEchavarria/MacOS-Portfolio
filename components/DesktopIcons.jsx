'use client'

import React, { useState } from 'react'

import projects from '@/projects'
import useWindowStore from '@/store/window'

const DesktopIcons = () => {
    const openApp = useWindowStore((s) => s.openApp)
    const [selected, setSelected] = useState(null)

    return (
        <div className="absolute left-5 top-14 z-0 flex flex-col gap-1 select-none max-sm:hidden">
            {projects.map((project) => (
                <button
                    key={project.id}
                    type="button"
                    onClick={() => setSelected(project.id)}
                    onDoubleClick={() => openApp(project.id)}
                    className="flex w-28 cursor-pointer flex-col items-center gap-1 rounded-md px-1 py-1.5"
                >
                    <img
                        src="/folder.png"
                        alt=""
                        draggable={false}
                        className={`size-14 object-contain drop-shadow-lg ${
                            selected === project.id ? 'brightness-90' : ''
                        }`}
                    />
                    <span
                        className={`rounded px-1.5 py-0.5 text-center font-inter text-xs leading-tight drop-shadow ${
                            selected === project.id
                                ? 'bg-blue-500 text-white'
                                : 'text-white'
                        }`}
                    >
                        {project.name}
                    </span>
                </button>
            ))}
        </div>
    )
}

export default DesktopIcons
