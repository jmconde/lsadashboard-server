const axios = require('axios');
const url = 'https://crew.latinstreamingalliance.com/api/acars';

const getAcarsRealTime = async () => {
  const response = await axios.get(url);
  return response.data;
};

module.exports = { getAcarsRealTime };