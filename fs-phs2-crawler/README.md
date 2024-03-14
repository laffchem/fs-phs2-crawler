# fs-phs2-crawler

To run, first install the node modules.

`npm i`
Then to start the script enter the following.

`npm run scrape`

This will run 27 different crawler objects 1 at a time to avoid memory issues.
It will first scrape and test all the category links from flexshopper.com.
Then it will scrape each brand and mega category page for links and test them. If there are any issues, it is reported inside the logs folder with a timestamped log.

### Future update

_When this is ready for production and auto running, nodemailer will be used to mail the logFile as a notification._
