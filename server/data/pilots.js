const eta = require('eta');
const path = require('path');
const moment = require('moment');
const uniq = require('lodash/uniq')
const { sortPilots } = require('../helpers/timeHelper');
const { getLatests } = require('../db/pilotsDB');
const { decorateLeaderboard } = require('../decorators/pilotsDecorator');

const { getAirport: getAirportService } = require('./airports');
const { insertAirport, getAirport } = require('../db/airportsDB');
const { getLastDailyPositions } = require('../db/dailyPositionsDB');
const { version } = require(path.join(process.cwd(), 'package.json'));

moment.locale('en');

const orderedPilots = async() => {
    console.log(2);
    try {
        const latestsLeaderboards = await getLatests();
        let latest = latestsLeaderboards.latest.leaderboard.sort(sortPilots);
        const prevPositions = await getLastDailyPositions();
        let { lastUpdated } = latestsLeaderboards.latest;
        console.log(3);
        const locations = uniq(latest.map(d => d.location));
        const airports = {};
        for (let index = 0; index < locations.length; index++) {
            const icao = locations[index];
            let airport = await getAirport(icao);

            if (!airport) {
                airport = await getAirportService(icao);
                airports[icao] = airport;
                console.log(airport);
                await insertAirport(icao, JSON.parse(JSON.stringify(airport)));
            } else {
                airports[icao] = airport.data;
            }
        }
        console.log(4);
        const pilots = await decorateLeaderboard(latest, prevPositions, airports);
        console.log(5);
        lastUpdated = moment(lastUpdated).utc().format('dddd MMMM Do YYYY [@] HH:mm:ss');
        console.log(10);
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