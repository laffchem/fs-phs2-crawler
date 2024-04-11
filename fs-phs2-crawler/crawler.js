import puppeteer from 'puppeteer';
import moment from 'moment';
import fs from 'fs';
import fetch from 'node-fetch';
import { createTimeStamp, sleep } from './utils.js';

export default class FSCrawler {
	constructor(site, logFile, errorLog) {
		this.site = site;
		this.logFile = logFile;
		this.errorLog = errorLog;
		this.p = puppeteer;
		this.moment = moment;
		this.visitedCategories = new Set();
		this.delay = 50;
		this.browser = null;
	}

	async launchBrowser() {
		this.browser = await this.p.launch();
	}

	async constructUserAgent() {
		if (this.browser) {
			const defaultUserAgent = await this.browser.defaultUserAgent();
			const customUserAgent = `${defaultUserAgent} fs-phs2-crawler`;
			console.log(customUserAgent);
			return customUserAgent;
		}
	}

	// This was a testing method.
	async pageToLookForRfk() {
		await this.launchBrowser();
		const page = await this.browser.newPage();
		await page.setUserAgent(
			`${this.browser.defaultUserAgent()} fs-phs2-crawler`
		);
		await page.setUserAgent(userAgent);
		await page.goto(
			'https://www.flexshopper.com/category/computers-tablets?rfk=1&mega_menu=1'
		);
		return page;
	}

	async quit() {
		if (this.browser) {
			await this.browser.close();
		}
	}

	async scrapeCategories() {
		try {
			await this.launchBrowser();

			const page = await this.browser.newPage();
			const userAgent = await page.setUserAgent(
				`${this.browser.userAgent()} fs-phs2-crawler`
			);
			console.log(userAgent);
			page.setDefaultNavigationTimeout(120000); // This is mainly due to the samsung page.
			await page.goto(this.site);
			await this._scrapeCategoryFromRoot(page);
		} catch (err) {
			console.error('Error:', err);
			const logStream = fs.createWriteStream(this.errorLog);
			logStream.write(`${moment().format('YYYYMMDD_HHmm')}: ${err}\n`);
			logStream.close();
		} finally {
			await this.quit();
		}
	}

	async scrapeProducts() {
		try {
			await this.launchBrowser();
			const page = await this.browser.newPage();
			const userAgent = await page.setUserAgent(
				`${this.browser.userAgent()} fs-phs2-crawler`
			);
			console.log(userAgent);
			page.setDefaultNavigationTimeout(120000); // This is due to the samsung page.
			await page.goto(this.site);

			let scrapeComplete = false;
			while (!scrapeComplete) {
				await this._scrapeProducts(page);
				// Check if rfkNext is present
				const rfkNextFound = await this._checkAndClickForRfkNext(page);
				if (rfkNextFound) {
					// If rfkNext is found, continue scraping
					console.log('rfkNext found. Continuing scraping.');
				} else {
					// If rfkNext is not found, stop scraping
					console.log('rfkNext not found. Stopping scraping.');
					scrapeComplete = true;
				}
			}
		} catch (err) {
			console.error('Error:', err);
			const logStream = fs.createWriteStream(this.errorLog);
			logStream.write(`${moment().format('YYYYMMDD_HHmm')}: ${err}\n`);
			logStream.close();
		} finally {
			await this.quit();
		}
	}

	async _scrapeCategoryFromRoot(page) {
		try {
			const extractedData = await this._extractData(page);
			const uniqueLinks = await this._uniqueCategories(extractedData);
			const logStream = fs.createWriteStream(this.logFile, {
				flags: 'a',
			});

			for (const item of uniqueLinks) {
				console.log('Navigating to:', item.url);

				// Fetch the URL and handle the response
				await fetch(item.url)
					.then(async (response) => {
						if (response) {
							console.log('Response code:', response.status);
							item.responseCode = response.status;

							if (response.status >= 400 && response.status < 600) {
								logStream.write(
									`${createTimeStamp()}, URL: ${item.url}, Response code: ${
										response.status
									}\n`
								);
							}
						} else {
							console.error('Response object is null. Page navigation failed.');
						}
					})
					.catch((err) => {
						console.error(err);
					});

				// Wait for 1 second before making the next request
				await sleep(this.delay); // ADJUST THIS TO CHANGE # OF REQUESTS.
			}
			logStream.end();
			console.log(
				`Scraping of ${this.page} completed successfully. Data written to ${this.logFile}`
			);
		} catch (err) {
			console.log(err);
		}
	}

	async _scrapeProducts(page) {
		try {
			const extractedData = await this._extractData(page);
			const uniqueLinks = await this._uniqueProducts(extractedData);

			const logStream = fs.createWriteStream(this.logFile, {
				flags: 'a',
			});

			for (const item of uniqueLinks) {
				console.log('Navigating to:', item.url);

				// Fetch the URL and handle the response
				await fetch(item.url)
					.then(async (response) => {
						if (response) {
							console.log('Response code:', response.status);
							item.responseCode = response.status;

							if (response.status >= 400 && response.status < 600) {
								logStream.write(
									`${createTimeStamp()}, URL: ${item.url}, Response code: ${
										response.status
									}\n`
								);
							}
						} else {
							console.error('Response object is null. Page navigation failed.');
						}
					})
					.catch((err) => {
						console.error(err);
					});

				// Wait for 1 second before making the next request
				await sleep(this.delay); // ADJUST THIS TO CHANGE # of REQUESTS
			}

			logStream.end();
			console.log(
				`Scraping of ${this.page} completed successfully. Data written to ${this.logFile}`
			);
		} catch (err) {
			console.log(err);
		}
	}

	async _extractData(page) {
		try {
			const extractedData = await page.$$eval('a', (anchors) => {
				console.log('Extracting data...');
				return anchors.map((anchor) => ({
					url: anchor.href,
					responseCode: null,
				}));
			});
			console.log('Extracted data:', extractedData);
			console.log(`Extracted data length: ${extractedData.length}`);
			return extractedData || [];
		} catch (error) {
			console.error('Error extracting data:', error);
			return [];
		}
	}
	async _checkAndClickForRfkNext(page) {
		try {
			const rfkNext = await page.$(
				'div.rfk_next',
				(rfkNextButton) => rfkNextButton
			);
			if (rfkNext) {
				await rfkNext.click();
				console.log('Next button.');
				return true;
			}
		} catch (err) {
			console.error('Error with rfknext:', err);
			return false;
		}
	}

	async _uniqueProducts(extractedData) {
		const uniqueLinks = Array.from(
			new Set(extractedData.map((item) => item.url))
		).map((url) => ({
			url,
			responseCode: null,
		}));
		return uniqueLinks.filter((link) => link.url.includes('/product/'));
	}

	async _uniqueCategories(extractedData) {
		const uniqueLinks = Array.from(
			new Set(extractedData.map((item) => item.url))
		).map((url) => ({
			url,
			responseCode: null,
		}));
		return uniqueLinks.filter((link) => link.url.includes('/category'));
	}
}
