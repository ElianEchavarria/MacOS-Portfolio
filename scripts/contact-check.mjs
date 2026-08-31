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

const ctx = browser.defaultBrowserContext()
await ctx.overridePermissions('http://localhost:3000', ['clipboard-read', 'clipboard-write'])

await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 })
await new Promise((r) => setTimeout(r, 4600))
await page.mouse.click(800, 500)
await new Promise((r) => setTimeout(r, 1500))

const navItems = await page.$$('nav ul li')
await navItems[2].click()
await new Promise((r) => setTimeout(r, 700))

const sel = 'section[aria-label="Contact"]'
console.log('opened from navbar:', (await page.$(sel)) !== null)

console.log('rows:', JSON.stringify(
    await page.$$eval(`${sel} li`, (els) =>
        els.map((el) => el.children[0].textContent + ': ' + el.children[1].textContent))
))

const fit = await page.evaluate((s) => {
    const body = document.querySelector(`${s} .window-panel > div:last-child`)
    return { scrollH: body.scrollHeight, clientH: body.clientHeight }
}, sel)
console.log('content fits without scrolling:', fit.scrollH <= fit.clientH, JSON.stringify(fit))

await page.type(`${sel} input[aria-label="Subject"]`, 'Hello from your site')
await page.type(`${sel} textarea`, 'Loved the dock.')
await new Promise((r) => setTimeout(r, 200))

const composeHref = await page.$$eval(`${sel} a`, (els) =>
    els.find((el) => el.textContent.trim() === 'Open in Mail')?.getAttribute('href'))
console.log('compose link:', composeHref)

// the traffic lights are buttons too, so pick the copy button by its label
const copyLabel = () =>
    page.$$eval(`${sel} button`, (els) =>
        els.find((el) => /Copy|Copied/.test(el.textContent))?.textContent)

// headless Chrome denies clipboard writes outright (NotAllowedError) whatever
// permissions are granted, so stub the API to verify this component's logic
await page.evaluate(() => {
    window.__copied = null
    Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
            writeText: async (text) => {
                window.__copied = text
            },
        },
    })
})

const copyBox = await page.$$eval(`${sel} button`, (els) => {
    const btn = els.find((el) => /Copy/.test(el.textContent))
    const r = btn.getBoundingClientRect()
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
})
await page.mouse.click(copyBox.x, copyBox.y)
await new Promise((r) => setTimeout(r, 300))
console.log('copy button after click:', await copyLabel())
console.log('text handed to the clipboard:', JSON.stringify(await page.evaluate(() => window.__copied)))

await new Promise((r) => setTimeout(r, 1700))
console.log('label reverts after timeout:', await copyLabel())

await (await page.$(sel)).screenshot({ path: 'scripts/contact.png' })
console.log(errors.length ? '\nERRORS:\n' + errors.join('\n') : '\nno console errors')
await browser.close()
