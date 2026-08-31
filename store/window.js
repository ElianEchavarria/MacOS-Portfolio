import { create } from "zustand";
// Comes from zustand's middleware, not the `immer` package itself.
import { immer } from "zustand/middleware/immer";

import {
    WINDOW_CASCADE_STEP,
    fitToDesktop,
    getDesktopBounds,
    getWindowConfig,
} from "@/windowConfig";

const BASE_Z = 10;

const spawnPosition = (size, index) => {
    const bounds = getDesktopBounds();
    const step = WINDOW_CASCADE_STEP * index;

    return fitToDesktop({
        x: bounds.left + (bounds.width - size.width) / 2 + step,
        y: bounds.top + (bounds.height - size.height) / 3 + step,
        width: size.width,
        height: size.height,
    });
};

// `windows` holds the windows that are currently OPEN, not the catalogue of
// what can open — WINDOW_CONFIG stays static and is read through
// getWindowConfig() when a window is created.
const useWindowStore = create(
    immer((set) => ({
        windows: [],
        topZ: BASE_Z,

        // Opens the app, or focuses and un-minimises it if already open.
        openApp: (id) =>
            set((state) => {
                const open = state.windows.find((w) => w.id === id);

                if (open) {
                    open.isMinimized = false;
                    open.zIndex = ++state.topZ;
                    return;
                }

                const config = getWindowConfig(id);
                if (!config) return;

                const spawn = spawnPosition(config.size, state.windows.length);

                state.windows.push({
                    id,
                    title: config.title,
                    position: { x: spawn.x, y: spawn.y },
                    size: { width: spawn.width, height: spawn.height },
                    minSize: config.minSize,
                    resizable: config.resizable,
                    zIndex: ++state.topZ,
                    isMinimized: false,
                    isMaximized: false,
                    restoreBounds: null,
                });
            }),

        closeWindow: (id) =>
            set((state) => {
                state.windows = state.windows.filter((w) => w.id !== id);
            }),

        focusWindow: (id) =>
            set((state) => {
                const win = state.windows.find((w) => w.id === id);
                if (!win || win.zIndex === state.topZ) return;

                win.zIndex = ++state.topZ;
            }),

        minimizeWindow: (id) =>
            set((state) => {
                const win = state.windows.find((w) => w.id === id);
                if (win) win.isMinimized = true;
            }),

        toggleMaximize: (id) =>
            set((state) => {
                const win = state.windows.find((w) => w.id === id);
                if (!win || !win.resizable) return;

                if (win.isMaximized && win.restoreBounds) {
                    const restored = fitToDesktop(win.restoreBounds);
                    win.position = { x: restored.x, y: restored.y };
                    win.size = { width: restored.width, height: restored.height };
                    win.isMaximized = false;
                    win.restoreBounds = null;
                    return;
                }

                const bounds = getDesktopBounds();
                win.restoreBounds = { ...win.position, ...win.size };
                win.position = { x: bounds.left, y: bounds.top };
                win.size = { width: bounds.width, height: bounds.height };
                win.isMaximized = true;
            }),

        moveWindow: (id, x, y) =>
            set((state) => {
                const win = state.windows.find((w) => w.id === id);
                if (!win) return;

                const fitted = fitToDesktop({ x, y, ...win.size });
                win.position = { x: fitted.x, y: fitted.y };
            }),

        // Takes position too, since dragging a top or left edge moves the
        // window as it resizes. Callers apply minSize (they know which edge is
        // anchored); this only clamps to the desktop.
        setBounds: (id, bounds) =>
            set((state) => {
                const win = state.windows.find((w) => w.id === id);
                if (!win || !win.resizable) return;

                const fitted = fitToDesktop(bounds);
                win.position = { x: fitted.x, y: fitted.y };
                win.size = { width: fitted.width, height: fitted.height };
                win.isMaximized = false;
            }),

        // Re-fits every window after the viewport changes.
        reflowWindows: () =>
            set((state) => {
                const bounds = getDesktopBounds();

                state.windows.forEach((win) => {
                    if (win.isMaximized) {
                        win.position = { x: bounds.left, y: bounds.top };
                        win.size = { width: bounds.width, height: bounds.height };
                        return;
                    }

                    const fitted = fitToDesktop({ ...win.position, ...win.size });
                    win.position = { x: fitted.x, y: fitted.y };
                    win.size = { width: fitted.width, height: fitted.height };
                });
            }),
    }))
);

export default useWindowStore;
