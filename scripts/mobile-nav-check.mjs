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

const sel = 'section[aria-label="Portfolio"]'
const navTitle = () => page.$eval(`${sel} header span`, (e) => e.textContent)
const tiles = () => page.$$eval(`${sel} ul li button`, (els) =>
    els.map((e) => e.textContent.trim()))
const openTitles = () => page.evaluate(() =>
    [...document.querySelectorAll('section[aria-label]')]
        .filter((el) => el.querySelector('.window-panel'))
        .map((el) => el.getAttribute('aria-label')))
const back = async () => {
    await page.click(`${sel} header button`)
    await new Promise((r) => setTimeout(r, 400))
}
const tapTile = async (i) => {
    const b = await page.$$eval(`${sel} ul li button`, (els, idx) => {
        const r = els[idx].getBoundingClientRect()
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    }, i)
    await page.mouse.click(b.x, b.y)
    await new Promise((r) => setTimeout(r, 400))
}

const dock = await page.$$('div.rounded-\\[28px\\] button')
await dock[0].click()
await new Promise((r) => setTimeout(r, 700))

console.log('back button label:', await page.$eval(`${sel} header button`, (e) => e.textContent.trim()))
console.log('root title:', await navTitle())
console.log('root tiles:', JSON.stringify(await tiles()))
console.log('traffic lights hidden:', (await page.$$(`${sel} header button`)).length === 1)

await tapTile(0)
console.log('\nafter tapping Work -> title:', await navTitle())
console.log('  tiles:', JSON.stringify(await tiles()))

await back()
console.log('after Go Back -> title:', await navTitle())
console.log('  tiles:', JSON.stringify(await tiles()))

await tapTile(2)
console.log('\nafter tapping Resume -> title:', await navTitle())
await tapTile(0)
console.log('tapping Resume.pdf opens:', JSON.stringify(await openTitles()))

await page.screenshot({ path: 'scripts/mobile-nav.png' })

await back()
await back()
console.log('\nGo Back at root closes app:', JSON.stringify(await openTitles()))

console.log(errors.length ? '\nERRORS:\n' + errors.join('\n') : '\nno console errors')
await browser.close()
