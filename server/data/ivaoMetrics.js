const { listIvaoFlight } = require("../db/mongo/ivaoTrackerDB")
const moment = require('moment');
const { getMetricsTotalByPireps, getMetricsGroupedByPilotByPireps } = require("../db/mysql/pirepsDB");
const { splitUserName } = require("../helpers/pilotHelper");

const METRICS_FIELDS = ['total_flights' , 'total_time', 'total_distance', 'avg_time', 'avg_distance']

async function getIvaoMetrics(start, end) {
  const ivaoFlights = await listIvaoFlight(moment(start).startOf('day'), moment(end).endOf('day'));
  const pirepsList = ivaoFlights.map(d => d.pirep_id);
  const total = await getMetricsTotalByPireps(pirepsList);
  const grouped = await getMetricsGroupedByPilotByPireps(pirepsList);
  const allmetrics = total.length ? METRICS_FIELDS.map(key => ({ id: key, metric: total[0][key] })) : [];
  const groupedmetrics = grouped.map(g => ({
    id: g.id,
    name: splitUserName(g.name),
    metrics: g.length ? METRICS_FIELDS.map(key => ({ id: key, metric: g[key] })) : []
  }));

  return {
    all: allmetrics,
    byPilot: groupedmetrics,
  };
}


module.exports = {
  getIvaoMetrics
}