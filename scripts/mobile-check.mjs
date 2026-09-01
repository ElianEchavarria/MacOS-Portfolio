import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--window-size=430,932', '--hide-scrollbars'],
    defaultViewport: { width: 430, height: 932, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
})
const page = await browser.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 })
await new Promise((r) => setTimeout(r, 4600))
await page.mouse.click(215, 500)
await new Promise((r) => setTimeout(r, 1500))

const visible = (sel) =>
    page.evaluate((s) => {
        const el = document.querySelector(s)
        if (!el) return 'MISSING'
        const r = el.getBoundingClientRect()
        return r.width > 0 && r.height > 0
    }, sel)

console.log('desktop navbar hidden:', (await visible('nav')) === false)
console.log('desktop dock hidden:  ', (await visible('#dock')) === false)
console.log('mobile status time:   ', await page.$eval('div.sm\\:hidden span', (e) => e.textContent))
console.log('home app icons:', (await page.$$('div.grid button')).length)
console.log('mobile dock icons:', (await page.$$('div.rounded-\\[28px\\] button')).length)

const island = 'button[aria-label^="Over My Dead Body"]'
const islandBox = async () => page.$eval(island, (e) => {
    const r = e.getBoundingClientRect()
    return { w: Math.round(r.width), h: Math.round(r.height) }
})
console.log('\nisland collapsed:', JSON.stringify(await islandBox()))
console.log('bars animating:', await page.$$eval(`${island} span.island-bar`, (els) => els.length))

await page.click(island)
await new Promise((r) => setTimeout(r, 700))
console.log('island expanded:', JSON.stringify(await islandBox()))
console.log('expanded text:', JSON.stringify(
    await page.$eval(island, (e) => e.textContent.replace(/\s+/g, ' ').trim())))

const firstElapsed = await page.$eval(island, (e) => e.textContent.match(/\d+:\d\d/)[0])
await new Promise((r) => setTimeout(r, 2200))
const laterElapsed = await page.$eval(island, (e) => e.textContent.match(/\d+:\d\d/)[0])
console.log(`progress advances: ${firstElapsed} -> ${laterElapsed}`, firstElapsed !== laterElapsed ? 'OK' : 'FAIL')

await page.screenshot({ path: 'scripts/mobile-home.png' })

const dockBtn = await page.$$('div.rounded-\\[28px\\] button')
await dockBtn[0].click()
await new Promise((r) => setTimeout(r, 700))
const winBox = await page.$eval('section[aria-label="Portfolio"]', (e) => {
    const r = e.getBoundingClientRect()
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
})
console.log('\nwindow fullscreen on mobile:', JSON.stringify(winBox))
console.log('resize handles hidden:', (await page.$$('section[aria-label="Portfolio"] > span')).length === 0)

await page.screenshot({ path: 'scripts/mobile-window.png' })
console.log(errors.length ? '\nERRORS:\n' + errors.join('\n') : '\nno console errors')
await browser.close()
