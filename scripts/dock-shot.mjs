import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--window-size=1600,1000', '--hide-scrollbars'],
    defaultViewport: { width: 1600, height: 1000 },
})

const page = await browser.newPage()
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 })

// boot screen (~3.8s) then click through the lock screen
await new Promise((r) => setTimeout(r, 4600))
await page.mouse.click(800, 500)
await new Promise((r) => setTimeout(r, 1200))

// full desktop
await page.screenshot({ path: 'scripts/desktop.png' })

// close-up of the dock
const dock = await page.$('#dock')
if (dock) {
    const box = await dock.boundingBox()
    await page.screenshot({
        path: 'scripts/dock-closeup.png',
        clip: {
            x: Math.max(0, box.x - 60),
            y: Math.max(0, box.y - 60),
            width: Math.min(1600, box.width + 120),
            height: Math.min(1000 - box.y + 60, box.height + 80),
        },
    })

    // hover an icon to capture magnification + tooltip
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await new Promise((r) => setTimeout(r, 500))
    await page.screenshot({
        path: 'scripts/dock-hover.png',
        clip: {
            x: Math.max(0, box.x - 60),
            y: Math.max(0, box.y - 120),
            width: Math.min(1600, box.width + 120),
            height: Math.min(1000, box.height + 160),
        },
    })
} else {
    console.log('NO #dock FOUND')
}

await browser.close()
console.log('done')
