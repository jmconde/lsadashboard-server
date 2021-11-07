const findIndex = require('lodash/findIndex');

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

function decorateLeaderboard(leaderboard, previous, airports) {

    leaderboard.forEach((d, i) => {
        const decorators = {
            _trClasses: trClasses(d),
            _diff: progressDiff(d, i, previous),
            _location: airportLocation(d, airports)
        };
        d._decorators = decorators;
    });
    return leaderboard;
}

module.exports = {
    decorateLeaderboard
};