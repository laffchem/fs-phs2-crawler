import { createTimeStamp, mailResults } from './utils.js';
import moment from 'moment';
import { calculateRunTime } from './utils.js';
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

// const startTime = moment('2022-01-01T12:00:00Z');
// const endTime = moment('2022-01-02T01:17:00Z');
// function calculateRunTimeTest(startTime, endTime) {
//     const totalRunTimeMS = endTime.diff(startTime);
//     const duration = moment.duration(totalRunTimeMS);

//     const hours = Math.floor(duration.asHours());
//     const minutes = duration.minutes();

//     const formattedRuntime = `${hours}:${minutes.toString().padStart(2, '0')}`;
//     console.log(formattedRuntime);
//     return formattedRuntime;
// }

// calculateRunTimeTest(startTime, endTime);
