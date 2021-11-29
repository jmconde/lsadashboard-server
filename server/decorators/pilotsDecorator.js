const { formatHours } = require('../helpers/timeHelper');
const moment = require('moment');
const { mapRank } = require('../helpers/pilotHelper');
const { getLastFlightByPilot } = require('../db/mongo/flightsDB');
const { getAirport } = require('../db/mongo/airportsDB');
const haversine = require('haversine-distance');

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

    
    return diff
}

const airportLocation = async (icao, airports) => {
    try {
        console.log('airportLocation', icao);
        let airport = airports[icao];
        console.log('-> airport', airport && airport.ident);
        if (!airport){
            airport = (await getAirport(icao))?.data;
        }
        console.log('<- airport', airport.ident);
        // if (icao === 'LOWI')
        //     console.log(airport);
        return { lat: airport.latitude_deg, lon: airport.longitude_deg };
    } catch(err) {
        console.log(err);
    }
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
    console.log('decorete');
    try {
        for (let i = 0; i < leaderboard.length; i++) {
            const d = leaderboard[i];
            const lastFl = await lastFlight(d);
            const originLocation = lastFl ? await airportLocation(lastFl.origin, airports) : undefined;
            const destLocation = await airportLocation(d.location, airports);
            const distanceInMeters = lastFl && haversine(originLocation, destLocation);
            const distance = Math.round(distanceInMeters / 1852);
            const decorators = {
                _trClasses: trClasses(d),
                _diff: progressDiff(d, i, previous),
                _location: destLocation,
                _previousLocation: originLocation,
                _lastFlight: lastFl,
                _rankImageCode: rankImageCode(d),
                _distance: Number.isNaN(distance) ? 0 : distance
            };
            d._decorators = decorators;
        }
        return leaderboard;
    } catch(err) {
        console.log(err);
    }
}

module.exports = {
    decorateLeaderboard
};