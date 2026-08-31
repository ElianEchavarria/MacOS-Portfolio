import projects from '@/projects'

export const FOLDERS = {
    work: {
        label: 'Work',
        items: projects.map((project) => ({
            id: project.id,
            name: project.name,
            icon: '/folder.png',
            opens: project.id,
        })),
    },
    about: {
        label: 'About me',
        items: [
            {
                id: 'about-me-txt',
                name: 'about-me.txt',
                icon: '/txt.png',
                opens: 'about',
            },
        ],
    },
    resume: {
        label: 'Resume',
        items: [
            {
                id: 'resume-pdf',
                name: 'Resume.pdf',
                icon: '/pdf.png',
                opens: 'resume',
            },
        ],
    },
    trash: {
        label: 'Trash',
        items: [],
        emptyMessage: 'Trash is Empty',
    },
}

export const FAVORITES = ['work', 'about', 'resume', 'trash']
