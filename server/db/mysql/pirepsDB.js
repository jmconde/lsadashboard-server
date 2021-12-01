const { getMysqlPool } = require('../mysqlPool');
const moment = require('moment');
const { getRangeDate } = require('../../helpers/dateHelper');
const { PirepState } = require('../../helpers/enums');
const format = 'YYYY-MM-DD HH:mm:ss'

const query = async (sql)  => {
  try {
    const pool = await getMysqlPool();
    return pool.query(sql);
  } catch(err) {
    console.log(err);
  }
}

async function  getBestLandings() {
  const sql = `SELECT t1.created_at, CAST(t1.value as SIGNED) AS rate , t2.user_id, t3.name\
  FROM pirep_field_values as t1 LEFT JOIN pireps as t2 ON t1.pirep_id = t2.id LEFT JOIN users as t3 ON t2.user_id = t3.id\
  WHERE t2.state = ${PirepState.ACCEPTED} AND  t1.value <> '0' <> 0 AND t1.slug = 'landing-rate' AND t1.created_at BETWEEN '2021-11-01' AND '2021-11-30'\
  ORDER BY rate DESC LIMIT 3;`;

  return await query(sql);
}


async function getFlightsByDayInMonth(date, unit) {
  const range = getRangeDate({date, unit});

  const sql = `SELECT 
      CAST(created_at AS DATE) AS date ,
      COUNT(*) as count
    FROM pireps 
    WHERE pireps.state = ${PirepState.ACCEPTED} AND created_at BETWEEN '${range[0]}' and '${range[1]}' 
    GROUP by date
    ORDER BY date;`
  const result = await query(sql);
  return result.map((d) => {
    d.day = moment(d.date).format('DD');
    return  {x: d.day, y: d.count};
  });
}


async function getFlightsByPilotInMonth(date, unit) {
  const range = getRangeDate({date, unit});

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

async function getTotalFlightsInMonth(date, unit) {
  const range = getRangeDate({date, unit});

  const sql = `SELECT 
      count(*) as metric
    FROM pireps
    WHERE pireps.state = ${PirepState.ACCEPTED} AND pireps.created_at BETWEEN '${range[0]}' and '${range[1]}'`;

  const result = await query(sql);
  return result[0];
}
//SELECT u.id, u.name, SUM(p.flight_time) total_time FROM pireps AS p  RIGHT JOIN users as u ON p.user_id = u.id WHERE p.updated_at BETWEEN '2021-12-01' AND '2021-12-31' GROUP BY user_id;

async function getMetrics(date, unit) {
  const range = getRangeDate({date, unit});
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
  const sql = `SELECT users.id, user_field_values.value as VID 
    FROM users
    INNER JOIN user_field_values
      ON users.id = user_field_values.user_id`;

  const result = await query(sql);
  return result.map(d => ({ user: d.id, vid: d.VID}));
};

module.exports = {
  getBestLandings,
  getFlightsByDayInMonth,
  getFlightsByPilotInMonth,
  getTotalFlightsInMonth,
  getMetrics,
  getIvaoVIds,
};

