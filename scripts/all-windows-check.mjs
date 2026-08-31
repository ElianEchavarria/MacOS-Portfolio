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

const open = async (id) => {
    await page.evaluate(() => { window.__t = document.querySelectorAll('#dock .dock-app button') })
    return page.evaluate((appId) => {
        const store = window.__store
        return appId
    }, id)
}

const terminal = 'section[aria-label="Terminal"]'
const apps = await page.$$('#dock .dock-app button')
await apps[3].click()
await new Promise((r) => setTimeout(r, 600))

const run = async (cmd) => {
    await page.focus(`${terminal} input`)
    await page.type(`${terminal} input`, cmd)
    await page.keyboard.press('Enter')
    await new Promise((r) => setTimeout(r, 450))
}

const body = (title) =>
    page.evaluate((t) => {
        const el = document.querySelector(`section[aria-label="${t}"]`)
        if (!el) return 'WINDOW MISSING'
        const content = el.querySelector('.window-panel > div:last-child')
        return content.textContent.trim().replace(/\s+/g, ' ').slice(0, 90)
    }, title)

for (const [cmd, title] of [
    ['open articles', 'Articles'],
    ['open gallery', 'Gallery'],
    ['open trash', 'Trash'],
]) {
    await run(cmd)
    console.log(`${title.padEnd(10)} -> ${await body(title)}`)
}

// about-me.txt from Finder
await run('open portfolio')
const finder = 'section[aria-label="Portfolio"]'
const favs = `${finder} aside ul:first-of-type button`
const b = await page.$$eval(favs, (els) => {
    const r = els[1].getBoundingClientRect()
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
})
await page.mouse.click(b.x, b.y)
await new Promise((r) => setTimeout(r, 350))

const file = await page.$$eval(`${finder} ul.flex-wrap li button`, (els) => {
    const r = els[0].getBoundingClientRect()
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
})
await page.mouse.move(file.x, file.y)
await page.mouse.down({ clickCount: 1 })
await page.mouse.up({ clickCount: 1 })
await page.mouse.down({ clickCount: 2 })
await page.mouse.up({ clickCount: 2 })
await new Promise((r) => setTimeout(r, 500))
console.log(`about-me   -> ${await body('about-me.txt')}`)

const titles = await page.evaluate(() =>
    [...document.querySelectorAll('section[aria-label]')]
        .filter((el) => el.querySelector('.window-panel'))
        .map((el) => el.getAttribute('aria-label')))
console.log('\nall open windows:', JSON.stringify(titles))

console.log(errors.length ? '\nERRORS:\n' + errors.join('\n') : '\nno console errors')
await browser.close()
