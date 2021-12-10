const { listIvaoFlight } = require("../db/mongo/ivaoTrackerDB")
const moment = require('moment');
const { getMetricsTotalByPireps, getMetricsGroupedByPilotByPireps, getMetricsGroupedByDayByPireps } = require("../db/mysql/pirepsDB");
const { splitUserName } = require("../helpers/pilotHelper");

const METRICS_FIELDS = ['total_flights' , 'total_time', 'total_distance', 'avg_time', 'avg_distance']

async function getIvaoMetrics(start, end) {
  const ivaoFlights = await listIvaoFlight(moment(start).utc().startOf('day'), moment(end).utc().endOf('day'));
  const pirepsList = ivaoFlights.map(d => d.pirep_id);
  const total = await getMetricsTotalByPireps(pirepsList);
  const groupedByPilot = await getMetricsGroupedByPilotByPireps(pirepsList);
  const groupedByDay = await getMetricsGroupedByDayByPireps(pirepsList);

  const allmetrics = total.length ? METRICS_FIELDS.map(key => ({ id: key, metric: total[0][key] })) : [];
  
  const groupedmetricsByPilot = groupedByPilot.map(g => ({
    id: g.id,
    name: splitUserName(g.name),
    metrics: g ? METRICS_FIELDS.map(key => ({ id: key, metric: g[key] })) : []
  }));
  const groupedmetricsByDay = groupedByDay.map((g, i) => ({
    id: i,
    name: String(100 + g.day).substring(1),
    metrics: g ? METRICS_FIELDS.map(key => ({ id: key, metric: g[key] })) : []
  }));

  return {
    all: allmetrics,
    byPilot: groupedmetricsByPilot,
    byDay: groupedmetricsByDay,
  };
}


module.exports = {
  getIvaoMetrics
}