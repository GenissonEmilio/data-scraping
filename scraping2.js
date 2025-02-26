const puppeteer = require('puppeteer');
//a-offscreen

(async () => {
    const browser = await puppeteer.launch({ headless: false});
    const page = await browser.newPage();

    await page.goto('https://www.amazon.com.br/');
    console.log('Faça login manualmente e pressione Enter quando estiver pronto.');
    process.stdin.once('data', async () => {
        await page.waitForSelector('.a-offscreen', { timeout: 6000 });

        const price = await page.evaluate(() => {
            let total = {};
            const elements = document.querySelectorAll('.a-offscreen');

            if (elements === 0) {
                console.log('Erro!');
            }

            elements.forEach(element => {
                let value = element.innerText.replacereplace(/[^0-9,.-]/g, '')
                .replace(',', '.');

                let parsedValue = parseFloat(value);
                if (!isNaN(parsedValue)) {
                    total = {
                        value: parsedValue
                    }
                }
            });

            return total;

        });

        console.log(price)

        await browser.close();
        process.exit();

    });

})();