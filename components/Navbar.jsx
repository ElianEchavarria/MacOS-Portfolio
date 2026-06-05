'use client'

import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'

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
                    {[
                        { id: 1, name: "Projects" },
                        { id: 2, name: "Resume" },
                        { id: 3, name: "Contact" },
                    ].map(({ id, name }) => (
                        <li key={id}>
                            <p className='font-inter text-sm cursor-pointer hover:underline transition-all text-amber-50'>{name}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='flex items-center gap-3 text-amber-50'>
                <img src="/wifi.svg" alt="Wifi icon" className='h-3.5 w-auto' />
                <img src="/search.svg" alt="Search icon" className='h-3.5 w-auto' />
                <img src="/menu.svg" alt="Menu icon" className='h-3.5 w-auto' />
                <time className='font-inter text-sm'>{now?.format("ddd MMM D h:mm A")}</time>
            </div>
        </nav>
    )
}

export default Navbar
