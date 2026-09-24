import { chromium } from 'playwright';

const outDir = 'C:/Users/HASHIM~1.TAT/AppData/Local/Temp/claude/c--Users-hashimoto-tatsuya-trainreservation-app-team2-frontend/c882eccf-f8ac-4141-9998-d12b523d6e6c/scratchpad';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:5173/scheduleSearch', { waitUntil: 'networkidle' });
await page.screenshot({ path: outDir + '/01-search-form.png', fullPage: true });

console.log('---SELECTS---');
const selects = await page.$$eval('select', els => els.map(e => ({name: e.name, id: e.id, options: Array.from(e.options).map(o=>o.value+':'+o.textContent)})));
console.log(JSON.stringify(selects, null, 2));
console.log('---INPUTS---');
const inputs = await page.$$eval('input', els => els.map(e => ({name: e.name, id: e.id, type: e.type, value: e.value})));
console.log(JSON.stringify(inputs, null, 2));
console.log('---BUTTONS---');
const buttons = await page.$$eval('button', els => els.map(e => e.textContent?.trim()));
console.log(JSON.stringify(buttons, null, 2));

await browser.close();
