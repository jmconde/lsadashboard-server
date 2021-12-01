const {
  getFlightsByDayInMonth, 
  getFlightsByPilotInMonth, 
  getTotalFlightsInMonth,
  getMetrics,
  getIvaoVIds,
} = require('../../db/mysql/pirepsDB');

module.exports = {
  monthlyFlightsByPilot: (parent, { date, unit }) => getFlightsByPilotInMonth(date, unit),
  monthlyFlightsByDay: (parent, { date, unit }) => getFlightsByDayInMonth(date, unit),
  monthlyTotalFlights: (parent, { date, unit }) => getTotalFlightsInMonth(date, unit),
  getMetrics: (parent, { date, unit }) => getMetrics(date, unit),
  getIvaoVIds: () => getIvaoVIds()
}