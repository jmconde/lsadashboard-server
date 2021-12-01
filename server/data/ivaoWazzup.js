const axios = require('axios');
const url = 'https://api.ivao.aero/v2/tracker/whazzup';

const getIvaoWazzup = async () => {
  const response = await axios.get(url);
  return response.data;
};

module.exports = { getIvaoWazzup };