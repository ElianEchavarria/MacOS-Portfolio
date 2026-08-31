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
        url: 'https://algostrike.dev',
        stack: ['Next.js', 'Node.js', 'Express', 'PostgreSQL', 'Socket.IO', 'Docker'],
        points: [
            'Architected and shipped a full-stack 1v1 real-time competitive coding platform solo — players are matched live, solve the same problem head-to-head, and race to win — deployed to production on a custom domain over HTTPS.',
            'Built a secure multi-language code-execution engine running untrusted submissions (Python, JavaScript, Java) in isolated Docker containers with no network access and strict CPU/memory/5-second limits, paired with an automated grader for 50+ LeetCode-style problems.',
            'Owned the end-to-end deployment: provisioned an Ubuntu VPS with Docker, configured nginx as a reverse proxy with Let’s Encrypt TLS and WebSocket support, ran Node under pm2, hosted the frontend on Vercel, and connected a managed Postgres database.',
        ],
    },
    {
        id: 'lockin',
        name: 'LockIn',
        tagline: 'A full-stack student platform with an AI study chat.',
        year: '2025',
        url: null,
        stack: ['JavaScript', 'React', 'Next.js', 'Node.js', 'Express', 'SQL'],
        points: [
            'Built a full-stack student platform on a team, shipping a Grade Calculator, progress dashboards, and an AI Study Chat for real-time contextual help.',
            'Diagnosed slow content load times and migrated the website from React to Next.js, significantly improving load performance and user experience.',
        ],
    },
    {
        id: 'macos-portfolio',
        name: 'macOS Portfolio',
        tagline: 'This site — a macOS desktop rebuilt in the browser.',
        year: '2026',
        url: null,
        stack: ['Next.js', 'Tailwind', 'GSAP', 'Zustand'],
        points: [
            'A working desktop environment: draggable and resizable windows, a magnifying dock, and a shell that opens the other windows.',
        ],
    },
]

export default projects
