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

const openTitles = () =>
    page.evaluate(() =>
        [...document.querySelectorAll('section[aria-label]')]
            .filter((el) => el.querySelector('.window-panel'))
            .map((el) => el.getAttribute('aria-label')))

const apps = await page.$$('#dock .dock-app button')
await apps[0].click()
await new Promise((r) => setTimeout(r, 700))

const sel = 'section[aria-label="Portfolio"]'
const grid = `${sel} ul.flex-wrap li button`
const favButtons = `${sel} aside ul:first-of-type button`

const gridItems = () => page.$$eval(grid, (els) => els.map((e) => e.textContent.trim()))
const header = () => page.$eval(`${sel} h2`, (e) => e.textContent)
const count = () => page.$eval(`${sel} h2 + span`, (e) => e.textContent)

console.log('sidebar favorites:', JSON.stringify(
    await page.$$eval(favButtons, (els) => els.map((e) => e.textContent.trim()))))
console.log('sidebar work:', JSON.stringify(
    await page.$$eval(`${sel} aside ul:last-of-type button`, (els) => els.map((e) => e.textContent.trim()))))

console.log(`\n[Work] ${await header()} / ${await count()}`)
console.log('  grid:', JSON.stringify(await gridItems()))

const clickFav = async (i) => {
    const b = await page.$$eval(favButtons, (els, idx) => {
        const r = els[idx].getBoundingClientRect()
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    }, i)
    await page.mouse.click(b.x, b.y)
    await new Promise((r) => setTimeout(r, 350))
}

for (const [i, label] of [[1, 'About me'], [2, 'Resume'], [3, 'Trash']]) {
    await clickFav(i)
    const items = await gridItems().catch(() => [])
    const empty = await page.$$eval(`${sel} div:last-child`, (els) =>
        els.map((e) => e.textContent).find((t) => /Trash is Empty|Empty/.test(t)) ?? null)
    console.log(`[${label}] ${await header()} / ${await count()}`)
    console.log('  grid:', JSON.stringify(items), empty ? '(empty state shown)' : '')
}

await clickFav(2)
const dbl = await page.$$eval(grid, (els) => {
    const r = els[0].getBoundingClientRect()
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
})
await page.mouse.move(dbl.x, dbl.y)
await page.mouse.down({ clickCount: 1 })
await page.mouse.up({ clickCount: 1 })
await page.mouse.down({ clickCount: 2 })
await page.mouse.up({ clickCount: 2 })
await new Promise((r) => setTimeout(r, 500))
console.log('\ndouble-click Resume.pdf ->', JSON.stringify(await openTitles()))

await clickFav(0)
const proj = await page.$$eval(grid, (els) => {
    const r = els[0].getBoundingClientRect()
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
})
await page.mouse.move(proj.x, proj.y)
await page.mouse.down({ clickCount: 1 })
await page.mouse.up({ clickCount: 1 })
await page.mouse.down({ clickCount: 2 })
await page.mouse.up({ clickCount: 2 })
await new Promise((r) => setTimeout(r, 500))
console.log('double-click first project ->', JSON.stringify(await openTitles()))

await (await page.$(sel)).screenshot({ path: 'scripts/finder.png' })
console.log(errors.length ? '\nERRORS:\n' + errors.join('\n') : '\nno console errors')
await browser.close()
