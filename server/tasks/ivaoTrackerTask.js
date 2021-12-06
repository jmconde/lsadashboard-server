// require('dotenv').config();

const cron = require('node-cron');
const { getIvaoWazzup } = require('../data/ivaoWazzup');
const { insertIvaoFligth, insertIvaoTracking } = require('../db/mongo/ivaoTrackerDB');
const { getActiveFlights } = require("../db/mysql/pirepsDB");

const chalk = require('chalk');

async function task() {
  console.log(chalk `Executing ivao task at {cyan ${new Date()}} `);
  const activeFlights = await getActiveFlights();
  const v = activeFlights.map(d => Number(d.ivao_vid));
  const ivaoData = await getIvaoWazzup();
  const inIvao = ivaoData.clients.pilots.reduce((acc, d, i) => {
    if (v.includes(d.userId)) {
      acc.inAirline.push(d);
    } else if (d.callsign.startsWith('LTS')) {
      acc.notInAirline.push(d);
    } 

    return acc;
  }, {
    inAirline: [],
    notInAirline: []
  });
  
  for (let index = 0; index < inIvao.inAirline.length; index++) {
    const ivaoTracking = inIvao.inAirline[index];
    const activeUserFlight = activeFlights.find(u => Number(u.ivao_vid) === ivaoTracking.userId);
    ivaoTracking._uservms = activeUserFlight.pilot_id;
    await insertIvaoTracking(ivaoTracking);
    if (ivaoTracking.flightPlan.departureId + ivaoTracking.flightPlan.arrivalId === activeUserFlight.dpt_airport_id + activeUserFlight.arr_airport_id) {
      await insertIvaoFligth(ivaoTracking, activeUserFlight);
    }
  }

  for (let index = 0; index < inIvao.notInAirline.length; index++) {
    const ivaoTracking = inIvao.notInAirline[index];
    await insertIvaoTracking(ivaoTracking, true);
  }
}

module.exports = function() {
 
  task();

  cron.schedule('*/20 * * * * *', async() => {
      task();
  });
  console.log('Ivao task scheduled */20 * * * * *')
}