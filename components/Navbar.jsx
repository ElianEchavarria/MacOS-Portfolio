'use client'

import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import GlassHover from '@/components/GlassHover'

const navLinks = [
    { id: 1, name: "Projects" },
    { id: 2, name: "Resume" },
    { id: 3, name: "Contact" },
]

const statusIcons = [
    { id: 'wifi', src: '/wifi.svg', alt: 'Wifi icon' },
    { id: 'search', src: '/search.svg', alt: 'Search icon' },
    { id: 'menu', src: '/menu.svg', alt: 'Menu icon' },
]

const Navbar = () => {
    const [now, setNow] = useState(null)

    useEffect(() => {
        setNow(dayjs())
        const interval = setInterval(() => setNow(dayjs()), 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <nav className='flex justify-between items-center pt-3 p-2 px-5 select-none'>
            <div className='flex items-center gap-5'>
                <img src="/AppleLogo.svg" alt="Apple Logo" width={40} height={40} />
                <p className='font-inter font-bold text-sm cursor-pointer hover:underline transition-all text-amber-50'>Elian's Portfolio</p>

                <ul className='flex items-center gap-5 max-sm:hidden'>
                    {navLinks.map(({ id, name }) => (
                        <GlassHover
                            key={id}
                            as='li'
                            className='font-inter text-sm cursor-pointer px-3 py-1 text-amber-50'
                        >
                            {name}
                        </GlassHover>
                    ))}
                </ul>
            </div>

            <div className='flex items-center gap-1 text-amber-50'>
                {statusIcons.map(({ id, src, alt }) => (
                    <GlassHover key={id} cornerRadius={9} className='cursor-pointer p-1.5'>
                        <img src={src} alt={alt} className='h-3.5 w-auto' />
                    </GlassHover>
                ))}

                <GlassHover as='time' className='font-inter text-sm cursor-default px-2 py-1'>
                    {now?.format("ddd MMM D h:mm A")}
                </GlassHover>
            </div>
        </nav>
    )
}

export default Navbar
