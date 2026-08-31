'use client'

import React, { useState } from 'react'
import { FileText, Folder, Info, Trash2 } from 'lucide-react'

import projects from '@/projects'
import useWindowStore from '@/store/window'
import { FAVORITES, FOLDERS } from '@/fileSystem'

const FAVORITE_ICONS = {
    work: Folder,
    about: Info,
    resume: FileText,
    trash: Trash2,
}

const SidebarButton = ({ active, onClick, children }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors ${
            active ? 'bg-white/15 text-white' : 'text-white/65 hover:bg-white/8'
        }`}
    >
        {children}
    </button>
)

const Finder = () => {
    const openApp = useWindowStore((s) => s.openApp)
    const [folder, setFolder] = useState('work')
    const [selected, setSelected] = useState(null)

    const current = FOLDERS[folder]

    const selectFolder = (id) => {
        setFolder(id)
        setSelected(null)
    }

    const openItem = (item) => {
        if (item.opens) openApp(item.opens)
    }

    return (
        <div className="flex h-full font-inter">
            <aside className="w-48 shrink-0 overflow-auto border-r border-white/10 bg-black/25 px-2 py-3">
                <p className="px-2 pb-1 text-[11px] font-medium text-white/35">
                    Favorites
                </p>
                <ul className="space-y-0.5">
                    {FAVORITES.map((id) => {
                        const Icon = FAVORITE_ICONS[id]
                        return (
                            <li key={id}>
                                <SidebarButton
                                    active={folder === id}
                                    onClick={() => selectFolder(id)}
                                >
                                    <Icon className="size-4 shrink-0 text-sky-400" />
                                    <span className="truncate">{FOLDERS[id].label}</span>
                                </SidebarButton>
                            </li>
                        )
                    })}
                </ul>

                <p className="px-2 pb-1 pt-4 text-[11px] font-medium text-white/35">
                    Work
                </p>
                <ul className="space-y-0.5">
                    {projects.map((project) => (
                        <li key={project.id}>
                            <SidebarButton onClick={() => openApp(project.id)}>
                                <img
                                    src="/folder.png"
                                    alt=""
                                    draggable={false}
                                    className="size-4 shrink-0 object-contain"
                                />
                                <span className="truncate">{project.name}</span>
                            </SidebarButton>
                        </li>
                    ))}
                </ul>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-2">
                    <h2 className="text-sm font-medium text-white">{current.label}</h2>
                    <span className="text-xs text-white/35">
                        {current.items.length} {current.items.length === 1 ? 'item' : 'items'}
                    </span>
                </div>

                {current.items.length === 0 ? (
                    <div className="flex min-h-0 flex-1 items-center justify-center text-sm text-white/30">
                        {current.emptyMessage ?? 'Empty'}
                    </div>
                ) : (
                    <div className="min-h-0 flex-1 overflow-auto p-4">
                        <ul className="flex flex-wrap content-start gap-2">
                            {current.items.map((item) => (
                                <li key={item.id}>
                                    <button
                                        type="button"
                                        onClick={() => setSelected(item.id)}
                                        onDoubleClick={() => openItem(item)}
                                        className={`flex w-28 flex-col items-center gap-2 rounded-lg px-2 py-3 transition-colors ${
                                            selected === item.id
                                                ? 'bg-white/15'
                                                : 'hover:bg-white/8'
                                        }`}
                                    >
                                        <img
                                            src={item.icon}
                                            alt=""
                                            draggable={false}
                                            className="size-14 object-contain drop-shadow-md"
                                        />
                                        <span className="text-center text-xs leading-tight text-white/90">
                                            {item.name}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="shrink-0 border-t border-white/10 px-4 py-2 text-[11px] text-white/35">
                    Double-click to open.
                </div>
            </div>
        </div>
    )
}

export default Finder
