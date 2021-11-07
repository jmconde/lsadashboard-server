const { start } = require('./server/server');
const task = require('./server/tasks/updatedataTask');

if (process.env.NODE_ENV !== 'development') {
    task();
}
start();