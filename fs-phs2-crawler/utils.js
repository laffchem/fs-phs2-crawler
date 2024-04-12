import moment from 'moment';
import nodemailer from 'nodemailer';
import { sender, senderPass } from './crawlerConfig.js';

export async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createTimeStamp() {
    return moment().format('HH:mm:ss');
}

export function calculateRunTime(startTime) {
    const endTime = moment();
    const totalRunTimeMS = endTime.diff(startTime);
    const duration = moment.duration(totalRunTimeMS);

    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();

    const formattedRuntime = `${hours}:${minutes.toString().padStart(2, '0')}`;

    return formattedRuntime;
}

export const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: sender,
        pass: senderPass,
    },
});

export async function mailResults(attachmentName, runTime) {
    try {
        const info = await transporter.sendMail({
            from: '"John Laffey" <john.laffey@flexshopper.com>',
            to: [
                'appsupport@flexshopper.com',
                'jorge.gaitan@flexshopper.com',
                'peter.longchamp@flexshopper.com',
            ], //'john.laffey@flexshopper.com',
            subject: 'Flexshopper Marketplace 404 Sweep',
            text: `Please find the flexshopper marketplace 404 log attached to this email.\nTotal Runtime: ${runTime}.`,
            attachments: [
                {
                    path: attachmentName,
                },
            ],
        });
        console.log('Message sent: %s', info.messageId);
    } catch (err) {
        console.log(err);
    } finally {
        console.log('Closing program...');
        process.exit(); // Should terminate the program...
    }
}
