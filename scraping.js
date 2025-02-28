const puppeteer = require('puppeteer');
const fs = require('fs');

try {
    (async () => {
        const browser = await puppeteer.launch({ headless: false});
        const page = await browser.newPage();
    
        //Acessa a pagina de login da steam
        await page.goto('https://secure.nuuvem.com/br-pt/account/login?_gl=1*pi1ci0*_gcl_au*MzQ5NzYwMzAyLjE3MzUzODcwMzc.*_ga*OTg1NDYwMDUxLjE3MzUzODcwMzc.*_ga_3BQRZREB88*MTc0MDc4MDk0NC41LjEuMTc0MDc4MDk1My41MS4wLjA.');
        console.log('Faça login manualmente e pressione Enter quando estiver pronto.')
        process.stdin.once('data', async () => {
            //Pagina de historico de compras
            await page.goto('https://secure.nuuvem.com/br-pt/account/orders');
            await page.waitForSelector('.store-orders-item-header-col-subtitle', { timeout: 6000 });
    
            //Extrair os valores de gastos
            const totalSpent = await page.evaluate(() => {
                let total = 0;
                const elements = document.querySelectorAll('.store-orders-item-header-col-subtitle');
            
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
            fs.writeFileSync('dadosNuvem.json', JSON.stringify(dados, null, 2), 'utf-8');
            console.log('Arquivos salvos com sucesso');
    
            await browser.close();
            process.exit();
    
        });
    
    })();
} catch (error) {
    console.log('Erro: ', error);
}
