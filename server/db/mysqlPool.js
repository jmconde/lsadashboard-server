const mysql = require('promise-mysql');

const config = {
    connectionLimit : 20,
    host     : '192.168.1.124',
    port     : 6033,
    user     : 'admin',
    password : 'admin',
    database : 'lsatest'
};

let pool; //bunyan for logger

async function getMysqlPool() {
  if (!pool) {
    pool = await mysql.createPool(config);
  }
  return pool;
}

module.exports = {
  getMysqlPool
};