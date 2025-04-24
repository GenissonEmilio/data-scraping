const puppeteer = require('puppeteer');
const fs = require('fs');

try {
    (async () => {
        const browser = await puppeteer.launch({ headless: false});
        const page = await browser.newPage();
    
        //Acessa a pagina de login da steam
        await page.goto('https://store.steampowered.com/login/');
        console.log('Faça login manualmente e pressione Enter quando estiver pronto.')
        process.stdin.once('data', async () => {
            //Pagina de historico de compras
            await page.goto('https://store.steampowered.com/account/history/');
            await page.waitForSelector('.wht_total', { timeout: 6000 });
    
            //Extrair os valores de gastos
            const totalSpent = await page.evaluate(() => {
                let total = 0;
                const elements = document.querySelectorAll('.wht_total');
            
                if (elements.length === 0) {
                    return 'Erro: Nenhum valor encontrado';
                }
            
                elements.forEach(element => {
                    let value = element.innerText
                        .replace(/[^0-9,.-]/g, '')
                        .replace(',', '.');
            
                    let parsedValue = parseFloat(value);
                    if (!isNaN(parsedValue)) {
                        total += parsedValue;
                    }
                });
            
                return total.toFixed(2);
            });
            
            let dados = {
                valor: `${totalSpent}`
            };
    
            console.log(`Total gasto: R$ ${totalSpent}`)
            fs.writeFileSync('dadosSteam.json', JSON.stringify(dados, null, 2), 'utf-8');
            console.log('Arquivos salvos com sucesso');
    
            await browser.close();
            process.exit();
    
        });
    
    })();
} catch (error) {
    console.log('Erro: ', error);
}
