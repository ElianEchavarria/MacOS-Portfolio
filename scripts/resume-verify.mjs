import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--window-size=1600,1000', '--hide-scrollbars'],
    defaultViewport: { width: 1600, height: 1000, deviceScaleFactor: 2 },
})
const page = await browser.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 })
await new Promise((r) => setTimeout(r, 4600))
await page.mouse.click(800, 500)
await new Promise((r) => setTimeout(r, 1500))

const navItems = await page.$$('nav ul li')
await navItems[1].click()
await new Promise((r) => setTimeout(r, 800))

const sel = 'section[aria-label="Resume"]'

const btn = await page.$eval(`${sel} a[download]`, (el) => {
    const r = el.getBoundingClientRect()
    return { text: el.textContent.trim(), href: el.getAttribute('href'), x: r.x, y: r.y }
})
const win = await page.$eval(sel, (el) => {
    const r = el.getBoundingClientRect()
    return { x: r.x, y: r.y, w: r.width, h: r.height }
})
console.log('download button:', JSON.stringify(btn))
console.log('  in top-right quadrant:',
    btn.x > win.x + win.w / 2 && btn.y < win.y + win.h / 2)

const res = await fetch('http://localhost:3000' + btn.href)
console.log('  pdf serves:', res.status, res.headers.get('content-type'),
    Math.round((await res.arrayBuffer()).byteLength / 1024) + 'KB')

const text = await page.$eval(sel, (el) => el.textContent.replace(/\s+/g, ' '))

const facts = [
    'Elian Echavarria Avila',
    'New York, NY',
    'eechavarria.2022@gmail.com',
    'Business Development Intern',
    'Blackstone Launchpad | ServiceNetZero',
    'June 2026 – Aug 2026',
    'Cambio Labs',
    'Feb 2026 – May 2026',
    'NYC Tech Talent Pipeline Program',
    'June 2025 – Aug 2025',
    'Lehman College, CUNY',
    'B.S. Computer Science (Transfer)',
    'Jan 2026 – Dec 2027',
    'Borough of Manhattan Community College, CUNY',
    'A.S. Computer Science',
    'Sept 2022 – Dec 2025',
    'Data Structures, Analysis of Algorithms',
    'Oct 2025 – Dec 2025',
    'Hacktoberfest 2025',
    '22% improvement',
    '$3,000',
    'over 60%',
    'TypeScript',
    'PostgreSQL',
    'Sequelize (ORM)',
    'nginx (reverse proxy, TLS)',
    'OAuth 2.0',
    'English (Fluent)',
    'Spanish (Fluent)',
]

const missing = facts.filter((f) => !text.includes(f))
console.log('\nfacts checked:', facts.length, '| missing:', missing.length ? JSON.stringify(missing) : 'none')

console.log('phone shown on page:', /929/.test(text))
console.log('sections:', JSON.stringify(await page.$$eval(`${sel} h3`, (els) => els.map((e) => e.textContent))))

await (await page.$(sel)).screenshot({ path: 'scripts/resume-final.png' })
console.log(errors.length ? '\nERRORS:\n' + errors.join('\n') : '\nno console errors')
await browser.close()
