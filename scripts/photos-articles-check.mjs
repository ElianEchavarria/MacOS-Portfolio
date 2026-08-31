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

const apps = await page.$$('#dock .dock-app button')

await apps[2].click()
await new Promise((r) => setTimeout(r, 800))
const g = 'section[aria-label="Gallery"]'

console.log('photos sidebar:', JSON.stringify(
    await page.$$eval(`${g} aside button`, (els) => els.map((e) => e.textContent.trim()))))
console.log('library tiles:', (await page.$$(`${g} ul.grid li`)).length)
console.log('all images loaded:', await page.$$eval(`${g} ul.grid img`,
    (els) => els.every((el) => el.complete && el.naturalWidth > 0)))
console.log('wide tile spans 2:', await page.$$eval(`${g} ul.grid li`,
    (els) => els[0].className.includes('col-span-2')))

const clickSide = async (i) => {
    const b = await page.$$eval(`${g} aside button`, (els, idx) => {
        const r = els[idx].getBoundingClientRect()
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
    }, i)
    await page.mouse.click(b.x, b.y)
    await new Promise((r) => setTimeout(r, 350))
}

await clickSide(4)
console.log('favorites tiles:', (await page.$$(`${g} ul.grid li`)).length, '(1 photo marked favorite)')
await clickSide(1)
console.log('memories:', JSON.stringify(await page.$$eval(`${g} p`,
    (els) => els.map((e) => e.textContent).filter((t) => /No |Drop /.test(t)))),
    'grid present:', (await page.$(`${g} ul.grid`)) !== null)
await clickSide(0)

await (await page.$(g)).screenshot({ path: 'scripts/photos.png' })

await apps[1].click()
await new Promise((r) => setTimeout(r, 800))
const a = 'section[aria-label="Articles"]'
console.log('\nblog heading:', await page.$eval(`${a} h2`, (e) => e.textContent))
console.log('toolbar buttons:', (await page.$$(`${a} span[aria-label]`)).length)
console.log('url bar text:', await page.$eval(`${a} span.truncate`, (e) => e.textContent))
console.log('post title:', await page.$eval(`${a} h3`, (e) => e.textContent))
console.log('post link:', await page.$eval(`${a} a`, (e) => e.getAttribute('href')))
console.log('thumbnail loaded:', await page.$eval(`${a} li img`,
    (el) => el.complete && el.naturalWidth > 0))

await (await page.$(a)).screenshot({ path: 'scripts/articles.png' })
console.log(errors.length ? '\nERRORS:\n' + errors.join('\n') : '\nno console errors')
await browser.close()
