'use client'

import React, { useEffect, useRef, useState } from 'react'

import projects from '@/projects'
import useWindowStore from '@/store/window'

const PROMPT = '$'

// TODO: make this yours.
const BIO = [
    'Elian Echavarria',
    'Software developer.',
    '',
    'This portfolio is a macOS desktop rebuilt in the browser with',
    'Next.js, Tailwind, GSAP and Zustand.',
]

// What `open <name>` accepts, beyond project ids. Aliases keep the shell
// forgiving: people type what they see in the dock, not the internal id.
const OPEN_ALIASES = {
    resume: 'resume',
    contact: 'contact',
    about: 'about',
    'about-me': 'about',
    'about-me.txt': 'about',
    portfolio: 'finder',
    finder: 'finder',
    articles: 'safari',
    safari: 'safari',
    gallery: 'photos',
    photos: 'photos',
    terminal: 'terminal',
    trash: 'trash',
}

// The fake filesystem `ls` walks. Each entry carries the command that acts on
// it, so a bare `ls` tells people what to type next instead of just naming
// things they then have to guess at.
const ROOT_LISTING = [
    { name: 'projects/', hint: 'ls projects/' },
    { name: 'about-me.txt', hint: 'open about' },
    { name: 'resume', hint: 'open resume' },
    { name: 'contact', hint: 'open contact' },
]

const out = (text = '') => ({ type: 'output', text })
const err = (text) => ({ type: 'error', text })

const COMMANDS = {
    help: {
        usage: 'help',
        description: 'list every command',
        run: () => [
            out('Available commands:'),
            out(''),
            ...Object.entries(COMMANDS).map(([name, cmd]) =>
                out(`  ${cmd.usage.padEnd(18)} ${cmd.description}`)
            ),
            out(''),
            out('Use the up and down arrows to walk through past commands.'),
        ],
    },

    whoami: {
        usage: 'whoami',
        description: 'who is behind all this',
        run: () => BIO.map(out),
    },

    ls: {
        usage: 'ls [path]',
        description: 'list what is here',
        run: ([path]) => {
            if (!path) {
                return ROOT_LISTING.map((entry) =>
                    out(`  ${entry.name.padEnd(20)} ${entry.hint}`)
                )
            }

            // accept `projects`, `projects/`, `./projects` and any casing,
            // matching how `open` resolves its argument
            const target = path
                .replace(/^\.\//, '')
                .replace(/\/$/, '')
                .toLowerCase()
            if (target !== 'projects') {
                return [err(`ls: no such directory: ${path}`)]
            }

            return projects.map((project) =>
                out(`  ${project.id.padEnd(20)} ${project.tagline}`)
            )
        },
    },

    open: {
        usage: 'open <name>',
        description: 'open a window',
        run: ([name], { openApp }) => {
            if (!name) {
                return [err('open: what should I open? Try `open resume`.')]
            }

            const key = name.replace(/\/$/, '').toLowerCase()
            const project = projects.find((p) => p.id === key)
            const windowId = project ? project.id : OPEN_ALIASES[key]

            if (!windowId) {
                return [
                    err(`open: nothing called "${name}".`),
                    out('Try `ls` or `ls projects/` to see what there is.'),
                ]
            }

            openApp(windowId)
            return [out(`Opening ${project ? project.name : key}...`)]
        },
    },

    contact: {
        usage: 'contact',
        description: 'open the contact window',
        run: (_args, { openApp }) => {
            openApp('contact')
            return [out('Opening Contact...')]
        },
    },

    clear: {
        usage: 'clear',
        description: 'clear the screen',
        // Handled by the caller, which empties the buffer instead of appending.
        run: () => null,
    },
}

const WELCOME = [
    out('Welcome. This is a real shell, for a made-up computer.'),
    out('Type `help` to see what it understands.'),
    out(''),
]

const Terminal = () => {
    const openApp = useWindowStore((s) => s.openApp)

    const [lines, setLines] = useState(WELCOME)
    const [input, setInput] = useState('')
    const [history, setHistory] = useState([])
    // -1 means "typing a fresh command" rather than browsing history.
    const [historyIndex, setHistoryIndex] = useState(-1)

    const inputRef = useRef(null)
    const scrollRef = useRef(null)

    // Keep the newest output in view.
    useEffect(() => {
        const el = scrollRef.current
        if (el) el.scrollTop = el.scrollHeight
    }, [lines])

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const submit = (raw) => {
        const trimmed = raw.trim()

        setInput('')
        setHistoryIndex(-1)
        if (trimmed) setHistory((prev) => [...prev, trimmed])

        if (!trimmed) {
            setLines((prev) => [...prev, { type: 'input', text: '' }])
            return
        }

        const [name, ...args] = trimmed.split(/\s+/)
        const command = COMMANDS[name.toLowerCase()]
        const echo = { type: 'input', text: trimmed }

        if (!command) {
            setLines((prev) => [
                ...prev,
                echo,
                err(`zsh: command not found: ${name}`),
                out('Type `help` for the list.'),
            ])
            return
        }

        const result = command.run(args, { openApp })

        // `clear` is the one command that replaces the buffer instead of
        // appending to it.
        if (result === null) {
            setLines([])
            return
        }

        setLines((prev) => [...prev, echo, ...result, out('')])
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            submit(input)
            return
        }

        // Up/down walk the history, the way a real shell does.
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault()
            if (!history.length) return

            const next =
                event.key === 'ArrowUp'
                    ? Math.min(
                          history.length - 1,
                          historyIndex === -1 ? 0 : historyIndex + 1
                      )
                    : historyIndex - 1

            if (next < 0) {
                setHistoryIndex(-1)
                setInput('')
                return
            }

            setHistoryIndex(next)
            setInput(history[history.length - 1 - next])
        }
    }

    return (
        <div
            onClick={() => inputRef.current?.focus()}
            className="flex h-full flex-col bg-black/25 font-mono text-[13px] leading-relaxed"
        >
            <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto px-4 py-3">
                {lines.map((line, i) => (
                    <p
                        key={i}
                        className={`whitespace-pre-wrap break-words ${
                            line.type === 'error'
                                ? 'text-red-400'
                                : line.type === 'input'
                                  ? 'text-white'
                                  : 'text-white/70'
                        }`}
                    >
                        {line.type === 'input' ? (
                            <>
                                <span className="text-emerald-400">{PROMPT}</span>{' '}
                                {line.text}
                            </>
                        ) : (
                            line.text || ' '
                        )}
                    </p>
                ))}

                {/* Live prompt */}
                <div className="flex items-center gap-2">
                    <span className="text-emerald-400">{PROMPT}</span>
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        spellCheck={false}
                        autoComplete="off"
                        autoCapitalize="off"
                        aria-label="Terminal input"
                        className="flex-1 bg-transparent text-white caret-emerald-400 outline-none"
                    />
                </div>
            </div>
        </div>
    )
}

export default Terminal
