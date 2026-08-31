'use client'

import React, { useEffect } from 'react'
import { useShallow } from 'zustand/shallow'

import Window from '@/components/Window'
import useWindowStore from '@/store/window'
import projects from '@/projects'
import { Contact, Resume, Terminal } from '@/windows'

// Real window bodies. Add to this as you build each one.
const WINDOW_COMPONENTS = {
    terminal: Terminal,
    resume: Resume,
    contact: Contact,
}

// Placeholder copy for the windows that don't have a body yet.
const WINDOW_CONTENT = {
    finder: 'Projects, case studies and the work itself.',
    safari: 'Writing and articles.',
    photos: 'A gallery of shots.',
    trash: 'Nothing in here yet.',
}

const Placeholder = ({ id }) => (
    <div className="flex h-full items-center justify-center p-8 text-center font-inter text-sm text-white/50">
        {WINDOW_CONTENT[id] ?? 'Coming soon.'}
    </div>
)

const ProjectBody = ({ project }) => (
    <div className="mx-auto max-w-2xl p-8 font-inter">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h2 className="text-lg font-semibold text-white">{project.name}</h2>
            {project.year && (
                <span className="text-xs tabular-nums text-white/40">{project.year}</span>
            )}
        </div>

        <p className="mt-1 text-sm text-white/60">{project.tagline}</p>

        {project.url && (
            <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-xs text-white/70 underline underline-offset-4 hover:text-white"
            >
                {project.url.replace(/^https?:\/\//, '')}
            </a>
        )}

        <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.map((tech, i) => (
                <li
                    key={`${tech}-${i}`}
                    className="rounded-md border border-white/15 px-2 py-0.5 text-xs text-white/70"
                >
                    {tech}
                </li>
            ))}
        </ul>

        {project.points?.length > 0 && (
            <ul className="mt-6 space-y-2">
                {project.points.map((point, i) => (
                    <li
                        key={i}
                        className="flex gap-2 text-sm leading-relaxed text-white/65"
                    >
                        <span className="text-white/30">–</span>
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
        )}
    </div>
)

const bodyFor = (id) => {
    const Component = WINDOW_COMPONENTS[id]
    if (Component) return <Component />

    const project = projects.find((p) => p.id === id)
    if (project) return <ProjectBody project={project} />

    return <Placeholder id={id} />
}

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
            {bodyFor(id)}
        </Window>
    ))
}

export default WindowLayer
