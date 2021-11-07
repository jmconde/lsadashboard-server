const cron = require('node-cron');
const _isEqual = require('lodash/isEqual');
const moment = require('moment');

const { getLatests, insertLeaderboard } = require('../db/pilotsDB');
const { getPilotsData } = require('../data/pilotsScraper');
const { sortPilots } = require('../helpers/timeHelper');

module.exports = function() {
    cron.schedule('*/15 * * * *', async() => {
        console.log('Executing scraper at ', new Date());
        try {
            const pilotsData = await getPilotsData();
            const latestsLeaderboards = await getLatests();
            let latest = latestsLeaderboards.latest.leaderboard.sort(sortPilots);
            let prev = latestsLeaderboards.previous.leaderboard.sort(sortPilots);

            if (!_isEqual(latest, pilotsData)) {
                console.log('Not equals');
                insertLeaderboard(pilotsData);
                prev = latest;
                latest = pilotsData
                lastUpdated = new Date().getTime();
            }

            if (moment().isAfter(moment().utc().endOf('day').subtract(30, 'minutes'))) {
                const positions = pilotsData.map(d => d.userId);
                await insertDailyPositions(positions);
            }
        } catch (err) {
            console.error(err);
        }
    });
    console.log('Scraper task scheduled to run every 15 minutes')
}