/**
 * Resume content, transcribed from ElianEchavarriaAvila_Resume.pdf.
 *
 * Empty sections are skipped by the window, so deleting a field removes it
 * from the page. To offer a download, drop a PDF in /public and set `pdfUrl`
 * to its path — see the note there before you do.
 */
const resume = {
    name: 'Elian Echavarria Avila',
    title: null,
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

    summary: null,

    experience: [
        {
            role: 'Business Development Intern',
            company: 'Blackstone LaunchPad | ServiceNetZero',
            location: 'New York, NY',
            period: 'June 2026 – Aug 2026',
            points: [
                'Architected v3 of the LabelZ platform in TypeScript, Python, and Vite (AI-assisted with Claude and IBM Bob, Base44 for user profiles), taking the company from idea to MVP and giving ServiceNetZero its first sellable product.',
                'Rebuilt the company landing page with SEO, AIO/GEO (LLM visibility), and structured-data schema, driving an immediate 22% increase in LLM visibility and a spike in Google Analytics search performance.',
                'Built a dashboard visualizing quantitative and qualitative non-LLM market data, improving research efficiency by over 60%.',
                'Sourced and completed the NSF I-Corps regional bootcamp, securing $3,000 in customer-discovery funding; ran daily Agile standups and translated non-technical stakeholder goals into technical execution.',
            ],
        },
        {
            role: 'Full-Stack Engineer Intern',
            company: 'Cambio Labs',
            location: 'Remote',
            period: 'Feb 2026 – May 2026',
            points: [
                'Built a 23-step React/TypeScript onboarding tour taking instructors from course creation to publishing on 10+ admin pages.',
                'Built a custom spotlight/tooltip overlay from scratch with async-element support, viewport-aware placement, and dragging.',
                'Centralized tour state in a React Context across nested routes, tracking progress and IDs so Skip/Back/Resume route correctly.',
                'Made steps action-driven, advancing only when users complete the real task (e.g., creating a course or uploading media).',
            ],
        },
        {
            role: 'Software Engineering Trainee',
            company: 'NYC Tech Talent Pipeline',
            location: 'New York, NY',
            period: 'June 2025 – Aug 2025',
            points: [
                'Built two full-stack apps on four-person teams (JavaScript, React, Node.js, Express, SQL): Poll Maker for creating and tracking interactive polls, and an AI study assistant that generates quizzes, tracks study habits, and calculates grades.',
            ],
        },
    ],

    education: [
        {
            school: 'Lehman College, CUNY',
            credential: 'B.S. Computer Science',
            location: 'Bronx, NY',
            period: 'Jan 2026 – Expected Dec 2027',
        },
    ],

    leadership: [
        'ColorStack Chapter, Computer Science Club — Technical Team Member (Oct 2025 – Dec 2025). Led LeetCode/DSA workshops and mentored peers in interview prep; open-source contributor in Hacktoberfest 2025.',
    ],

    skills: {
        Languages: ['JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML', 'CSS'],
        'Frameworks & Libraries': [
            'React',
            'Next.js',
            'Node.js',
            'Express',
            'Prisma',
            'Auth.js',
            'Socket.IO',
            'Tailwind CSS',
            'Vite',
            'discord.py',
            'pytest',
        ],
        Databases: [
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
            'Bash',
            'npm',
            'Postman',
            'Figma',
            'Claude',
        ],
        Concepts: [
            'REST APIs',
            'OAuth 2.0',
            'WebSockets',
            'OpenAPI',
            'HTTP',
            'Agile',
            'SEO/AIO/GEO',
            'Responsive design',
        ],
        'Spoken Languages': ['English (Fluent)', 'Spanish (Fluent)'],
    },
}

export default resume
