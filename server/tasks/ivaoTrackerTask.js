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
  const inIvao = ivaoData.clients.pilots.filter(d => v.includes(d.userId));
  // console.log(activeFlights);
  for (let index = 0; index < inIvao.length; index++) {
    const ivaoTracking = inIvao[index];
    // console.log(ivaoTracking);
    const activeUserFlight = activeFlights.find(u => Number(u.ivao_vid) === ivaoTracking.userId);
    // console.log(activeUserFlight);
    ivaoTracking._uservms = activeUserFlight.pilot_id;
    await insertIvaoTracking(ivaoTracking);
    // console.log(ivaoTracking.flightPlan.departureId + ivaoTracking.flightPlan.arrivalId, activeUserFlight.dpt_airport_id + activeUserFlight.arr_airport_id);
    if (ivaoTracking.flightPlan.departureId + ivaoTracking.flightPlan.arrivalId === activeUserFlight.dpt_airport_id + activeUserFlight.arr_airport_id) {
      await insertIvaoFligth(ivaoTracking, activeUserFlight);
    }
  }
}

module.exports = function() {
 
  task();

  cron.schedule('*/20 * * * * *', async() => {
      task();
  });
  console.log('Ivao task scheduled */20 * * * * *')
}