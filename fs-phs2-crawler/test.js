import { createTimeStamp, mailResults } from './utils.js';
import moment from 'moment';
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
// const file = './logs/404Check-20240409.log';

// mailResults(file);

// This worked.

// Testing runtime calculation.
// const startTime = moment();

// // Set a timeout to emulate the end time after 1 minute (60000 milliseconds)
// const endTime = setTimeout(() => {
//     // Record the end time when the timeout expires
//     const end = moment();
//     const totalRuntimeMS = end.diff(startTime); // Calculate the total runtime in milliseconds
//     const totalRuntimeHours = moment.duration(totalRuntimeMS).asHours(); // Convert to hours
//     console.log(totalRuntimeHours);
// }, 60000);
