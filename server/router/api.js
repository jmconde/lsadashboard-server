const express = require('express');
const router = express.Router();

const { getAcarsRealTime } = require('../data/acars');
const orderedPilots = require('../data/pilots');
const { getDailyTotalFlights } = require('../db/mongo/pilotsDB');
const { getFlightsByDayInMonth, getFlightsByPilotInMonth } = require('../db/mysql/pirepsDB')

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
});

router.get('/monthly-flights-by-day/:month', async (req, res) => {
  try {
    const month = req.params.month;
    const data = await getFlightsByDayInMonth(Number(month));
    res.status(200).json(data);
  } catch(err) {
    console.log(err);
  }
});

router.get('/monthly-flights-by-pilot/:month', async (req, res) => {
  try {
    const month = req.params.month;
    const data = await getFlightsByPilotInMonth(Number(month));
    res.status(200).json(data);
  } catch(err) {
    console.log(err);
  }
})

module.exports = router;