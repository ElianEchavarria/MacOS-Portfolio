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

const dockIcon = async (i) => {
    const apps = await page.$$('#dock .dock-app button')
    return apps[i]
}
const windows = () =>
    page.evaluate(() =>
        [...document.querySelectorAll('section[aria-label]')]
            .filter((el) => el.querySelector('.window-panel'))
            .map((el) => {
                const r = el.getBoundingClientRect()
                return {
                    title: el.getAttribute('aria-label'),
                    x: Math.round(r.x), y: Math.round(r.y),
                    w: Math.round(r.width), h: Math.round(r.height),
                    z: +getComputedStyle(el).zIndex,
                }
            })
    )

// --- open three apps -------------------------------------------------------
for (const i of [0, 3, 4]) {
    ;(await dockIcon(i)).click()
    await new Promise((r) => setTimeout(r, 400))
}
console.log('after opening finder/terminal/contact:')
console.table(await windows())

const dots = await page.evaluate(() =>
    [...document.querySelectorAll('#dock .dock-app')].map((a) => {
        const dot = a.querySelector('span.rounded-full.bg-white\\/80')
        return dot ? +getComputedStyle(dot).opacity : null
    })
)
console.log('dock running dots (finder,safari,photos,terminal,contact,trash):', JSON.stringify(dots))

// --- focus: click the first window, it should rise to the top --------------
let w = await windows()
const finder = w.find((x) => x.title === 'Portfolio')
// click near Portfolio's left edge, which the other two windows don't cover
await page.mouse.click(finder.x + 20, finder.y + 300)
await new Promise((r) => setTimeout(r, 250))
w = await windows()
const top = w.reduce((a, b) => (a.z > b.z ? a : b))
console.log(`topmost after clicking Portfolio: ${top.title}`, top.title === 'Portfolio' ? 'OK' : 'FAIL')

// --- drag by the title bar -------------------------------------------------
const before = (await windows()).find((x) => x.title === 'Portfolio')
await page.mouse.move(before.x + before.w / 2, before.y + 18)
await page.mouse.down()
await page.mouse.move(before.x + before.w / 2 + 120, before.y + 18 + 60, { steps: 12 })
await page.mouse.up()
await new Promise((r) => setTimeout(r, 250))
const after = (await windows()).find((x) => x.title === 'Portfolio')
console.log(`drag: moved by dx=${after.x - before.x} dy=${after.y - before.y} (expected 120/60)`)

// --- resize from the bottom-right corner -----------------------------------
const r0 = (await windows()).find((x) => x.title === 'Portfolio')
await page.mouse.move(r0.x + r0.w - 2, r0.y + r0.h - 2)
await page.mouse.down()
await page.mouse.move(r0.x + r0.w + 90, r0.y + r0.h + 70, { steps: 12 })
await page.mouse.up()
await new Promise((r) => setTimeout(r, 250))
const r1 = (await windows()).find((x) => x.title === 'Portfolio')
console.log(`resize se: dw=${r1.w - r0.w} dh=${r1.h - r0.h} (expected ~90/70)`)

// --- minSize is respected when shrinking hard ------------------------------
const m0 = (await windows()).find((x) => x.title === 'Portfolio')
await page.mouse.move(m0.x + m0.w - 2, m0.y + m0.h - 2)
await page.mouse.down()
await page.mouse.move(m0.x + 100, m0.y + 100, { steps: 12 })
await page.mouse.up()
await new Promise((r) => setTimeout(r, 250))
const m1 = (await windows()).find((x) => x.title === 'Portfolio')
console.log(`min clamp: ${m1.w}x${m1.h} (config min 620x420)`, m1.w === 620 && m1.h === 420 ? 'OK' : 'CHECK')

// --- contact is non-resizable: its zoom button must be disabled ------------
const zoomDisabled = await page.evaluate(() => {
    const el = [...document.querySelectorAll('section[aria-label="Contact"] button')]
        .find((b) => b.getAttribute('aria-label')?.startsWith('Zoom'))
    return el ? el.disabled : 'NO BUTTON'
})
console.log('Contact zoom disabled:', zoomDisabled)

await page.screenshot({ path: 'scripts/windows.png' })

// --- traffic lights: minimize then close -----------------------------------
await page.evaluate(() => {
    document.querySelector('section[aria-label="Terminal"] button[aria-label^="Minimize"]').click()
})
await new Promise((r) => setTimeout(r, 300))
console.log('after minimizing Terminal:', (await windows()).map((x) => x.title).join(', '))

;(await dockIcon(3)).click() // reopen terminal from the dock
await new Promise((r) => setTimeout(r, 350))
console.log('after re-clicking Terminal in dock:', (await windows()).map((x) => x.title).join(', '))

await page.evaluate(() => {
    document.querySelector('section[aria-label="Portfolio"] button[aria-label^="Close"]').click()
})
await new Promise((r) => setTimeout(r, 300))
console.log('after closing Portfolio:', (await windows()).map((x) => x.title).join(', '))

console.log(errors.length ? '\nCONSOLE ERRORS:\n' + errors.join('\n') : '\nno console errors')
await browser.close()
