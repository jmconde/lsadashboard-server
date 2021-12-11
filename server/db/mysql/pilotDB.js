const { UserState } = require('../../helpers/enums');
const { UserState: UserStateFromDB, PirepState, PirepStatus } = require('../../helpers/enumsFromDb');
const { splitUserName, getPilotId } = require('../../helpers/pilotHelper');
const { query } = require('../mysqlPool');

const SQL = `SELECT
u.id, u.pilot_id AS pilotId, u.name, r.id AS rankId, r.name AS rankName,
  u.country, u.home_airport_id AS home, u.curr_airport_id AS location, u.flights,
  u.flight_time AS flightTime, u.status, u.state, u.created_at AS joined
FROM users AS u
INNER JOIN ranks AS r ON r.id = u.rank_id`;


const ORDER_BY_FLIGHTS = 'flights';
const ORDER_BY_FLIGHT_TIME = 'flightTime';
const MAP = {
  [ORDER_BY_FLIGHTS]: 'u.flights',
  [ORDER_BY_FLIGHT_TIME]: 'u.flight_time',
};

const ACTIVE_WHERE = ` WHERE u.state = ${UserState.ACTIVE}`;

async function getIvaoPilots() {
  const sql = `SELECT u.id, u.pilot_id AS pilotId, u.name, r.id AS rankId, r.name AS rankName,
  u.country, u.home_airport_id AS home, u.curr_airport_id AS location, u.flights,
  u.flight_time AS flightTime, u.status, u.state, u.created_at AS joined, ufv.value as vid
    FROM users AS u
    INNER JOIN user_field_values AS ufv
      ON u.id = ufv.user_id 
    INNER JOIN ranks AS r ON r.id = u.rank_id  
    WHERE ufv.user_field_id = 1`
    ;

  const result = await query(sql);
  return result;
};

async function getActivePilotList() {
  let sql = SQL + ACTIVE_WHERE + ` ORDER BY ${MAP[ORDER_BY_FLIGHT_TIME]} DESC`
  const lastFlights = await getPilotsLastFlight();
  let result = await query(sql);
  
  result = result.map((user) => {
    user.name = splitUserName(user.name);
    user.state = UserStateFromDB[user.state];
    user.pilotId = getPilotId(user.pilotId, 'LTS');
    user.lastFlight = lastFlights.find(f => user.id === f.pilotId);
    return user;
  });
  // console.log(result);
  return result
}

async function getPilotList() {
  let sql = SQL + ` ORDER BY ${MAP[ORDER_BY_FLIGHT_TIME]} DESC`;
  const lastFlights = await getPilotsLastFlight();
  let result = await query(sql);
  
  result = result.map((user) => {
    user.name = splitUserName(user.name);
    user.state = UserStateFromDB[user.state];
    user.pilotId = getPilotId(user.pilotId, 'LTS');
    user.lastFlight = lastFlights.find(f => user.id === f.pilotId);
    return user;
  });
  // console.log(result);
  return result
}

async function getPilotsLastFlight() {
  const sql = `SELECT u.id, p.state, p.dpt_airport_id, p.arr_airport_id, p.distance, p.flight_time, p.created_at, p.state, p.landing_rate
  FROM users as u inner join pireps as p on u.last_pirep_id = p.id;`
  const result = await query(sql);
  return result.map((d) => {
    return {
      pilotId: d.id,
      departure: d.dpt_airport_id,
      arrival: d.arr_airport_id,
      time: d.flight_time,
      distance: d.distance,
      date: d.created_at,
      landingRate: d.landing_rate,
      state: PirepState[d.state],
      status: PirepStatus[d.status]
    }
  });
}

/*
;
*/

module.exports = {
  getActivePilotList,
  getPilotsLastFlight,
  getPilotList,
  getIvaoPilots,
  ORDER_BY_FLIGHTS,
  ORDER_BY_FLIGHT_TIME,
}