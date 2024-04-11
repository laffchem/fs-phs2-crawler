import FSCrawler from './crawler.js';
import { brands, categories } from './sites.js';
import pLimit from 'p-limit';
import moment from 'moment';
import { mailResults, calculateRunTime } from './utils.js';
const fileNames = [];
const sites = [];
const limit = pLimit(1);
const rootSite = 'https://www.flexshopper.com';
let scraper;

// Create the lists of sites to check.
Object.keys(brands).forEach((brand) => {
    fileNames.push(brand);
    sites.push(brands[brand]);
});

Object.keys(categories).forEach((category) => {
    fileNames.push(category);
    sites.push(categories[category]);
});

// console.log(sites.length, fileNames.length);

// Create both log & error files.
const logFile = `./logs/404Check-${moment().format('YYYYMMDD')}.log`;
const errorLog = `./errors/error-log-${moment().format('YYYYMMDD')}.log`;

// Record start time
const startTime = moment();

// Logic of scraping is contained in the class
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

(async () => {
    console.log('Begin scraping flexshopper.com');
    await scrapeCategories();
    console.log('Process: ', process.pid);
    console.log('Begin scraping products from brands & categories');
    await scrapeAllProducts();
    console.log('Process: ', process.pid);
    console.log('Scraping processes completed.');
    // Record End Time & Convert it
    const runTime = calculateRunTime(startTime);
    console.log('Closing browser instances...');
    if (scraper) {
        scraper.quit();
    }
    console.log('Mailing results...');
    mailResults(logFile, runTime);
})();
