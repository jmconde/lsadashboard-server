const cron = require('node-cron');
const moment = require('moment');
console.log('=>', moment.locale());
moment.locale('en');
moment.updateLocale('en', {
    week: {
        dow: 1,
        doy: 7
    }
});

const { getLatests, insertLeaderboard } = require('../db/mongo/pilotsDB');
const { inserPilotFlight } = require('../db/mongo/flightsDB');
const { insertDailyPositions } = require('../db/mongo/dailyPositionsDB');
const { getPilotsData } = require('../data/pilotsScraper');
const { sortPilots } = require('../helpers/timeHelper');
const chalk = require('chalk');

const schedule = process.env.TASK_SCHEDULE || '*/30 * * * *';
const doNotInsert = process.env.DO_NOT_INSERT == 1;

const task = async() => {
    console.log(chalk `Executing scraper at {blue ${new Date()}} {green (${schedule})}`);
    try {
        const pilotsData = await getPilotsData();

        const latestsLeaderboards = await getLatests();
        let latest = latestsLeaderboards.latest.leaderboard.sort(sortPilots);

        pilotsData.forEach(async(pilot) => {
            const { userId, seconds, name } = pilot;
            const previousData = latest.find(d => userId == d.userId) || 0;
            const diff = seconds - previousData.seconds;
            if (diff > 0) {
                console.log(chalk `Pilot {yellow ${name}} new flight detected from {red ${previousData.location}} to {green ${pilot.location}}`);
                const flight = {
                    date: new Date(),
                    pilotId: userId,
                    origin: previousData.location,
                    destination: pilot.location,
                    seconds: diff
                };
                if (!doNotInsert) {
                    await inserPilotFlight(flight);
                }
            }
        });

        if (!doNotInsert) {
            await insertLeaderboard(pilotsData);
        }

        if (moment().isAfter(moment().utc().endOf('week').subtract(15, 'minutes'))) {
            const positions = pilotsData.map(d => d.userId);
            if (!doNotInsert) {
                await insertDailyPositions(positions);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

module.exports = function() {
    console.log('process.env.SKIPSCRAPTASK :>> ', process.env.SKIPSCRAPTASK);
    if (process.env.EXECUTE_SCRAP_TASK_ON_START == 1) {
        console.log(chalk `{yellow Executing task on start}`);
        task();
    }

    if (process.env.SKIP_SCRAP_TASK == 1) {
        console.log(chalk `{red scrapper task skipped}`);
        return;
    }

    cron.schedule(schedule, async() => {
        task();
    });
    console.log('Scraper task scheduled to run every 15 minutes')
}