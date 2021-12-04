const eta = require('eta');
const path = require('path');
const moment = require('moment');
const uniq = require('lodash/uniq');
const concat = require('lodash/concat');
const { sortPilots } = require('../helpers/timeHelper');
const { getLatests } = require('../db/mongo/pilotsDB');
const { insertAirport, getAirport } = require('../db/mongo/airportsDB');
const { getLastDailyPositions } = require('../db/mongo/dailyPositionsDB');
const { getAirport: getAirportService } = require('./airports');
const { decorateLeaderboard } = require('../decorators/pilotsDecorator');
const { version } = require(path.join(process.cwd(), 'package.json'));

moment.locale('en');

const orderedPilots = async() => {
    try {
        const latestsLeaderboards = await getLatests();
        let latest = latestsLeaderboards.latest.leaderboard.sort(sortPilots);
        let previous = latestsLeaderboards.previous.leaderboard.sort(sortPilots);
        const prevPositions = await getLastDailyPositions();
        let { lastUpdated } = latestsLeaderboards.latest;
        const locations = uniq(concat(latest.map(d => d.location), previous.map(d => d.location)));
        const airports = {};
        for (let index = 0; index < locations.length; index++) {
            const icao = locations[index];
            
            if (/[A-Z]{4}/.test(icao)){
                let airport;
                try {
                    airport = await getAirport(icao);
                } catch (err) {
                    continue;
                }

                if (!airport) {
                    try {
                        airport = await getAirportService(icao);
                    } catch (err) {
                        console.log('failed airport api', icao);
                        continue;
                    }
                    airports[icao] = airport;
                    await insertAirport(icao, JSON.parse(JSON.stringify(airport)));
                } else {
                    airports[icao] = airport.data;
                }
            }
        }
        const pilots = await decorateLeaderboard(latest, prevPositions, airports);
        lastUpdated = moment(lastUpdated).utc().format('dddd MMMM Do YYYY [@] HH:mm:ss');
        return {
            pilots,
            lastUpdated,
            // lastUpdated: `METAR UPDATED ${moment(lastUpdated).utc().format('DDHHmm[Z]')}`,
            version
        };
        // return eta.renderFileAsync(path.join(process.cwd(), 'server', 'templates', 'pilots.eta'), {
        //     users,
        //     lastUpdated,
        //     // lastUpdated: `METAR UPDATED ${moment(lastUpdated).utc().format('DDHHmm[Z]')}`,
        //     version
        // });
    } catch (err) {
        console.error(err);
    }
}

module.exports = orderedPilots;