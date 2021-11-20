"use strict";

var express = require('express');

var orderedPilots = require('./pilots');

var path = require('path');

var _require = require('express'),
    response = _require.response;

var port = 3100; //1419332340d1ac0b8c7921d2e38d763532b3d93e7f81382fd87356ac74347004877a5126bae6ef9de3a85f49b90e2426

function start() {
  var app = express();
  app.use(express["static"]('assets'));
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
  app.get('/', function (req, res) {
    res.render('index', {
      subject: 'Pug template engine',
      name: 'our template',
      link: 'https://google.com'
    });
  });
  app.get('/pilots2', function _callee(req, res) {
    var pilots;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(orderedPilots());

          case 3:
            pilots = _context.sent;
            console.log(pilots);
            res.render('all-leaderboard', {
              pilots: pilots
            });
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);
            console.error(_context.t0);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 8]]);
  });
  app.get('/pilots', function _callee2(req, res) {
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            res.set('Content-Type', 'text/html');
            _context2.t0 = res;
            _context2.t1 = Buffer;
            _context2.next = 5;
            return regeneratorRuntime.awrap(orderedPilots());

          case 5:
            _context2.t2 = _context2.sent;
            _context2.t3 = _context2.t1.from.call(_context2.t1, _context2.t2);

            _context2.t0.send.call(_context2.t0, _context2.t3);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
  app.listen(port, function () {
    console.log("Server listening at port ".concat(port));
  });
  return app;
}

module.exports = {
  start: start
};