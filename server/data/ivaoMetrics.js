const { listIvaoFlight } = require("../db/mongo/ivaoTrackerDB")
const moment = require('moment');
const { getMetricsTotalByPireps, getMetricsGroupedByPilotByPireps } = require("../db/mysql/pirepsDB");
const { splitUserName } = require("../helpers/pilotHelper");

async function getIvaoMetrics(start, end) {
  const ivaoFlights = await listIvaoFlight(moment(start).startOf('day'), moment(end).endOf('day'));
  const pirepsList = ivaoFlights.map(d => d.pirep_id);
  const total = await getMetricsTotalByPireps(pirepsList);
  const grouped = await getMetricsGroupedByPilotByPireps(pirepsList);
  const allmetrics = [{
    id: 'total_flights',
    metric: total[0].flights
  }, {
    id: '_total_time',
    metric: total[0].total_time
  }];
  const groupedmetrics = grouped.map(g => ({
    id: g.id,
    name: splitUserName(g.name),
    metrics: [{
      id: 'total_flights',
      metric: g.flights
    }, {
      id: 'total_time',
      metric: g.total_time
    }]
  }));
  
  return {
    all: allmetrics,
    byPilot: groupedmetrics,
  };
}


module.exports = {
  getIvaoMetrics
}