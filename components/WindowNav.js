'use client'

import { createContext, useContext, useEffect } from 'react'

export const WindowNavContext = createContext(null)

export const useWindowNav = (nav, deps = []) => {
    const setNav = useContext(WindowNavContext)

    useEffect(() => {
        if (!setNav) return

        setNav(nav)
        return () => setNav(null)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
}
