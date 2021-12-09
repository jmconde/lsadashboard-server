const { add } = require('lodash');
const { AircraftStatus, AircraftState } = require('../../helpers/enumsFromDb');
const { query } = require('../mysqlPool');

const TABLE = 'aircraft';

async function getAircraftList() {
  const sql = `SELECT a.id, s.type, s.name fleet, s.hub_id AS hub, a.airport_id as location, a.name, a.registration, a.state, a.status, a.flight_time AS flightTime, a.fuel_onboard AS fuelOnboard
    FROM aircraft AS a 
    INNER JOIN subfleets AS s 
      ON s.id = a.subfleet_id;`;

  const result = await query(sql);

  return result.map((aircraft) => {
    aircraft.status = AircraftStatus[aircraft.status];
    aircraft.state = AircraftState[aircraft.state];
    return aircraft;
  });;
}

module.exports = {
  getAircraftList,
}