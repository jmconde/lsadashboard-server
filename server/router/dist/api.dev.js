"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../data/acars'),
    getAcarsRealTime = _require.getAcarsRealTime;

var orderedPilots = require('../data/pilots');

router.get('/acars', function _callee(req, res) {
  var data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(getAcarsRealTime());

        case 2:
          data = _context.sent;
          console.log('/acars');
          res.status(200).json(data);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.get('/pilots', function _callee2(req, res) {
  var data;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          console.log(1);
          _context2.next = 4;
          return regeneratorRuntime.awrap(orderedPilots());

        case 4:
          data = _context2.sent;
          console.log('/pilots');
          res.status(200).json(data);
          _context2.next = 12;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
module.exports = router;