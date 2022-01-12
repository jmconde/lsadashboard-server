const { AircraftStatus, AircraftState } = require('../../helpers/enumsFromDb');
const { query } = require('../mysqlPool');
const { getJSON, setJSON } = require('../redis/redisClient');
const { getAirports } = require('./airportsDB');

const TABLE = 'aircraft';

async function getAircraftList() {
  const airports = await getAirports();
  let aircrafts = await getJSON('all_aircrafts');
  if (!aircrafts) {
    const sql = `SELECT a.id, s.type, s.name fleet, s.hub_id AS hub, a.airport_id as location, a.name, a.registration, a.state, a.status, a.flight_time AS flightTime, a.fuel_onboard AS fuelOnboard
      FROM aircraft AS a 
      INNER JOIN subfleets AS s 
        ON s.id = a.subfleet_id
      ORDER BY s.type ASC;`;

    const result = await query(sql);

    aircrafts = result.map((aircraft) => {
      aircraft.status = AircraftStatus[aircraft.status];
      aircraft.state = AircraftState[aircraft.state];
      aircraft.location = airports[aircraft.location];
      return aircraft;
    });
    await setJSON('all_aircrafts', aircrafts);
  }
  return aircrafts;
}

module.exports = {
  getAircraftList,
}