const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

let url = 'https://ncov.moh.gov.vn/';

app.get('/', async (req, res) => {
    try{
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url);
        
        let data = await page.evaluate(() => {
            let dataJSON = {};
            dataJSON.vietnam = {};
            dataJSON.global = {};

            dataJSON.vietnam.cases = document.getElementsByClassName('font24')[0].innerText;
            dataJSON.vietnam.deaths = document.getElementsByClassName('font24')[3].innerText;
            dataJSON.vietnam.recovered = document.getElementsByClassName('font24')[2].innerText;

            dataJSON.global.cases = document.getElementsByClassName('font24')[4].innerText.replace('.', '');
            dataJSON.global.deaths = document.getElementsByClassName('font24')[7].innerText.replace('.', '');
            dataJSON.global.recovered = document.getElementsByClassName('font24')[6].innerText.replace('.', '');

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