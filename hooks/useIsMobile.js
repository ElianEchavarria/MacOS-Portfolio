'use client'

import { useEffect, useState } from 'react'

const QUERY = '(max-width: 639px)'

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const query = window.matchMedia(QUERY)
        const update = () => setIsMobile(query.matches)

        update()
        query.addEventListener('change', update)
        return () => query.removeEventListener('change', update)
    }, [])

    return isMobile
}

export default useIsMobile
