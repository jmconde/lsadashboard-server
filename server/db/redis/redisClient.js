const {
  LSA_REDIS_HOST,
  LSA_REDIS_PORT,
  LSA_REDIS_USER,
  LSA_REDIS_PASS,
} = process.env;

var Memcached = require('memcached');
// // var memcached = new Memcached('localhost:11211', {});

// try {
//   memcached.set('testvalue', 'asasasasas', 10000, function (err) {
//     console.log('value set');
    

//     memcached.get('testvalue', (err, data) => {
//       console.log(data);
//     })
//   });
// } catch (err) {
//   console.log(err);
// }


// var { Client } = require('memjs');


const getClient = () => {
  return new Memcached(`${LSA_REDIS_HOST}:${LSA_REDIS_PORT}`, {});
}

async function get(key) {
  return new Promise((resolve, reject) => {
    getClient().get(key, (err, value) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(value);
    });
  });
}

async function getJSON(key) {
  const val = await get(key) || 'null';
  return JSON.parse(val);
}

async function set(key, value, options =  {}){
  return new Promise((resolve, reject) => {
    const { minutes = 5  } = options;
    getClient().set(key, value, minutes * 60, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });  
  });  
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