require('dotenv').config();

const { start } = require('./server/server');
const dataTask = require('./server/tasks/updatedataTask');
const ivaoTask = require('./server/tasks/ivaoTrackerTask');

dataTask();
ivaoTask();
start();