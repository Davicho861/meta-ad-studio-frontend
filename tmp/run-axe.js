const fs = require('fs');
const puppeteer = require('puppeteer-core');
(async ()=>{
  const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium', args:['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage']});
  const page = await browser.newPage();
  await page.goto('http://localhost:5173', {waitUntil: 'networkidle2', timeout: 60000});
  // inject axe from unpkg
  await page.addScriptTag({url: 'https://unpkg.com/axe-core/axe.min.js'});
  const result = await page.evaluate(async () => {
    return await window.axe.run();
  });
  fs.writeFileSync('/work/tests/e2e/axe-local.json', JSON.stringify(result, null, 2));
  console.log('axe run saved to /work/tests/e2e/axe-local.json');
  await browser.close();
})();
