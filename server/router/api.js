const express = require('express');
const router = express.Router();

const { getAcarsRealTime } = require('../data/acars');
const orderedPilots = require('../data/pilots');
const { getDailyTotalFlights } = require('../db/pilotsDB');

router.get('/acars', async (req, res) => {
  const data = await getAcarsRealTime();
  res.status(200).json(data);
});

router.get('/pilots', async (req, res) => {
  try {
    const data = await orderedPilots();

    res.status(200).json(data);
  }catch(err) {
    console.log(err);
  }
});

router.get('/daily-total-data', async (req, res) => {
  try {
    const data = await getDailyTotalFlights();
    res.status(200).json(data);
  } catch(err) {
    console.log(err);
  }
})

module.exports = router;