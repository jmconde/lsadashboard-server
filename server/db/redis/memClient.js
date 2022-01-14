const {
  LSA_REDIS_HOST,
  LSA_REDIS_PORT,
  LSA_REDIS_USER,
  LSA_REDIS_PASS,
} = process.env;

const MemcachePlus = require('memcache-plus')
var Memcached = require('memcached');

const getClient = () => {
  return new MemcachePlus(`${LSA_REDIS_HOST}:${LSA_REDIS_PORT}`, {});
}

async function get(key) {
  getClient().get(key);
}

async function set(key, value, options = {}){
  const { minutes = 5 * 60 } = options;
  return getClient().set(key, value, minutes);
}

async function getJSON(key) {
  const val = await get(key) || 'null';
  return JSON.parse(val);
}

async function setJSON(key, obj, options) {
  return set(key, JSON.stringify(obj), options);
}

module.exports = {
  get,
  getJSON,
  set,
  setJSON,
}