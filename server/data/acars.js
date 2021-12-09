const axios = require('axios');
const { isEmpty } = require('lodash');
const { getIvaoFlightsByPireps } = require('../db/mongo/ivaoTrackerDB');
const url = 'https://crew.latinstreamingalliance.com/api/acars';

const getAcarsRealTime = async () => {
  const response = await axios.get(url);
  const acars = response.data;
  const pireps = acars.data.map(d => d.id);
  const ivaoFlights = await getIvaoFlightsByPireps(pireps);
  return {
    data: acars.data.map((a) => {
      a.isInIvao = !isEmpty(ivaoFlights.find(d => d.pirep_id === a.id));
      return a;
    })
  };
};

module.exports = { getAcarsRealTime };