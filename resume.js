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
    phone: null,

    // Set to e.g. '/ElianEchavarriaAvila_Resume.pdf' after copying the file
    // into /public. Note the PDF still contains your phone number.
    pdfUrl: null,

    links: [
        { label: 'GitHub', href: 'https://github.com/ElianEchavarria' },
        { label: 'LinkedIn', href: 'https://linkedin.com/in/ElianEchavarria' },
    ],

    // The resume has no summary section. Write one in your own voice, or
    // leave it null and the About section won't render.
    summary: null,

    experience: [
        {
            role: 'Business Development Intern',
            company: 'Blackstone Launchpad | ServiceNetZero',
            location: 'New York, NY',
            period: 'June 2026 – Aug 2026',
            points: [
                'Architected v3 of the LabelZ platform using TypeScript, Python, Vite, Claude, IBM Bob, and VS Code, with Base44 for user profile management — taking the company from idea to MVP and giving ServiceNetZero an actual product to sell rather than a consulting pitch.',
                'Reworked the company landing page applying SEO and AIO/GEO (LLM visibility) principles and the schema behind how websites are built, producing an immediate 22% improvement in visibility to LLMs and a noticeable spike in SEO performance in Google Analytics.',
                'Built a market intelligence dashboard that improved business research efficiency by over 60%, visualizing quantitative and qualitative data side by side from non-LLM sourced data.',
                'Sourced, assisted in the application for, and participated in the NSF I-Corps regional bootcamp — securing $3,000 in immediate funding for customer discovery, conducting academic research under NSF supervision, and overseeing interview logging and data management for the bootcamp.',
                'Applied Agile project management: ran daily standup meetings and maintained project databases and tables in Notion to track progress and triage next steps.',
                'Used active listening to ingest high-level concepts from non-technical stakeholders, bridging the gap between abstract business ideas and concrete technical execution while managing scope and budget.',
            ],
        },
        {
            role: 'Software Engineer Intern',
            company: 'Cambio Labs',
            location: 'Remote',
            period: 'Feb 2026 – May 2026',
            points: [
                'Built and improved full-stack web applications using React, Next.js, Node.js, and PostgreSQL.',
                'Applied data structures, algorithms, and software engineering fundamentals to develop scalable features and internal tools; collaborated cross-functionally on product development and technical strategy.',
            ],
        },
        {
            role: 'Software Engineering Trainee',
            company: 'NYC Tech Talent Pipeline Program',
            location: 'Manhattan, NY',
            period: 'June 2025 – Aug 2025',
            points: [
                'Built Poll Maker on a team of four (JavaScript, React, Node.js, Express, SQL), a full-stack app for creating interactive polls and tracking progress.',
                'Developed an AI study assistant that helps students generate dynamic quizzes, track study habits, and determine class grades.',
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
        'Computer Science Club, ColorStack Chapter — Technical Team Member (Oct 2025 – Present). Lead LeetCode and DSA workshops, mentor peers in problem-solving and interview prep.',
        'Open-Source Contributor — Hacktoberfest 2025.',
    ],

    skills: {
        Languages: ['JavaScript', 'TypeScript', 'Python', 'HTML', 'CSS', 'SQL'],
        'Frameworks & Libraries': [
            'React',
            'Next.js',
            'Node.js',
            'Express',
            'TailwindCSS',
            'Socket.IO',
            'Vite',
        ],
        Databases: ['PostgreSQL', 'Sequelize (ORM)', 'Backend Schema Data Tables'],
        'Infrastructure & Deployment': [
            'Docker',
            'nginx (reverse proxy, TLS)',
            'pm2',
            'Vercel',
            'GitHub Pages',
        ],
        Tools: [
            'Git',
            'GitHub',
            'VS Code',
            'Notion',
            'Claude',
            'IBM Bob',
            'Base44',
            'Postman',
            'Figma',
            'Chrome DevTools',
            'Bash',
            'npm',
        ],
        'Techniques & Concepts': [
            'REST APIs',
            'Agile',
            'SEO/AIO/GEO',
            'Data Visualization',
            'HTTP',
            'OAuth 2.0',
            'OpenAPI Specification',
            'Responsive Design',
        ],
        'Spoken Languages': ['English (Fluent)', 'Spanish (Fluent)'],
    },
}

export default resume
