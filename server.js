const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

let url = 'https://ncov.moh.gov.vn/';

app.get('/', async (req, res) => {
    try{
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.goto(url);
        
        let data = await page.evaluate(() => {
            let dataJSON = {};
            dataJSON.vietnam = {};
            dataJSON.global = {};

            dataJSON.vietnam.cases = document.getElementById('VN-01').innerText;
            dataJSON.vietnam.deaths = document.getElementById('VN-02').innerText;
            dataJSON.vietnam.recovered = document.getElementById('VN-04').innerText;

            dataJSON.global.cases = document.getElementById('QT-01').innerText.replace('.', '');
            dataJSON.global.deaths = document.getElementById('QT-02').innerText.replace('.', '');
            dataJSON.global.recovered = document.getElementById('QT-04').innerText.replace('.', '');

            return dataJSON;
        });
        
        res.json(data);
    } catch(err) {
        console.log(err);
        res.json(err);
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server running at 3000');
})