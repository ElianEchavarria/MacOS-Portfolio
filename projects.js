/**
 * Your projects, transcribed from the resume.
 *
 * `ls projects/` lists these and `open <id>` opens one, so `id` is what people
 * actually type — keep it short, lowercase and hyphenated. Each project also
 * gets its own window automatically (see windowConfig.js).
 */
const projects = [
    {
        id: 'algostrike',
        name: 'AlgoStrike',
        tagline: 'A 1v1 real-time competitive coding platform.',
        year: '2026',
        links: [
            { label: 'Live site', url: 'https://algostrike.dev' },
            { label: 'Frontend repo', url: 'https://github.com/ElianEchavarria/AlgoArena-Frontend' },
            { label: 'Backend repo', url: 'https://github.com/ElianEchavarria/AlgoArena-Backend' },
        ],
        stack: ['Next.js', 'Node.js', 'Express', 'PostgreSQL', 'Socket.IO', 'Docker'],
        points: [
            'Architected and shipped a full-stack 1v1 real-time competitive coding platform solo — players are matched live, solve the same problem head-to-head, and race to win — deployed to production on a custom domain over HTTPS.',
            'Built a secure multi-language code-execution engine running untrusted submissions (Python, JavaScript, Java) in isolated Docker containers with no network access and strict CPU/memory/5-second limits, paired with an automated grader for 50+ LeetCode-style problems.',
            'Owned the end-to-end deployment: provisioned an Ubuntu VPS with Docker, configured nginx as a reverse proxy with Let’s Encrypt TLS and WebSocket support, ran Node under pm2, hosted the frontend on Vercel, and connected a managed Postgres database.',
        ],
    },
    {
        id: 'lyriq',
        name: 'Lyriq',
        tagline: 'Real-time synced lyrics for Spotify.',
        year: '2026',
        links: [
            { label: 'Live site', url: 'https://lyric-plum.vercel.app' },
            { label: 'GitHub repo', url: 'https://github.com/ElianEchavarria/lyric' },
        ],
        stack: ['Next.js', 'TypeScript', 'React', 'PostgreSQL', 'Prisma', 'Auth.js', 'Vercel'],
        points: [
            'Built and deployed a full-stack Next.js/TypeScript web app that mirrors a user’s live Spotify playback and renders word-by-word karaoke lyrics, hosted on Vercel with a Neon PostgreSQL database.',
            'Engineered a fault-tolerant lyrics pipeline that falls back across 3 sources (LRCLIB exact match, LRCLIB search, Genius scraping), with per-source timeouts and caching. It parses LRC timestamps and interpolates word timings when a source only provides line timing.',
            'Designed a client-side playback clock that extrapolates song position between API polls using requestAnimationFrame, with user-tunable latency compensation. Adaptive polling (3s playing, 10s paused, suspended in background tabs) cuts unnecessary API calls.',
            'Implemented OAuth 2.0 sign-in with Auth.js and automatic token refresh, plus a REST API on Prisma/PostgreSQL for saved lyric “moments” with input validation, cursor-based pagination and per-user data isolation.',
            'Built in-browser video export that renders karaoke animations on HTML Canvas and records native MP4 with the MediaRecorder API, replacing a planned WebAssembly encoder.',
        ],
    },
    {
        id: 'discord-stock-game',
        name: 'Discord Stock Trading Game',
        tagline: 'A Discord bot that runs a paper-trading game on live market data.',
        year: '2026',
        links: [
            {
                label: 'GitHub repo',
                url: 'https://github.com/ElianEchavarria/Discord-Stock-Market-Game',
            },
        ],
        stack: ['Python', 'asyncio', 'SQLite', 'yfinance', 'pytest'],
        points: [
            'Built an async Discord bot (discord.py 2.x) running a paper-trading game on live market data, with persistent portfolios over a normalized SQLite schema (users, holdings, trade ledger), P&L tracking, and a scheduled weekly leaderboard.',
            'Implemented weighted-average cost-basis accounting to compute realized and unrealized P&L across partial buys and sells.',
            'Cut multi-symbol quote latency ~5x by replacing sequential awaits with asyncio.gather and adding a 60s TTL cache collapsing repeated ticker lookups into one API call; kept all I/O off the event loop via asyncio.to_thread and aiosqlite.',
            'Wrote 27 pytest tests with mocked market data and temp databases, then validated coverage by mutation testing — which exposed an average-cost test that passed against deliberately broken math.',
        ],
    },
    {
        id: 'lockin',
        name: 'LockIn',
        tagline: 'A full-stack student platform with an AI study chat.',
        year: '2025',
        links: [
            { label: 'Live site', url: 'https://lock-in-front-end.vercel.app' },
            { label: 'Frontend repo', url: 'https://github.com/LockIn-Capstone2/LockIn-FrontEnd' },
            { label: 'Backend repo', url: 'https://github.com/LockIn-Capstone2/Capstone-2-Backend' },
        ],
        stack: ['JavaScript', 'React', 'Next.js', 'Node.js', 'Express', 'SQL'],
        points: [
            'Built a full-stack student platform on a team, shipping a Grade Calculator, progress dashboards, and an AI Study Chat for real-time contextual help.',
            'Diagnosed slow content load times and migrated the website from React to Next.js, adopting server-side rendering and route-based code splitting to cut initial page load.',
        ],
    },
    {
        id: 'macos-portfolio',
        name: 'macOS Portfolio',
        tagline: 'This site — a macOS desktop rebuilt in the browser.',
        year: '2026',
        links: [],
        stack: ['Next.js', 'Tailwind', 'GSAP', 'Zustand'],
        points: [
            'A working desktop environment: draggable and resizable windows, a magnifying dock, and a shell that opens the other windows.',
            'Hand-rolled the window manager instead of reaching for a library: eight-direction resizing driven by a single pointer handler, drag gestures bound at the window level so they survive the cursor outrunning the element, traffic-light close/minimize/zoom, click-to-focus z-ordering, and geometry clamped to the desktop so a window can never be dropped off-screen.',
            'Kept drags and resizes smooth by coalescing pointermove onto animation frames and painting geometry straight to the DOM mid-gesture, committing to the Zustand store only on pointerup — so a 1000Hz mouse can’t force a React render per event.',
            'Wrote a small working shell for the Terminal window — help, whoami, path-aware ls over a virtual filesystem, open <name> with aliases, clear — plus arrow-key command history and errors that suggest the next command to try.',
            'Wired the file system and apps together so content lives in one place: Finder folders (Work, About me, Resume) and the Gallery, Articles and Contact apps all resolve to the same window ids the shell uses, and every project in the data file gets its own window for free.',
            'Shipped a real mobile experience rather than a shrunken desktop: under 640px the desktop becomes an iOS home screen with a status bar, an interactive Dynamic Island that expands into an animated now-playing widget, an app grid and a blurred dock with open-app indicators, while windows become full-screen sheets with a Go Back header.',
        ],
    },
]

export default projects
