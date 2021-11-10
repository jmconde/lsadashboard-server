const cheerio = require('cheerio');
const axios = require('axios');
const url = 'https://crew.latinstreamingalliance.com/pilots';
const { toSeconds, formatHours, formatHoursPerFlight, sortPilots } = require('../helpers/timeHelper');

async function getPilotsData() {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const $userRows = $('#users-table tbody tr');
    const users = [];

    $userRows.each((i, row) => {
        const $row = $(row);
        const hours = $row.find('td').eq(6).text();
        const seconds = toSeconds(hours);
        const flights = Number($row.find('td').eq(5).text());
        const secondsPerFlight = Math.round((seconds / flights));
        const user = {
            userId: $row.find('td').eq(1).find('a').attr('href').split('/').pop(),
            image: $row.find('td').eq(0).find('img').attr('src'),
            name: $row.find('td').eq(1).find('a').text().trim(),
            country: $row.find('td').eq(2).find('span').attr('title'),
            location: $row.find('td').eq(4).text().trim(),
            flights: flights === 0 ? '-' : flights,
            hours: seconds === 0 ? '-' : formatHours(seconds),
            seconds,
            minutesPerFlight: Number.isNaN(secondsPerFlight) ? '-' : formatHoursPerFlight(secondsPerFlight),
        };
        users.push(user);
    });

    return users.sort(sortPilots);
}

module.exports = { getPilotsData };