const findIndex = require('lodash/findIndex');
const { getLastFlightByPilot } = require('../db/flightsDB');
const { formatHoursPerFlight } = require('../helpers/timeHelper');

const trClasses = (d) => {
    const classes = [];
    if (d.seconds < 15 * 60) classes.push('danger');
    return classes.join(' ');
}

const progressDiff = (d, index, prev) => {
    const classes = ['fa'];
    const prevIndex = prev.positions.indexOf(d.userId);
    const diff = index - prevIndex;

    if (diff < 0) classes.push('fa-caret-up diff-up')
    else if (diff > 0) classes.push('fa-caret-down diff-down')
    else classes.push('fa-caret-right diff-stable')
    return classes.join(' ');
}

const airportLocation = (d, airports) => {
    const airport = airports[d.location];
    return { lat: airport.latitude_deg, lon: airport.longitude_deg };
}

const lastFlight = async(pilot) => {
    const flight = await getLastFlightByPilot(pilot.userId);
    if (flight) {
        const { origin, destination, seconds } = flight;
        const time = formatHoursPerFlight(seconds);
        if (lastFlight) {
            return { origin, destination, time };
        }
    }
}

async function decorateLeaderboard(leaderboard, previous, airports) {
    for (let i = 0; i < leaderboard.length; i++) {
        const d = leaderboard[i];
        const decorators = {
            _trClasses: trClasses(d),
            _diff: progressDiff(d, i, previous),
            _location: airportLocation(d, airports),
            _lastFlight: await lastFlight(d)
        };
        d._decorators = decorators;
    }
    return leaderboard;
}

module.exports = {
    decorateLeaderboard
};