import moment from "moment";

export async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createTimeStamp() {
    return moment().format('HH:mm:ss')
}
