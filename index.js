require('dotenv').config();

const { start } = require('./server/server');
const task = require('./server/tasks/updatedataTask');


console.log('process.env :>> ', process.env.ENVIRONMENT);
console.log('process.env :>> ', process.env.DATABASE);

task();
start();