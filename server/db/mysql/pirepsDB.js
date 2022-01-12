const { query } = require('../mysqlPool');
const moment = require('moment');
const { PirepState } = require('../../helpers/enums');
const { PirepState: PirepStateFromDB, PirepStatus: PirepStatusFromDB  } = require('../../helpers/enumsFromDb');
const uniq = require('lodash/uniq');
const { getFormattedRange, getContinuosDateArray } = require('../../helpers/dateHelper');
const { getAirports } = require('./airportsDB');
const { getPilotList } = require('./pilotDB');
const { getAircraftList } = require('./aircraftsDB');

async function  getBestLandings() {
  const sql = `SELECT t1.created_at, CAST(t1.value as SIGNED) AS rate , t2.user_id, t3.name\
  FROM pirep_field_values as t1 LEFT JOIN pireps as t2 ON t1.pirep_id = t2.id LEFT JOIN users as t3 ON t2.user_id = t3.id\
  WHERE t2.state = ${PirepState.ACCEPTED} AND  t1.value <> '0' <> 0 AND t1.slug = 'landing-rate' AND t1.created_at BETWEEN '2021-11-01' AND '2021-11-30'\
  ORDER BY rate DESC LIMIT 3;`;

  return await query(sql);
}


async function getFlightsByDay(start, end) {
  const range = getFormattedRange(start, end);
  const datesArray = getContinuosDateArray(start, end);
  const sql = `SELECT 
      CAST(created_at AS DATE) AS date ,
      COUNT(*) as count
    FROM pireps 
    WHERE pireps.state = ${PirepState.ACCEPTED} AND created_at BETWEEN '${range[0]}' and '${range[1]}' 
    GROUP by date
    ORDER BY date;`
  const result = await query(sql);

  return datesArray.map((d) => {
    const day = d.split('-').pop();
    const f = result.find(x => moment(x.date).format('DD') === day);

    return {
      x: day,
      y: f ? f.count : 0
    };
  });
}


async function getTimeByDay(start, end) {
  const range = getFormattedRange(start, end);
  const datesArray = getContinuosDateArray(start, end);
  const sql = `SELECT 
      CAST(created_at AS DATE) AS date ,
      sum(pireps.flight_time) time
    FROM pireps 
    WHERE pireps.state = ${PirepState.ACCEPTED} AND created_at BETWEEN '${range[0]}' and '${range[1]}' 
    GROUP by date
    ORDER BY date;`
  const result = await query(sql);

  // result.forEach(d => console.log(moment(d.date).format('DD')))

  return datesArray.map((d) => {
    const day = d.split('-').pop();
    const f = result.find(x => moment(x.date).format('DD') === day);

    return {
      x: day,
      y: f ? f.time : 0
    };
  });
}


async function getFlightsByPilot(start, end) {
  const range = getFormattedRange(start, end);
  const sql = `SELECT 
      users.name,
      count(pireps.user_id) count
    FROM pireps
    LEFT JOIN users ON pireps.user_id = users.id
    WHERE pireps.state = ${PirepState.ACCEPTED} AND pireps.created_at BETWEEN '${range[0]}' and '${range[1]}' 
    GROUP BY pireps.user_id;`

  const result = await query(sql);
  return result.map((d) => {
    const splitted = d.name.split(' ');
    const name = splitted[0];
    const initial = splitted[1];
    d.name = `${name} ${initial ? initial.substring(0, 1).toUpperCase() : ''}`.trim();
    return { x: d.name, y: d.count};
  }).sort((a, b) => b.y - a.y);
}

async function getTimeByPilot(start, end) {
  const range = getFormattedRange(start, end);
  const sql = `SELECT 
      users.name,
      sum(pireps.flight_time) time
    FROM pireps
    LEFT JOIN users ON pireps.user_id = users.id
    WHERE pireps.state = ${PirepState.ACCEPTED} AND pireps.created_at BETWEEN '${range[0]}' and '${range[1]}' 
    GROUP BY pireps.user_id;`
  const result = await query(sql);
  return result.map((d) => {
    const splitted = d.name.split(' ');
    const name = splitted[0];
    const initial = splitted[1];
    d.name = `${name} ${initial ? initial.substring(0, 1).toUpperCase() : ''}`.trim();
    return { x: d.name, y: d.time};
  }).sort((a, b) => b.y - a.y);
}

async function getTotalFlights(start, end) {
  const range = getFormattedRange(start, end);
  const sql = `SELECT 
      count(*) as metric
    FROM pireps
    WHERE pireps.state = ${PirepState.ACCEPTED} AND pireps.created_at BETWEEN '${range[0]}' and '${range[1]}'`;

  const result = await query(sql);
  return result[0];
}
//SELECT u.id, u.name, SUM(p.flight_time) total_time FROM pireps AS p  RIGHT JOIN users as u ON p.user_id = u.id WHERE p.updated_at BETWEEN '2021-12-01' AND '2021-12-31' GROUP BY user_id;
//SELECT * FROM pireps WHERE status IN ('TXI', 'BST', 'OFB', 'FIN', 'TOF', 'ICL', 'TKO', 'ENR', 'DV', 'APR', 'TEN', 'FIN', 'LDG', 'LAN', 'ONB') AND state = 0 ORDER BY created_at DESC;

async function getMetrics(start, end) {
  const range = getFormattedRange(start, end);
  const sql = `SELECT 
      COUNT(*) as total_flights,
    SUM(flight_time) as total_time, 
      SUM(distance) as total_distance,
      AVG(flight_time) as avg_time,
      AVG(distance) as avg_distance
    FROM pireps
    WHERE pireps.state = ${PirepState.ACCEPTED} AND created_at BETWEEN '${range[0]}' AND '${range[1]}'`;
  const result = await query(sql);
  return Object.keys(result[0]).map(key => ({ id: key, metric: result[0][key] }));
}

async function getIvaoVIds() {
  const sql = `SELECT users.id as user, user_field_values.value as vid
    FROM users
    INNER JOIN user_field_values
      ON users.id = user_field_values.user_id WHERE user_field_id = 1`
    ;

  const result = await query(sql);
  return result;
};

async function getActiveFlights() {
  const sql = `SELECT p.id as pirep_id, ufv.value as ivao_vid, u.id as pilot_id, u.name AS user_name, CONCAT('LTS', p.flight_number) AS flight_number, p.flight_type, p.dpt_airport_id, p.arr_airport_id, 
  p.alt_airport_id, p.planned_distance, p.distance, p.flight_type, p.planned_flight_time, p.block_fuel, p.fuel_used, p.landing_rate, p.route, p.state, p.status,
  a.icao, a.registration, s.name
  FROM pireps AS p 
  INNER JOIN users AS u ON p.user_id = u.id
  INNER JOIN aircraft as a ON a.id = p.aircraft_id
  INNER JOIN subfleets AS s ON s.id = a.subfleet_id
  INNER JOIN user_field_values AS ufv ON u.id = ufv.user_id
  WHERE ufv.user_field_id = 1 AND p.status IN ('TXI', 'BST', 'OFB', 'FIN', 'TOF', 'ICL', 'TKO', 'ENR', 'DV', 'APR', 'TEN', 'FIN', 'LDG', 'LAN', 'ONB') AND p.state = ${PirepState.IN_PROGRESS}
  ORDER BY p.created_at DESC;`

  const result = await query(sql);
  return result;
}

async  function getPirepsByIds(pirepsIdArray) {
  const sql = `SELECT * FROM pireps AS p 
  INNER JOIN users AS u ON p.user_id = u.id
  WHERE p.id IN (${uniq(pirepsIdArray).map(id => `'${id}' `).join(',')}) AND p.state = ${PirepState.ACCEPTED};`

  const result = await query(sql);
  return result;
}

async  function getMetricsTotalByPireps(pirepsIdArray) {
  if (!pirepsIdArray.length) {
    return [];
  }
  const sql = `SELECT COUNT(*) as total_flights, SUM(p.flight_time) as total_time, 
  SUM(p.distance) as total_distance,
  AVG(p.flight_time) as avg_time,
  AVG(p.distance) as avg_distance
  FROM pireps AS p 
  INNER JOIN users AS u ON p.user_id = u.id
  WHERE p.id IN (${uniq(pirepsIdArray).map(id => `'${id}' `).join(',')}) AND p.state = ${PirepState.ACCEPTED};`

  const result = await query(sql);
  return result;
}

async function getMetricsGroupedByPilotByPireps(pirepsIdArray) {
  if (!pirepsIdArray.length) {
    return [];
  }
  const sql = `SELECT u.id, u.name, COUNT(*) as total_flights, SUM(p.flight_time) as total_time,
  SUM(p.distance) as total_distance,
  AVG(p.flight_time) as avg_time,
  AVG(p.distance) as avg_distance
  FROM pireps AS p 
  INNER JOIN users AS u ON p.user_id = u.id
  WHERE p.id IN (${uniq(pirepsIdArray).map(id => `'${id}' `).join(',')}) AND p.state = ${PirepState.ACCEPTED}
  GROUP BY u.name;`

  const result = await query(sql);
  return result;
}

async function getMetricsGroupedByDayByPireps(pirepsIdArray) {
  if (!pirepsIdArray.length) {
    return [];
  }
  const sql = `SELECT  DAY(p.created_at) as day,
  p.created_at,
  CONCAT(MONTH(p.created_at), '-', DAY(p.created_at)) as monthday,
  COUNT(*) as total_flights, 
  SUM(p.flight_time) as total_time,
  SUM(p.distance) as total_distance,
  AVG(p.flight_time) as avg_time,
  AVG(p.distance) as avg_distance
FROM pireps AS p 
  INNER JOIN users AS u ON p.user_id = u.id 
  WHERE p.id IN (${uniq(pirepsIdArray).map(id => `'${id}' `).join(',')}) AND p.state = ${PirepState.ACCEPTED}
  GROUP BY monthday ORDER BY day`

  const result = await query(sql);
  return result;
}

async function getLogFlights(start, end) {
  const airports =  await getAirports();
  const pilots = await getPilotList();
  const aircrafts = await getAircraftList();
  console.log(start, end);
  const range = getFormattedRange(start, end);
  console.log(range);
  const sql = `SELECT 
    p.id as pirepId, 
    ufv.value as vid, 
    u.id as pilotId, 
    u.name AS user_name, 
    CONCAT('LTS', p.flight_number) AS number, 
    p.flight_type AS type, 
    p.dpt_airport_id AS departure, 
    p.arr_airport_id AS arrival, 
    p.alt_airport_id AS alternate, 
    p.planned_distance AS plannedDistance, 
    p.distance, 
    p.flight_time AS time,
    p.planned_flight_time AS plannedTime,
    p.block_fuel AS blockFuel, 
    p.fuel_used AS usedFuel, 
    p.landing_rate as landingRate, 
    p.route, 
    p.state, 
    p.status,
    a.icao, 
    a.registration, 
    s.name,
    a.id as aircraftId,
    p.block_off_time AS blockOffTime,
    p.block_on_time AS blockOnTime
  FROM pireps AS p 
  INNER JOIN users AS u ON p.user_id = u.id
  INNER JOIN aircraft as a ON a.id = p.aircraft_id
  INNER JOIN subfleets AS s ON s.id = a.subfleet_id
  INNER JOIN user_field_values AS ufv ON u.id = ufv.user_id
  WHERE p.state = ${PirepState.ACCEPTED}
    AND p.created_at BETWEEN '${range[0]}' and '${range[1]}'
  ORDER BY p.block_off_time DESC;`
  const result = await query(sql);
  return result.map((d) => {
    return {  
      pilot: pilots.find(p => p.id === d.pilotId ),
      departure: airports[d.departure] ||  { id: d.departure },
      arrival: airports[d.arrival] || { id: d.arrival },
      alternate: d.alternate ? airports[d.alternate] || { id: d.alternate } : undefined,
      time: d.time,
      plannedTime: d.plannedTime,
      distance: d.distance,
      plannedDistance: d.plannedDistance,
      landingRate: d.landingRate,
      state: PirepStateFromDB[d.state],
      status: PirepStatusFromDB[d.status],
      pirepId: d.pirepId,
      number: d.number,
      type: d.type,
      blockFuel: d.blockFuel,
      usedFuel: d.usedFuel,
      route: d.route,
      aircraft: aircrafts[d.aircraftId],
      blockOffTime: moment(d.blockOffTime).format('YYYY-MM-DD HH:mm:ss'),
      blockOnTime: moment(d.blockOnTime).format('YYYY-MM-DD HH:mm:ss'),
    };
  });
}

module.exports = {
  getBestLandings,
  getFlightsByDay,
  getFlightsByPilot,
  getTotalFlights,
  getMetrics,
  getIvaoVIds,
  getActiveFlights,
  getPirepsByIds,
  getMetricsTotalByPireps,
  getMetricsGroupedByPilotByPireps,
  getMetricsGroupedByDayByPireps,
  getTimeByPilot,
  getTimeByDay,
  getLogFlights,
};

