import fs from 'fs';

const fetchCurrencies = async () => {
    const res = await fetch('https://restcountries.com/v3.1/all');
    const data = await res.json();
    
    let currencyMap = {};
    for (let c of data) {
        if (c.name?.common && c.currencies) {
            const currs = Object.keys(c.currencies);
            if (currs.length > 0) {
                currencyMap[c.name.common] = currs[0];
            }
        }
    }
    
    // Read current countries.ts
    const content = fs.readFileSync('src/data/countries.ts', 'utf-8');
    const matches = [...content.matchAll(/name: "([^"]+)", flag: "([^"]+)"/g)];
    
    let result = '';
    for (let m of matches) {
        const name = m[1];
        const flag = m[2];
        let cur = currencyMap[name] || '';
        
        // Manual fallbacks
        if (!cur) {
            if (name === 'United States') cur = 'USD';
            else if (name === 'United Kingdom') cur = 'GBP';
            else if (name === 'Russia') cur = 'RUB';
            else if (name === 'South Korea') cur = 'KRW';
            else if (name === 'North Korea') cur = 'KPW';
            else if (name === 'Iran') cur = 'IRR';
            else if (name === 'Syria') cur = 'SYP';
            else if (name === 'Vietnam') cur = 'VND';
            else if (name === 'Czech Republic') cur = 'CZK';
            else if (name === 'Ivory Coast') cur = 'XOF';
            else if (name === 'Macedonia') cur = 'MKD';
            else if (name === 'Congo') cur = 'CDF';
            else if (name === 'Cape Verde') cur = 'CVE';
            else if (name === 'Palestine') cur = 'ILS';
            else if (name === 'Vatican City') cur = 'EUR';
            else if (name === 'Taiwan') cur = 'TWD';
            else if (name === 'Turkey') cur = 'TRY';
            else if (name === 'Venezuela') cur = 'VES';
            else if (name === 'Bolivia') cur = 'BOB';
            else if (name === 'Tanzania') cur = 'TZS';
            else if (name === 'Moldova') cur = 'MDL';
            else if (name === 'Syria') cur = 'SYP';
            else if (name === 'Brunei') cur = 'BND';
            else if (name === 'Bahamas') cur = 'BSD';
            else if (name === 'Gambia') cur = 'GMD';
        }
        
        result += `  { name: "${name}", flag: "${flag}", currency: "${cur}" },\n`;
    }
    
    const finalContent = `export const COUNTRIES = [\n${result}];\n`;
    fs.writeFileSync('src/data/countries.ts', finalContent);
    console.log("Done");
}

fetchCurrencies();
