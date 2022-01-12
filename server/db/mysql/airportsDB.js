const { add } = require('lodash');
const { query } = require('../mysqlPool');
const { getJSON, setJSON } = require('../redis/redisClient');


const TABLE = 'aircraft';

async function getAirports() {
  let airports = await getJSON('all_airports');
  if (!airports) {
    
    const sql = `SELECT a.icao, a.name, a.location, a.country, a.lat, a.lon 
      FROM airports AS a;`;
    
    let result = await query(sql);

    airports = result.reduce((acc, d) => {
      acc[d.icao] = {
        id: d.icao,
        lat: d.lat,
        lon: d.lon,
        name: d.name,
        location: d.location,
        country: d.country,
      };
      return acc;
    }, {});
    setJSON('all_airports', airports);
  }
  return airports;
}

async function getAirportsFromList(airports) {
  const sql = `SELECT a.icao, a.name, a.location, a.country, a.lat, a.lon 
  FROM airports AS a 
  WHERE icao IN (${airports.map(d => `'${d}'`).join(',')});`;
  let result = await query(sql);

  return result.reduce((acc, d) => {
    acc[d.icao] = {
      id: d.icao,
      lat: d.lat,
      lon: d.lon,
      name: d.name,
      location: d.location,
      country: d.country,
    };
    return acc;
  }, {});
}

module.exports = {
  getAirportsFromList,
  getAirports,
};