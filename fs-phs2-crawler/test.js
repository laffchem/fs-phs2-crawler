import {createTimeStamp} from './utils.js';
import Pinocchio from "./pinocchio.js";
import moment from 'moment';

const rootSite = 'https://www.flexshopper.com'

const logFile = `./logs/404Check-${moment().format('YYYYMMDD_HHmm')}.log`
const errorLog = `./errors/error-log-${moment().format('YYYYMMDD_HHmm')}.log`

async function findrfkNext(){
    const scraper = new Pinocchio(rootSite, logFile, errorLog);
    await scraper.pageToLookForRfk();
    await scraper._checkAndClickForRfkNext();

}
findrfkNext();


console.log(`${createTimeStamp()}`)