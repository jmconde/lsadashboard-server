const axios = require('axios');
const { isEmpty } = require('lodash');
const { getIvaoFlightsByPireps } = require('../db/mongo/ivaoTrackerDB');
const url = 'https://crew.latinstreamingalliance.com/api/acars';
const geosonUrl =  (id) => `https://crew.latinstreamingalliance.com/api/pireps/${id}/acars/geojson`;

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

const getGeoson = async (pirepId) => {
  const response = await axios.get(geosonUrl(pirepId));
  return response.data
};

module.exports = { getAcarsRealTime, getGeoson };