'use client'

import React from 'react'
import about from '@/about'

const About = () => (
    <div className="h-full px-8 py-7">
        <pre className="whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-white/80">
            {about.body}
        </pre>
    </div>
)

export default About
