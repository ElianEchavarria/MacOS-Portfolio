/**
 * Resume content, transcribed from ElianEchavarriaAvila_Resume.pdf.
 *
 * Empty sections are skipped by the window, so deleting a field removes it
 * from the page. To offer a download, drop a PDF in /public and set `pdfUrl`
 * to its path — see the note there before you do.
 */
const resume = {
    name: 'Elian Echavarria Avila',
    // Not on the resume — it has no headline. Change this to whatever you want
    // to lead with.
    title: 'Software Engineer',
    location: 'New York, NY',
    email: 'eechavarria.2022@gmail.com',

    // Your phone number is on the PDF but deliberately not here: a website is
    // scraped far more aggressively than a resume you hand to a recruiter.
    phone: '(929) 303-8649',

    pdfUrl: '/Elian_Echavarria_Resume.pdf',

    links: [
        { label: 'GitHub', href: 'https://github.com/ElianEchavarria' },
        { label: 'LinkedIn', href: 'https://linkedin.com/in/ElianEchavarria' },
    ],

    // The resume has no summary section. Write one in your own voice, or
    // leave it null and the About section won't render.
    summary:
        'Full-stack developer studying Computer Science at Lehman College. I work mostly in JavaScript, TypeScript, React, Next.js, Express and PostgreSQL — I shipped a 1v1 real-time competitive coding platform solo, and at Cambio Labs I built a 23-step interactive onboarding tour spanning 10+ admin pages, spotlight overlay written from scratch. Big on clean UI, good UX, and code that does not take a team to debug.',

    experience: [
        {
            role: 'Business Development Intern',
            company: 'Blackstone Launchpad | ServiceNetZero',
            location: 'New York, NY',
            period: 'June 2026 – Aug 2026',
            points: [
                'Architected v3 of the LabelZ platform using TypeScript, Python, Vite, Claude, and IBM Bob, with Base44 for user profile management — taking the company from idea to MVP and giving ServiceNetZero an actual product to sell.',
                'Reworked the company landing page applying SEO and AIO/GEO (LLM visibility) principles and website schema, producing an immediate 22% improvement in visibility to LLMs and a spike in SEO performance in Google Analytics.',
                'Built a market intelligence dashboard that improved business research efficiency by over 60%, visualizing quantitative and qualitative data side by side from non-LLM sourced data.',
                'Sourced and participated in the NSF I-Corps regional bootcamp, securing $3,000 in funding for customer discovery; ran daily Agile standups and translated high-level concepts from non-technical stakeholders into concrete technical execution.',
            ],
        },
        {
            role: 'Software Engineer Intern',
            company: 'Cambio Labs',
            location: 'Remote',
            period: 'Feb 2026 – May 2026',
            points: [
                'Designed and built a 23-step interactive onboarding tour in React/TypeScript guiding new instructors through the full course lifecycle — from creating a course to publishing it — across 10+ admin pages.',
                'Built a custom spotlight and tooltip overlay from scratch instead of using a third-party library, supporting async-loaded elements, viewport-aware placement, and a draggable tooltip card.',
                'Centralized tour state in a single React Context shared across nested routes, tracking progress and user-created IDs so Skip, Back, and Resume route users to the correct page.',
                'Made steps action-driven — the tour advances only when users complete the real task (creating a course, adding a checkpoint, uploading media), teaching the product through use.',
            ],
        },
        {
            role: 'Software Engineering Trainee',
            company: 'NYC Tech Talent Pipeline Program',
            location: 'Manhattan, NY',
            period: 'June 2025 – Aug 2025',
            points: [
                'Built two full-stack applications on teams of four (JavaScript, React, Node.js, Express, SQL): Poll Maker, for creating interactive polls and tracking progress, and an AI study assistant that generates dynamic quizzes, tracks study habits, and determines class grades.',
            ],
        },
    ],

    education: [
        {
            school: 'Lehman College, CUNY',
            credential: 'B.S. Computer Science (Transfer)',
            location: 'Bronx, NY',
            period: 'Jan 2026 – Dec 2027',
        },
        {
            school: 'Borough of Manhattan Community College, CUNY',
            credential: 'A.S. Computer Science',
            location: 'Manhattan, NY',
            period: 'Sept 2022 – Dec 2025',
            note: 'Relevant coursework: Data Structures, Analysis of Algorithms',
        },
    ],

    leadership: [
        'Computer Science Club, ColorStack Chapter — Technical Team Member (Oct 2025 – Dec 2025). Lead LeetCode and DSA workshops, mentor peers in problem-solving and interview prep.',
        'Open-Source Contributor — Hacktoberfest 2025.',
    ],

    skills: {
        Languages: ['JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML', 'CSS'],
        'Frameworks & Libraries': [
            'React',
            'Next.js',
            'Node.js',
            'Express',
            'TailwindCSS',
            'Socket.IO',
            'Vite',
            'asyncio',
            'discord.py',
            'pytest',
        ],
        'Databases & Data': [
            'PostgreSQL',
            'SQLite',
            'Sequelize (ORM)',
            'Schema design',
            'Data visualization',
        ],
        'Infrastructure & Tools': [
            'Docker',
            'nginx (reverse proxy, TLS)',
            'pm2',
            'Vercel',
            'Git',
            'GitHub',
            'VS Code',
            'Notion',
            'Claude',
            'IBM Bob',
            'Base44',
            'Postman',
            'Figma',
            'Bash',
            'npm',
        ],
        Concepts: [
            'REST APIs',
            'Agile',
            'SEO/AIO/GEO',
            'HTTP',
            'OAuth 2.0',
            'OpenAPI',
            'Responsive design',
        ],
        'Spoken Languages': ['English (Fluent)', 'Spanish (Fluent)'],
    },
}

export default resume
