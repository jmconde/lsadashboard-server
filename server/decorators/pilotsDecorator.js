const { getLastFlightByPilot } = require('../db/flightsDB');
const { formatHours } = require('../helpers/timeHelper');
const moment = require('moment');
const { mapRank } = require('../helpers/pilotHelper');
const { getAirport } = require('../data/airports');

const trClasses = (d) => {
    const classes = [];
    if (d.seconds < 15 * 60) classes.push('danger');
    return classes.join(' ');
}

const progressDiff = (d, index, prev) => {
    if (d.seconds === 0) return;

    const classes = ['fa'];
    let prevIndex = prev.positions.indexOf(d.userId);
    if (prevIndex < 0 ) {
        prevIndex = prev.positions.length;
    }
    const diff = index - prevIndex;

    
    if (diff < 0) classes.push('fa-caret-up diff-up')
    else if (diff > 0) classes.push('fa-caret-down diff-down')
    else classes.push('fa-caret-right diff-stable')
    return classes.join(' ');
}

const airportLocation = async (location, airports) => {
    let airport = airports[location];
    if (!airport){
        airport = await getAirport(location);
    }
    return { lat: airport.latitude_deg, lon: airport.longitude_deg };
}

const lastFlight = async(pilot) => {
    const flight = await getLastFlightByPilot(pilot.userId);
    if (flight) {
        const { origin, destination, seconds, date } = flight;
        const time = formatHours(seconds, 2);
        const fromNow = moment(date).fromNow();
        if (lastFlight) {
            return { origin, destination, time, fromNow };
        }
    }
}

const rankImageCode = (pilot) => {
    return mapRank(pilot.seconds);
}

async function decorateLeaderboard(leaderboard, previous, airports) {
    for (let i = 0; i < leaderboard.length; i++) {
        const d = leaderboard[i];
        const lastFl = await lastFlight(d);
        const decorators = {
            _trClasses: trClasses(d),
            _diff: progressDiff(d, i, previous),
            _location: await airportLocation(d.location, airports),
            _previousLocation: lastFl ? await airportLocation(lastFl.origin, airports) : undefined,
            _lastFlight: lastFl,
            _rankImageCode: rankImageCode(d)
        };
        d._decorators = decorators;
    }
    return leaderboard;
}

module.exports = {
    decorateLeaderboard
};