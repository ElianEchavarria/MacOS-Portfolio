'use client'

import React from 'react'
import resume from '@/resume'

const Section = ({ title, children }) => (
    <section className="mt-8">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
            {title}
        </h3>
        <div className="mt-3">{children}</div>
    </section>
)

const Resume = () => {
    const { name, title, location, email, pdfUrl, links, summary } = resume

    // Sections are skipped when empty, so deleting an entry from resume.js is
    // enough to remove it — no matching edit needed here.
    const experience = resume.experience ?? []
    const education = resume.education ?? []
    const leadership = resume.leadership ?? []
    const skillGroups = Object.entries(resume.skills ?? {})
    const shownLinks = (links ?? []).filter((link) => link.href)

    return (
        <div className="mx-auto max-w-2xl px-8 py-8 font-inter text-white/80">
            <header className="border-b border-white/10 pb-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-white">{name}</h2>
                        <p className="mt-1 text-sm text-white/60">{title}</p>
                    </div>

                    {pdfUrl && (
                        <a
                            href={pdfUrl}
                            download
                            className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-white/90 transition-colors hover:bg-white/10"
                        >
                            Download PDF
                        </a>
                    )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50">
                    {location && <span>{location}</span>}
                    {resume.phone && (
                        <a href={`tel:${resume.phone}`} className="hover:text-white/80">
                            {resume.phone}
                        </a>
                    )}
                    {email && (
                        <a href={`mailto:${email}`} className="hover:text-white/80">
                            {email}
                        </a>
                    )}
                    {shownLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-white/80"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </header>

            {summary && (
                <Section title="About">
                    <p className="text-sm leading-relaxed text-white/70">{summary}</p>
                </Section>
            )}

            {experience.length > 0 && (
                <Section title="Experience">
                    <ol className="space-y-5">
                        {experience.map((job, i) => (
                            <li key={`${job.company}-${i}`}>
                                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                                    <p className="text-sm font-medium text-white">
                                        {job.role}
                                        <span className="text-white/50"> · {job.company}</span>
                                    </p>
                                    <p className="shrink-0 text-xs tabular-nums text-white/40">
                                        {job.period}
                                        {job.location && ` · ${job.location}`}
                                    </p>
                                </div>

                                {job.points?.length > 0 && (
                                    <ul className="mt-2 space-y-1">
                                        {job.points.map((point, j) => (
                                            <li
                                                key={j}
                                                className="flex gap-2 text-sm leading-relaxed text-white/65"
                                            >
                                                <span className="text-white/30">–</span>
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ol>
                </Section>
            )}

            {education.length > 0 && (
                <Section title="Education">
                    <ol className="space-y-3">
                        {education.map((entry, i) => (
                            <li key={`${entry.school}-${i}`}>
                                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                                    <p className="text-sm text-white">
                                        {entry.school}
                                        <span className="text-white/50"> · {entry.credential}</span>
                                    </p>
                                    <p className="shrink-0 text-xs tabular-nums text-white/40">
                                        {entry.period}
                                    </p>
                                </div>
                                {entry.note && (
                                    <p className="mt-1 text-xs text-white/50">{entry.note}</p>
                                )}
                            </li>
                        ))}
                    </ol>
                </Section>
            )}

            {leadership.length > 0 && (
                <Section title="Leadership & Community">
                    <ul className="space-y-2">
                        {leadership.map((entry, i) => (
                            <li
                                key={i}
                                className="flex gap-2 text-sm leading-relaxed text-white/65"
                            >
                                <span className="text-white/30">–</span>
                                <span>{entry}</span>
                            </li>
                        ))}
                    </ul>
                </Section>
            )}

            {skillGroups.length > 0 && (
                <Section title="Technical Skills">
                    <dl className="space-y-3">
                        {skillGroups.map(([group, items]) => (
                            <div key={group}>
                                <dt className="text-xs text-white/45">{group}</dt>
                                <dd className="mt-1.5 flex flex-wrap gap-1.5">
                                    {items.map((item, i) => (
                                        <span
                                            key={`${item}-${i}`}
                                            className="rounded-md border border-white/15 px-2 py-0.5 text-xs text-white/70"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </Section>
            )}
        </div>
    )
}

export default Resume
