'use client'

import React from 'react'

const BootScreen = () => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
            <img
                src="/AppleLogo.svg"
                alt="Apple"
                draggable={false}
                className="w-24 select-none"
            />

            <div className="absolute bottom-[16%] h-[5px] w-44 overflow-hidden rounded-full bg-white/20">
                <div className="boot-progress h-full rounded-full bg-white/90" />
            </div>
        </div>
    )
}

export default BootScreen
