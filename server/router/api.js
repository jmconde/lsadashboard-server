const express = require('express');
const router = express.Router();

const { getAcarsRealTime } = require('../data/acars');
const orderedPilots = require('../data/pilots');

router.get('/acars', async (req, res) => {
  const data = await getAcarsRealTime()
  res.status(200).json(data);
});

router.get('/pilots', async (req, res) => {
  const data = await orderedPilots();
  res.status(200).json(data);
})

module.exports = router;