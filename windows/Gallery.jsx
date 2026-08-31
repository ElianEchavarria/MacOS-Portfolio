'use client'

import React, { useState } from 'react'
import { Heart, Images, MapPin, Sparkles, User, X } from 'lucide-react'

import gallery from '@/gallery'

const SECTIONS = [
    { id: 'library', label: 'Library', icon: Images },
    { id: 'memories', label: 'Memories', icon: Sparkles },
    { id: 'places', label: 'Places', icon: MapPin },
    { id: 'people', label: 'People', icon: User },
    { id: 'favorites', label: 'Favorites', icon: Heart },
]

const EMPTY_MESSAGE = {
    library: 'No photos yet',
    memories: 'No memories yet',
    places: 'No places yet',
    people: 'No people yet',
    favorites: 'No favorites yet',
}

const Gallery = () => {
    const [section, setSection] = useState('library')
    const [preview, setPreview] = useState(null)

    const photos =
        section === 'library'
            ? gallery
            : section === 'favorites'
              ? gallery.filter((photo) => photo.favorite)
              : []

    const item = gallery.find((photo) => photo.id === preview)

    return (
        <div className="relative flex h-full font-inter">
            <aside className="w-44 shrink-0 overflow-auto border-r border-white/10 bg-black/25 px-2 py-3">
                <p className="px-2 pb-1 text-[11px] font-medium text-white/35">Photos</p>
                <ul className="space-y-0.5">
                    {SECTIONS.map(({ id, label, icon: Icon }) => (
                        <li key={id}>
                            <button
                                type="button"
                                onClick={() => setSection(id)}
                                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors ${
                                    section === id
                                        ? 'bg-white/15 text-white'
                                        : 'text-white/65 hover:bg-white/8'
                                }`}
                            >
                                <Icon className="size-4 shrink-0 text-sky-400" />
                                <span className="truncate">{label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            <div className="min-w-0 flex-1 overflow-auto p-3">
                {photos.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                        <Images className="size-8 text-white/20" />
                        <p className="text-sm text-white/40">{EMPTY_MESSAGE[section]}</p>
                        {section === 'library' && (
                            <p className="max-w-xs text-xs leading-relaxed text-white/25">
                                Drop images in /public and add them to gallery.js.
                            </p>
                        )}
                    </div>
                ) : (
                    <ul className="grid auto-rows-[minmax(0,180px)] grid-cols-2 gap-3 sm:grid-cols-3">
                        {photos.map((photo) => (
                            <li
                                key={photo.id}
                                className={photo.wide ? 'col-span-2' : 'col-span-1'}
                            >
                                <button
                                    type="button"
                                    onClick={() => setPreview(photo.id)}
                                    className="group block size-full overflow-hidden rounded-xl border border-white/10 transition-colors hover:border-white/30"
                                >
                                    <img
                                        src={photo.src}
                                        alt={photo.alt ?? ''}
                                        loading="lazy"
                                        draggable={false}
                                        className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                                    />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {item && (
                <div className="absolute inset-0 z-10 flex flex-col bg-black/85 backdrop-blur-sm">
                    <div className="flex shrink-0 items-center justify-between px-4 py-3">
                        <p className="truncate text-sm text-white/80">
                            {item.caption ?? item.alt ?? ''}
                        </p>
                        <button
                            type="button"
                            onClick={() => setPreview(null)}
                            aria-label="Close preview"
                            className="rounded-md p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            <X className="size-4" />
                        </button>
                    </div>

                    <div className="flex min-h-0 flex-1 items-center justify-center px-6 pb-6">
                        <img
                            src={item.src}
                            alt={item.alt ?? ''}
                            draggable={false}
                            className="max-h-full max-w-full rounded-lg object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Gallery
