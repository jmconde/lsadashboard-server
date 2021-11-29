"use strict";

var eta = require('eta');

var path = require('path');

var moment = require('moment');

var uniq = require('lodash/uniq');

var _require = require('../helpers/timeHelper'),
    sortPilots = _require.sortPilots;

var _require2 = require('../db/mongo/pilotsDB'),
    getLatests = _require2.getLatests;

var _require3 = require('../db/mongo/airportsDB'),
    insertAirport = _require3.insertAirport,
    getAirport = _require3.getAirport;

var _require4 = require('../db/mongo/dailyPositionsDB'),
    getLastDailyPositions = _require4.getLastDailyPositions;

var _require5 = require('./airports'),
    getAirportService = _require5.getAirport;

var _require6 = require('../decorators/pilotsDecorator'),
    decorateLeaderboard = _require6.decorateLeaderboard;

var _require7 = require(path.join(process.cwd(), 'package.json')),
    version = _require7.version;

moment.locale('en');

var orderedPilots = function orderedPilots() {
  var latestsLeaderboards, latest, prevPositions, lastUpdated, locations, airports, index, icao, airport, pilots;
  return regeneratorRuntime.async(function orderedPilots$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(getLatests());

        case 3:
          latestsLeaderboards = _context.sent;
          latest = latestsLeaderboards.latest.leaderboard.sort(sortPilots);
          _context.next = 7;
          return regeneratorRuntime.awrap(getLastDailyPositions());

        case 7:
          prevPositions = _context.sent;
          lastUpdated = latestsLeaderboards.latest.lastUpdated;
          locations = uniq(latest.map(function (d) {
            return d.location;
          }));
          airports = {};
          index = 0;

        case 12:
          if (!(index < locations.length)) {
            _context.next = 30;
            break;
          }

          icao = locations[index];
          _context.next = 16;
          return regeneratorRuntime.awrap(getAirport(icao));

        case 16:
          airport = _context.sent;

          if (airport) {
            _context.next = 26;
            break;
          }

          _context.next = 20;
          return regeneratorRuntime.awrap(getAirportService(icao));

        case 20:
          airport = _context.sent;
          airports[icao] = airport;
          _context.next = 24;
          return regeneratorRuntime.awrap(insertAirport(icao, JSON.parse(JSON.stringify(airport))));

        case 24:
          _context.next = 27;
          break;

        case 26:
          airports[icao] = airport.data;

        case 27:
          index++;
          _context.next = 12;
          break;

        case 30:
          _context.next = 32;
          return regeneratorRuntime.awrap(decorateLeaderboard(latest, prevPositions, airports));

        case 32:
          pilots = _context.sent;
          lastUpdated = moment(lastUpdated).utc().format('dddd MMMM Do YYYY [@] HH:mm:ss');
          return _context.abrupt("return", {
            pilots: pilots,
            lastUpdated: lastUpdated,
            // lastUpdated: `METAR UPDATED ${moment(lastUpdated).utc().format('DDHHmm[Z]')}`,
            version: version
          });

        case 37:
          _context.prev = 37;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);

        case 40:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 37]]);
};

module.exports = orderedPilots;