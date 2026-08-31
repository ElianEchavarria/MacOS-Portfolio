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
            .map((el) => el.getAttribute('aria-label'))
    )

// 1. the navbar link should open it
const navItems = await page.$$('nav ul li')
await navItems[1].click() // Resume
await new Promise((r) => setTimeout(r, 600))
console.log('after clicking navbar "Resume":', JSON.stringify(await openTitles()))

const resumeSel = 'section[aria-label="Resume"]'
console.log('\nrendered sections:', JSON.stringify(
    await page.$$eval(`${resumeSel} h3`, (els) => els.map((e) => e.textContent))
))
console.log('heading:', JSON.stringify(
    await page.$eval(`${resumeSel} h2`, (e) => e.textContent)
))
console.log('download button present (pdfUrl is null):',
    await page.$(`${resumeSel} a[download]`) !== null)
console.log('empty links hidden (both href null):',
    (await page.$$(`${resumeSel} header a`)).length === 0)

// scrolls inside the window rather than clipping
const scroll = await page.evaluate((sel) => {
    const body = document.querySelector(`${sel} .window-panel > div:last-child`)
    return { scrollH: body.scrollHeight, clientH: body.clientHeight }
}, resumeSel)
console.log('content scrolls in-window:', JSON.stringify(scroll))

await (await page.$(resumeSel)).screenshot({ path: 'scripts/resume.png' })

// 2. the terminal route should focus the same window, not open a second
const apps = await page.$$('#dock .dock-app button')
await apps[3].click()
await new Promise((r) => setTimeout(r, 600))
const term = 'section[aria-label="Terminal"]'
await page.focus(`${term} input`)
await page.type(`${term} input`, 'open resume')
await page.keyboard.press('Enter')
await new Promise((r) => setTimeout(r, 500))
console.log('\nafter `open resume` with it already open:', JSON.stringify(await openTitles()))

console.log(errors.length ? '\nERRORS:\n' + errors.join('\n') : '\nno console errors')
await browser.close()
