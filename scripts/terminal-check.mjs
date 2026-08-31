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

// open Terminal from the dock (index 3)
const apps = await page.$$('#dock .dock-app button')
await apps[3].click()
await new Promise((r) => setTimeout(r, 600))

const term = 'section[aria-label="Terminal"]'
const screen = () =>
    page.$eval(term, (el) =>
        [...el.querySelectorAll('p')].map((p) => p.textContent).join('\n')
    )
const openTitles = () =>
    page.evaluate(() =>
        [...document.querySelectorAll('section[aria-label]')]
            .filter((el) => el.querySelector('.window-panel'))
            .map((el) => el.getAttribute('aria-label'))
    )

const run = async (cmd) => {
    // focus, not click: by this point other windows overlap the terminal
    await page.focus(`${term} input`)
    await page.type(`${term} input`, cmd)
    await page.keyboard.press('Enter')
    await new Promise((r) => setTimeout(r, 350))
}

const section = async (cmd) => {
    const before = await screen()
    await run(cmd)
    const after = await screen()
    console.log(`\n$ ${cmd}`)
    console.log(after.slice(before.length).trim() || '(no output)')
}

for (const cmd of ['help', 'whoami', 'ls', 'ls projects/', 'bogus']) {
    await section(cmd)
}

console.log('\n--- side effects ---')
await run('open resume')
console.log('after `open resume`   ->', JSON.stringify(await openTitles()))

await run('open algoarena')
console.log('after `open algoarena`->', JSON.stringify(await openTitles()))

await run('contact')
console.log('after `contact`       ->', JSON.stringify(await openTitles()))

await section('open nope')

// history: arrow up should recall the previous command.
// focus, not click — other windows now cover the terminal.
await page.focus(`${term} input`)
await page.keyboard.press('ArrowUp')
await new Promise((r) => setTimeout(r, 150))
console.log('\narrow-up recalls:', JSON.stringify(await page.$eval(`${term} input`, (el) => el.value)))
await page.keyboard.press('ArrowUp')
await new Promise((r) => setTimeout(r, 150))
console.log('arrow-up again:  ', JSON.stringify(await page.$eval(`${term} input`, (el) => el.value)))

// clear must empty the buffer
await page.$eval(`${term} input`, (el) => { el.value = '' })
await run('clear')
const cleared = await screen()
console.log('\nafter `clear`, lines remaining:', cleared.trim().length === 0 ? 'empty OK' : JSON.stringify(cleared))

await page.screenshot({ path: 'scripts/terminal.png' })
console.log(errors.length ? '\nCONSOLE ERRORS:\n' + errors.join('\n') : '\nno console errors')
await browser.close()
