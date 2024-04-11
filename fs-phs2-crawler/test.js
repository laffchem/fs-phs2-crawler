import { createTimeStamp, mailResults } from './utils.js';
// import FSCrawler from './crawler.js';
// import moment from 'moment';

// const rootSite = 'https://www.flexshopper.com';
/* --> Note, uncommenting this will check for the rfk next button.
const logFile = `./logs/404Check-${moment().format('YYYYMMDD_HHmm')}.log`;
const errorLog = `./errors/error-log-${moment().format('YYYYMMDD_HHmm')}.log`;

async function findrfkNext() {
    const scraper = new FSCrawler(rootSite, logFile, errorLog);
    await scraper.pageToLookForRfk();
    await scraper._checkAndClickForRfkNext();
}
findrfkNext();

console.log(`${createTimeStamp()}`);
*/

// Email Test
const file = './logs/404Check-20240409.log';

mailResults(file);

// This worked.
