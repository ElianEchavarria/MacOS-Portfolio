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

// boot screen (~3.8s) then click through the lock screen
await new Promise((r) => setTimeout(r, 4600))
await page.mouse.click(800, 500)
await new Promise((r) => setTimeout(r, 1500))

await page.screenshot({ path: 'scripts/desktop.png' })

const glass = await page.$('.dock-glass')
if (!glass) {
    console.log('NO .dock-glass FOUND')
} else {
    const box = await glass.boundingBox()
    console.log('dock box:', JSON.stringify(box))

    const clip = (padX, padTop, padBottom) => ({
        x: Math.max(0, box.x - padX),
        y: Math.max(0, box.y - padTop),
        width: Math.min(1600 - Math.max(0, box.x - padX), box.width + padX * 2),
        height: Math.min(1000 - Math.max(0, box.y - padTop), box.height + padTop + padBottom),
    })

    await page.screenshot({ path: 'scripts/dock-closeup.png', clip: clip(70, 30, 30) })

    // hover an icon: magnification + tooltip + elastic warp
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await new Promise((r) => setTimeout(r, 600))
    await page.screenshot({ path: 'scripts/dock-hover.png', clip: clip(70, 95, 30) })
}

console.log(errors.length ? 'CONSOLE ERRORS:\n' + errors.join('\n') : 'no console errors')
await browser.close()
