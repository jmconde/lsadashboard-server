const toSeconds = (str) => {
    if (!str) { return -1 }
    let totalSecs = 0;
    if (typeof str !== 'string' || !str.trim()) { return -1 }
    const arr = str.split(' ');
    const getValue = (val) => Number(val.substring(0, val.length - 1));
    arr.forEach(d => {
        d = d.trim();
        if (d.endsWith('h')) {
            totalSecs += getValue(d) * 60 * 60;
        } else if (d.endsWith('m')) {
            totalSecs += getValue(d) * 60;
        } else if (d.endsWith('s')) {
            totalSecs += getValue(d);
        }
    });
    return totalSecs;
};

const leftPadding = (val, y = 2) => {
    return ((10 ** y + val) + '').substring(1);
};

const sencondsToHoursMinutesSeconds = (totalSecs) => {
    const seconds = totalSecs % 60;
    const totalMinutes = (totalSecs - seconds) / 60;
    const minutes = totalMinutes % 60;
    const hours = (totalMinutes - minutes) / 60;

    return { hours, minutes, seconds };
};

const formatHours = (secs) => {
    const { hours, minutes, seconds } = sencondsToHoursMinutesSeconds(secs);
    return `${leftPadding(hours, 3)}h ${leftPadding(minutes)}m`;
}

const formatHoursPerFlight = (secs) => {
    const { hours, minutes, seconds } = sencondsToHoursMinutesSeconds(secs);
    return `${leftPadding(hours, 2)}h ${leftPadding(minutes)}m ${leftPadding(seconds)}`;
}

const sortPilots = (a, b) => b.seconds - a.seconds;

module.exports = {
    toSeconds,
    leftPadding,
    formatHours,
    formatHoursPerFlight,
    sortPilots,
}