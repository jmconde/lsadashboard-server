const cheerio = require('cheerio');
const axios = require('axios');
const eta = require('eta');
const path = require('path');

const url = 'https://crew.latinstreamingalliance.com/pilots';

const toMinutes = (str) => {
    if (!str) { return -1 }
    let totalMins = 0;
    if (typeof str !== 'string' || !str.trim()) { return -1 }
    const arr = str.split(' ');
    const getValue = (val) => Number(val.substring(0, val.length - 1));
    arr.forEach(d => {
        d = d.trim();
        if (d.endsWith('h')) {
            totalMins += getValue(d) * 60;
        } else if (d.endsWith('m')) {
            totalMins += getValue(d);
        }
    });
    return totalMins;
};

const sortPilots = (a, b) => b.minutes - a.minutes;

const orderedPilots = async () => {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const $userRows = $('#users-table tbody tr');
    const users = [];
    $userRows.each((i, row) => {
        const $row = $(row);
        const hours = $row.find('td').eq(6).text();
        const minutes = toMinutes(hours);
        const flights = Number($row.find('td').eq(5).text());
        const minutesPerFlight = (minutes / flights);

        const user = {
            image: $row.find('td').eq(0).find('img').attr('src'),
            name: $row.find('td').eq(1).find('a').text().trim(),
            country:$row.find('td').eq(2).find('span').attr('title'),
            location: $row.find('td').eq(4).text(),
            flights,
            hours,
            minutes,
            minutesPerFlight: Number.isNaN(minutesPerFlight) ? '-' : minutesPerFlight.toFixed(2),
            class: minutes < 15 ? 'danger' : ''
         };
        // $row.children[0].find('img')
        users.push(user);
    });

    return eta.renderFileAsync(path.join(process.cwd(), 'server', 'pilots.eta') , { users: users.sort(sortPilots) });
}

module.exports = orderedPilots;