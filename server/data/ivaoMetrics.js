const { listIvaoFlight, getIvaoFlightsNotInAirline } = require("../db/mongo/ivaoTrackerDB")
const moment = require('moment');
const { getMetricsTotalByPireps, getMetricsGroupedByPilotByPireps, getMetricsGroupedByDayByPireps } = require("../db/mysql/pirepsDB");
const { splitUserName } = require("../helpers/pilotHelper");
const { getIvaoPilots } = require("../db/mysql/pilotDB");

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

async function getIvaoNotInAirlineMetrics(start, end) { // TODO: Refactor
  const ivaoPilots = await getIvaoPilots();
  const flights = await getIvaoFlightsNotInAirline(moment(start).utc().startOf('day'), moment(end).utc().endOf('day'));
  // console.log(ivaoVids);//splitUserName
  
  const data = flights.reduce((acc, val) => {
    const ivaoPilot = ivaoPilots.find(d => Number(d.vid) === val.userId);
    const _date = moment(val.date);
    const monthDay = _date.format('MM-DD');
    const day = _date.format('DD');
    if (ivaoPilot) {
      acc.registered++;

      if (!acc.pilots[ivaoPilot.vid]) {
        acc.pilots[ivaoPilot.vid] = {
          id: ivaoPilot.id,
          name: splitUserName(ivaoPilot.name),
          count: 0,
          data: []
        }
      }
      if (!acc.days[monthDay]) {
        acc.days[monthDay] = {
          id: monthDay,
          name: day,
          count: 0,
          // data: []
        }
      }
      acc.pilots[ivaoPilot.vid].count++;
      acc.days[monthDay].count++;
      acc.pilots[ivaoPilot.vid].data.push(`${val.id} - ${moment(val.date).format('MM-DD')} - ${val.flightPlan.departureId} - ${val.flightPlan.arrivalId} - ${val.lastTrack.state}`)
    } else {
      acc.unregistered++;
    }
    
    return acc;
  }, {
    registered: 0,
    unregistered: 0,
    pilots: {},
    days: {}
  });
  return {
    all: [{id: 'total_flights', metric: data.registered}, { id: 'total_flights_unregisterd', metric: data.unregistered }],
    byPilot: Object.keys(data.pilots).map((key) => {
      const {id, name, count} = data.pilots[key];
      return {
        id,
        name,
        metrics: [{id: 'total_flights', metric: count}]        
      };
    }),
    byDay: Object.keys(data.days).map((key, i) => {
      const {id, name, count} = data.days[key];
      return {
        id: i,
        name,
        metrics: [{id: 'total_flights', metric: count}]        
      };
    }),
  };
}


module.exports = {
  getIvaoMetrics,
  getIvaoNotInAirlineMetrics,
}