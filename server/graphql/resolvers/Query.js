const { 
  getIvaoMetrics, 
  getIvaoNotInAirlineMetrics,
} = require('../../data/ivaoMetrics');
const { getAircraftList } = require('../../db/mysql/aircraftsDB');
const { getActivePilotList, getPilotList} = require('../../db/mysql/pilotDB');
const {
  getFlightsByDay, 
  getFlightsByPilot, 
  getTimeByPilot,
  getTimeByDay,
  getTotalFlights,
  getMetrics,
  getIvaoVIds,
  getLogFlights,
} = require('../../db/mysql/pirepsDB');

module.exports = {
  getFlightsByPilot: (parent, { start, end }) => getFlightsByPilot(start, end),
  getTimeByPilot: (parent, { start, end }) => getTimeByPilot(start, end),
  getFlightsByDay: (parent, { start, end }) => getFlightsByDay(start, end),
  getTotalFlights: (parent, { start, end }) => getTotalFlights(start, end),
  getTimeByDay: (parent, { start, end }) => getTimeByDay(start, end),
  getMetrics: (parent, { start, end }) => getMetrics(start, end),
  getIvaoVIds: () => getIvaoVIds(),
  getIvaoMetrics: (parent, { start, end }) => getIvaoMetrics(start, end),
  getIvaoNotInAirlineMetrics: (parent, { start, end }) => getIvaoNotInAirlineMetrics(start, end),
  getAircraftList: () => getAircraftList(),
  getActivePilotList: () => getActivePilotList(),
  getLogFlights: (parent, { start, end }) => getLogFlights(start, end),
}