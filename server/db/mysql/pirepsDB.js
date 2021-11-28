const { getMysqlPool } = require('../mysqlPool');
const moment = require('moment');
const format = 'YYYY-MM-DD HH:mm:ss'

const query = async (sql)  => {
  const pool = await getMysqlPool();
  return pool.query(sql);
}

async function  getBestLandings() {
  const sql = `SELECT t1.created_at, CAST(t1.value as SIGNED) AS rate , t2.user_id, t3.name\
  FROM pirep_field_values as t1 LEFT JOIN pireps as t2 ON t1.pirep_id = t2.id LEFT JOIN users as t3 ON t2.user_id = t3.id\
  WHERE t1.value <> '0' <> 0 AND t1.slug = 'landing-rate' AND t1.created_at BETWEEN '2021-11-01' AND '2021-11-30'\
  ORDER BY rate DESC LIMIT 3;`;

  return await query(sql);
}


async function getFlightsByDayInMonth(month) {
  const firstDay = moment().startOf('month').month(month).format(format);
  const lastDay = moment(firstDay).endOf('month').format(format);

  const sql = `SELECT 
      CAST(created_at AS DATE) AS date ,
      COUNT(*) as count
    FROM pireps 
    WHERE created_at BETWEEN '${firstDay}' and '${lastDay}' 
    GROUP by date
    ORDER BY date;`
  const result = await query(sql);
  return result.map((d) => {
    d.day = moment(d.date).format('DD');
    return  {x: d.day, y: d.count};
  });
}


async function getFlightsByPilotInMonth(month) {
  console.log('in getFlightsByDayInMonth');
  const firstDay = moment().startOf('month').month(month).format(format);
  const lastDay = moment(firstDay).endOf('month').format(format);

  const sql = `SELECT 
      users.name,
      count(pireps.user_id) count
    FROM pireps
    LEFT JOIN users ON pireps.user_id = users.id
    WHERE pireps.created_at BETWEEN '${firstDay}' and '${lastDay}' 
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

module.exports = {
  getBestLandings,
  getFlightsByDayInMonth,
  getFlightsByPilotInMonth
};

