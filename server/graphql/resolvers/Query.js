const { getIvaoMetrics } = require('../../data/ivaoMetrics');
const {
  getFlightsByDayInMonth, 
  getFlightsByPilotInMonth, 
  getTotalFlightsInMonth,
  getMetrics,
  getIvaoVIds,
} = require('../../db/mysql/pirepsDB');

module.exports = {
  monthlyFlightsByPilot: (parent, { start, end }) => getFlightsByPilotInMonth(start, end),
  monthlyFlightsByDay: (parent, { start, end }) => getFlightsByDayInMonth(start, end),
  monthlyTotalFlights: (parent, { start, end }) => getTotalFlightsInMonth(start, end),
  getMetrics: (parent, { start, end }) => getMetrics(start, end),
  getIvaoVIds: () => getIvaoVIds(),
  getIvaoMetrics: (parent, { start, end }) => getIvaoMetrics(start, end),
}