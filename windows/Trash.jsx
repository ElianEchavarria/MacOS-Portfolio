'use client'

import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'

import { FOLDERS } from '@/fileSystem'

const Trash = () => {
    const [selected, setSelected] = useState(null)
    const items = FOLDERS.trash.items

    if (items.length === 0) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-3 font-inter">
                <Trash2 className="size-8 text-white/20" />
                <p className="text-sm text-white/35">Trash is Empty</p>
            </div>
        )
    }

    return (
        <div className="flex h-full flex-col font-inter">
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-2">
                <h2 className="text-sm font-medium text-white">Trash</h2>
                <span className="text-xs text-white/35">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-4">
                <ul className="flex flex-wrap content-start gap-2">
                    {items.map((item) => (
                        <li key={item.id}>
                            <button
                                type="button"
                                onClick={() => setSelected(item.id)}
                                className={`flex w-28 flex-col items-center gap-2 rounded-lg px-2 py-3 transition-colors ${
                                    selected === item.id ? 'bg-white/15' : 'hover:bg-white/8'
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
        </div>
    )
}

export default Trash
