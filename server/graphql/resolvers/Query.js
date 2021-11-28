const {getFlightsByDayInMonth, getFlightsByPilotInMonth} = require('../../db/mysql/pirepsDB');

module.exports = {
  monthlyFlightsByPilot: (parent, args, { db }) => getFlightsByPilotInMonth(10),
  monthlyFlightsByDay: (parent, args, { db }) => getFlightsByDayInMonth(10)
}