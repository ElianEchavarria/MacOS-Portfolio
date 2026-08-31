import puppeteer from 'puppeteer-core'

// Usage: node scripts/icon-quality.mjs [dpr] [url]
//   node scripts/icon-quality.mjs 2
//   node scripts/icon-quality.mjs 2 https://your-site.vercel.app
// Local-only diagnostic — it is not part of the build and never deploys.
const dpr = Number(process.argv[2] || 2)
const target = process.argv[3] || 'http://localhost:3000'

const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--window-size=1600,1000', '--hide-scrollbars', '--force-device-scale-factor=' + dpr],
    defaultViewport: { width: 1600, height: 1000, deviceScaleFactor: dpr },
})
const page = await browser.newPage()
await page.goto(target, { waitUntil: 'networkidle0', timeout: 30000 })
await new Promise((r) => setTimeout(r, 4600))
await page.mouse.click(800, 500)
await new Promise((r) => setTimeout(r, 1500))

const report = await page.evaluate(() => {
    const outer = document.querySelector('.dock-glass')
    const cs = getComputedStyle(outer)
    const rect = outer.getBoundingClientRect()
    const imgs = [...document.querySelectorAll('#dock img')].map((el) => {
        const r = el.getBoundingClientRect()
        return {
            src: el.getAttribute('src'),
            natural: `${el.naturalWidth}x${el.naturalHeight}`,
            css: `${r.width.toFixed(1)}x${r.height.toFixed(1)}`,
            // physical pixels the browser must fill on this display
            needed: Math.round(r.width * devicePixelRatio),
            upscale: +(r.width * devicePixelRatio / el.naturalWidth).toFixed(2),
            left: +r.left.toFixed(2),
        }
    })
    return {
        dpr: devicePixelRatio,
        dockTransform: cs.transform,
        dockLeft: +rect.left.toFixed(2),
        dockWidth: +rect.width.toFixed(2),
        imgs,
    }
})

console.log('DPR:', report.dpr)
console.log('dock transform:', report.dockTransform)
console.log('dock left:', report.dockLeft, ' width:', report.dockWidth)
console.log('\nicon                 natural     css        needed  upscale  left')
for (const i of report.imgs) {
    console.log(
        `${i.src.padEnd(20)} ${i.natural.padEnd(11)} ${i.css.padEnd(10)} ${String(i.needed).padEnd(7)} ${String(i.upscale).padEnd(8)} ${i.left}`
    )
}

// zoomed crop of the icon row so the softness is visible
const row = await page.$('#dock img')
const b = await row.boundingBox()
await page.screenshot({
    path: `scripts/icons-dpr${dpr}.png`,
    clip: { x: b.x - 6, y: b.y - 6, width: 380, height: b.height + 12 },
})

await browser.close()
