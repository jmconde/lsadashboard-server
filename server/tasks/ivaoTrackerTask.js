const cron = require('node-cron');
const { getIvaoWazzup } = require('../data/ivaoWazzup');
const { insertIvaoFlight } = require('../db/mongo/ivaoTrackerDB');
const { getIvaoVIds } = require("../db/mysql/pirepsDB");

const chalk = require('chalk');

async function task() {
  console.log(chalk `Executing ivao task at {cyan ${new Date()}} `);
  const vids = await getIvaoVIds();
  const v = vids.map(d => Number(d.vid));
  const ivaoData = await getIvaoWazzup();
  const active = ivaoData.clients.pilots.filter(d => v.includes(d.userId));

  for (let index = 0; index < active.length; index++) {
    const d = active[index];
    // const flight = await getIvaoFlight(id);
    // if (!flight) {
    await insertIvaoFlight(d);
  }
}

module.exports = function() {
 
  // task();

  cron.schedule('*/20 * * * * *', async() => {
      task();
  });
  console.log('Ivao task scheduled */20 * * * * *')
}