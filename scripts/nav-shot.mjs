import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--window-size=1600,1000', '--hide-scrollbars'],
    defaultViewport: { width: 1600, height: 1000, deviceScaleFactor: 3 },
})

const page = await browser.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 })
await new Promise((r) => setTimeout(r, 4600))
await page.mouse.click(800, 500)
await new Promise((r) => setTimeout(r, 1500))

// Every glass item must cover its host exactly.
const alignment = await page.evaluate(() => {
    const out = []
    for (const host of document.querySelectorAll('nav .group')) {
        const glass = host.querySelector('.glass')
        const a = host.getBoundingClientRect()
        if (!glass) { out.push({ label: host.textContent.trim() || 'icon', glass: 'MISSING' }); continue }
        const b = glass.getBoundingClientRect()
        out.push({
            label: host.textContent.trim() || 'icon',
            dx: +(b.x - a.x).toFixed(2),
            dy: +(b.y - a.y).toFixed(2),
            dw: +(b.width - a.width).toFixed(2),
            dh: +(b.height - a.height).toFixed(2),
        })
    }
    return out
})
console.log('offsets vs host (want all 0):')
for (const r of alignment) console.log(' ', JSON.stringify(r))

// Frame cost with all glass instances mounted, while hovering across the bar.
const fps = await page.evaluate(async () => {
    let frames = 0
    const start = performance.now()
    await new Promise((resolve) => {
        const tick = () => {
            frames++
            if (performance.now() - start < 1500) requestAnimationFrame(tick)
            else resolve()
        }
        requestAnimationFrame(tick)
    })
    return Math.round((frames / (performance.now() - start)) * 1000)
})
console.log('fps while idle:', fps)

const right = await page.$$('nav > div:last-child > .group')
const boxes = []
for (const el of right) boxes.push(await el.boundingBox())

const region = {
    x: Math.max(0, boxes[0].x - 30),
    y: 0,
    width: Math.min(1600 - boxes[0].x + 30, boxes.at(-1).x + boxes.at(-1).width - boxes[0].x + 60),
    height: 60,
}

await page.mouse.move(800, 600)
await new Promise((r) => setTimeout(r, 600))
await page.screenshot({ path: 'scripts/right-rest.png', clip: region })

// hover the search icon (middle of the three)
await page.mouse.move(boxes[1].x + boxes[1].width / 2, boxes[1].y + boxes[1].height / 2)
await new Promise((r) => setTimeout(r, 800))
await page.screenshot({ path: 'scripts/right-hover-icon.png', clip: region })

// hover the clock (last item)
const clock = boxes.at(-1)
await page.mouse.move(clock.x + clock.width / 2, clock.y + clock.height / 2)
await new Promise((r) => setTimeout(r, 800))
await page.screenshot({ path: 'scripts/right-hover-clock.png', clip: region })

console.log(errors.length ? 'CONSOLE ERRORS:\n' + errors.join('\n') : 'no console errors')
await browser.close()
