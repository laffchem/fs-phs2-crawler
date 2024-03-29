import FSCrawler from './crawler.js';
import { brands, categories } from './sites.js';
import pLimit from 'p-limit';
import moment from 'moment';
const fileNames = [];
const sites = [];
const limit = pLimit(1);
const rootSite = 'https://www.flexshopper.com';

Object.keys(brands).forEach((brand) => {
    fileNames.push(brand);
    sites.push(brands[brand]);
});

Object.keys(categories).forEach((category) => {
    fileNames.push(category);
    sites.push(categories[category]);
});

console.log(sites.length, fileNames.length);

const logFile = `./logs/404Check-${moment().format('YYYYMMDD')}.log`;
const errorLog = `./errors/error-log-${moment().format('YYYYMMDD')}.log`;

async function scrapeCategories() {
    console.log(`Scraping data from ${rootSite}`);
    const scraper = new FSCrawler(rootSite, logFile, errorLog);
    await scraper.scrapeCategories();
}

async function scrapeAllProducts() {
    console.log('Scraping product data...');
    await Promise.all(
        sites.map((site) =>
            limit(() => {
                console.log(`Scraping data from ${site}`);
                const scraper = new FSCrawler(site, logFile, errorLog);
                return scraper.scrapeProducts();
            })
        )
    );
    console.log('All products scraped successfully.');
}

let scraper;

(async () => {
    console.log('Begin scraping flexshopper.com');
    await scrapeCategories();
    console.log('Begin scraping products from brands & categories');
    await scrapeAllProducts();
    console.log('Scraping processes completed.');
})()
    .catch((err) => console.error('Error scraping data:', err))
    .finally(() => {
        console.log('Closing browser instances...');
        if (scraper) {
            scraper.quit();
        }
    });
