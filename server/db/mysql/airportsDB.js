const { add } = require('lodash');
const { getAllAirports } = require('../mongo/airportsDB');
const { query } = require('../mysqlPool');
const { getJSON, setJSON } = require('../redis/redisClient');


async function getAirports() {
  const mongoAirports = await getAllAirports();
  let airports = await getJSON('all_airports');
  if (airports) {
    
    const sql = `SELECT a.icao, a.name, a.location, a.country, a.lat, a.lon 
      FROM airports AS a;`;
    
    let result = await query(sql);

    airports = result.reduce((acc, d) => {
      const a = mongoAirports.find(ad => d.icao === ad.icao)
      const airport = {
        id: d.icao,
        lat: d.lat,
        lon: d.lon,
        name: d.name,
        location: d.location,
        country: d.country,
      };
      /*
        type Frequency {
          type: String
          description: String
          frequency_mhz: String
        }
        type Navaid {
          ident: String
          name: String
          type: String
          lat: Float
          lon: Float
          elevation: Float
          frequency_khz: Float
        }
      
      */
      if (a && a.data) {
        airport.elevation = a.data.elevation_ft
      } 

      acc[d.icao] = airport;
      return acc;
    }, {});
    setJSON('all_airports', airports, { minutes: 60 * 48 });
  }
  return airports;
}

async function getAirportsArray() {
  return Object.values(await getAirports() || {});
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
  getAirportsArray,
};