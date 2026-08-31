'use client'

import React from 'react'
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Newspaper,
    PanelLeft,
    Plus,
    Search,
    Share,
    Shield,
    SquareStack,
} from 'lucide-react'

import articles, { blogTitle } from '@/articles'

const ToolbarButton = ({ icon: Icon, label }) => (
    <span
        aria-label={label}
        className="rounded-md p-1 text-white/45 transition-colors hover:bg-white/10 hover:text-white/80"
    >
        <Icon className="size-4" />
    </span>
)

const Toolbar = () => (
    <div className="flex shrink-0 items-center gap-2 border-b border-white/10 px-3 py-2">
        <ToolbarButton icon={PanelLeft} label="Sidebar" />
        <ToolbarButton icon={ChevronLeft} label="Back" />
        <ToolbarButton icon={ChevronRight} label="Forward" />
        <ToolbarButton icon={Shield} label="Privacy report" />

        <div className="mx-2 flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg bg-white/8 px-3 py-1.5">
            <Search className="size-3.5 shrink-0 text-white/35" />
            <span className="truncate text-xs text-white/35">
                Search or enter website name
            </span>
        </div>

        <ToolbarButton icon={Share} label="Share" />
        <ToolbarButton icon={Plus} label="New tab" />
        <ToolbarButton icon={SquareStack} label="Tabs" />
    </div>
)

const Articles = () => (
    <div className="flex h-full flex-col font-inter">
        <Toolbar />

        {articles.length === 0 ? (
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
                <Newspaper className="size-8 text-white/20" />
                <p className="text-sm text-white/40">No articles yet</p>
                <p className="max-w-xs text-xs leading-relaxed text-white/25">
                    Add entries to articles.js and they will show up here.
                </p>
            </div>
        ) : (
            <div className="min-h-0 flex-1 overflow-auto px-8 py-7">
                <h2 className="text-xl font-bold text-pink-500">{blogTitle}</h2>

                <ul className="mt-6 space-y-7">
                    {articles.map((article) => (
                        <li key={article.id} className="flex gap-5">
                            {article.image && (
                                <img
                                    src={article.image}
                                    alt=""
                                    loading="lazy"
                                    draggable={false}
                                    className="size-16 shrink-0 rounded-lg object-contain"
                                />
                            )}

                            <div className="min-w-0">
                                {article.date && (
                                    <p className="text-xs text-white/45">{article.date}</p>
                                )}

                                <h3 className="mt-1 text-[15px] font-semibold text-white">
                                    {article.title}
                                </h3>

                                {article.excerpt && (
                                    <p className="mt-1 text-sm leading-relaxed text-white/55">
                                        {article.excerpt}
                                    </p>
                                )}

                                {article.url && (
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-2 inline-flex items-center gap-2 text-sm text-blue-400 transition-colors hover:text-blue-300"
                                    >
                                        Check out the full post
                                        <ArrowRight className="size-4" />
                                    </a>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
)

export default Articles
