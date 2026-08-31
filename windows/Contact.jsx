'use client'

import React, { useState } from 'react'
import resume from '@/resume'

const initials = (name) =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')

const Row = ({ label, value, href }) => (
    <li className="flex items-baseline justify-between gap-4 border-b border-white/10 py-2 last:border-0">
        <span className="text-xs text-white/40">{label}</span>
        {href ? (
            <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="truncate text-sm text-white/85 transition-colors hover:text-white"
            >
                {value}
            </a>
        ) : (
            <span className="text-sm text-white/85">{value}</span>
        )}
    </li>
)

const Contact = () => {
    const { name, title, email, phone, location, links } = resume

    const [copied, setCopied] = useState(false)
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(email)
            setCopied(true)
            setTimeout(() => setCopied(false), 1600)
        } catch {
            setCopied(false)
        }
    }

    const mailto = `mailto:${email}?subject=${encodeURIComponent(
        subject
    )}&body=${encodeURIComponent(message)}`

    return (
        <div className="px-7 py-6 font-inter">
            <header className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-base font-medium text-white">
                    {initials(name)}
                </div>
                <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-white">{name}</h2>
                    <p className="truncate text-sm text-white/55">{title}</p>
                </div>
            </header>

            <ul className="mt-5">
                {email && <Row label="Email" value={email} href={`mailto:${email}`} />}
                {phone && <Row label="Phone" value={phone} href={`tel:${phone}`} />}
                {links
                    ?.filter((link) => link.href)
                    .map((link) => (
                        <Row
                            key={link.label}
                            label={link.label}
                            value={link.href.replace(/^https?:\/\//, '')}
                            href={link.href}
                        />
                    ))}
                {location && <Row label="Location" value={location} />}
            </ul>

            {email && (
                <>
                    <button
                        type="button"
                        onClick={copyEmail}
                        className="mt-4 w-full rounded-lg border border-white/15 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/10"
                    >
                        {copied ? 'Copied' : 'Copy email address'}
                    </button>

                    <div className="mt-6 border-t border-white/10 pt-5">
                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
                            Send a message
                        </h3>

                        <input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Subject"
                            aria-label="Subject"
                            className="mt-3 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                        />

                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Say hello..."
                            aria-label="Message"
                            rows={3}
                            className="mt-2 w-full resize-none rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm leading-relaxed text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                        />

                        <a
                            href={mailto}
                            className="mt-3 block w-full rounded-lg bg-white/90 py-2 text-center text-sm font-medium text-black transition-colors hover:bg-white"
                        >
                            Open in Mail
                        </a>

                        <p className="mt-2 text-center text-[11px] text-white/35">
                            Opens your email app with this message ready to send.
                        </p>
                    </div>
                </>
            )}
        </div>
    )
}

export default Contact
