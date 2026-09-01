import projects from '@/projects'

export const DESKTOP_INSETS = {
    top: 48,
    bottom: 88,
    side: 12,
}

export const WINDOW_DEFAULTS = {
    size: { width: 880, height: 580 },
    minSize: { width: 480, height: 360 },
    resizable: true,
}

// Each new window steps down-right from the last so a stack stays grabbable.
export const WINDOW_CASCADE_STEP = 28

// Windows that aren't dock apps but can still be opened — from the terminal,
// the menu bar, or a link.
const EXTRA_WINDOWS = {
    resume: {
        title: 'Resume',
        size: { width: 760, height: 680 },
        minSize: { width: 520, height: 420 },
    },
    about: {
        title: 'about-me.txt',
        size: { width: 620, height: 480 },
        minSize: { width: 400, height: 300 },
    },
}

// Every project gets a window, keyed by its id, so `open algoarena` works.
const PROJECT_WINDOWS = Object.fromEntries(
    projects.map((project) => [
        project.id,
        {
            title: project.name,
            size: { width: 820, height: 560 },
            minSize: { width: 480, height: 360 },
        },
    ])
)

const APP_WINDOWS = {
    finder: {
        title: 'Portfolio',
        size: { width: 960, height: 620 },
        minSize: { width: 620, height: 420 },
    },
    safari: {
        title: 'Articles',
        size: { width: 1020, height: 640 },
        minSize: { width: 640, height: 420 },
    },
    photos: {
        title: 'Gallery',
        size: { width: 940, height: 620 },
        minSize: { width: 560, height: 400 },
    },
    terminal: {
        title: 'Terminal',
        size: { width: 720, height: 460 },
        minSize: { width: 420, height: 260 },
    },
    contact: {
        // A fixed-size panel, like Contacts' own compact window.
        title: 'Contact',
        size: { width: 560, height: 675 },
        minSize: { width: 560, height: 675 },
        resizable: false,
    },
    trash: {
        title: 'Trash',
        size: { width: 780, height: 500 },
        minSize: { width: 480, height: 340 },
    },
}

export const WINDOW_CONFIG = {
    ...APP_WINDOWS,
    ...EXTRA_WINDOWS,
    ...PROJECT_WINDOWS,
}

/**
 * Resolved settings for one app: defaults with the app's overrides applied.
 * Returns null for an id with no window (so callers can ignore it rather than
 * opening a blank default-sized window).
 */
export const getWindowConfig = (id) => {
    const config = WINDOW_CONFIG[id]
    if (!config) return null

    return { id, ...WINDOW_DEFAULTS, ...config }
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

// Viewport minus the menu bar and the dock. Guarded so an accidental server
// call can't throw on `window`.
export const getDesktopBounds = () => {
    if (typeof window === 'undefined') {
        return { left: 0, top: 0, width: 1280, height: 800 }
    }

    return {
        left: DESKTOP_INSETS.side,
        top: DESKTOP_INSETS.top,
        width: window.innerWidth - DESKTOP_INSETS.side * 2,
        height: window.innerHeight - DESKTOP_INSETS.top - DESKTOP_INSETS.bottom,
    }
}

// Keeps a window fully on the desktop, shrinking it first if it can't fit.
// Lives here so the store and the drag handlers clamp identically.
export const fitToDesktop = ({ x, y, width, height }) => {
    const bounds = getDesktopBounds()
    const w = Math.min(width, bounds.width)
    const h = Math.min(height, bounds.height)

    return {
        x: Math.round(clamp(x, bounds.left, bounds.left + bounds.width - w)),
        y: Math.round(clamp(y, bounds.top, bounds.top + bounds.height - h)),
        width: Math.round(w),
        height: Math.round(h),
    }
}

export default WINDOW_CONFIG
