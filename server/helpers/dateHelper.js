const moment = require('moment');
const { DATE_FORMAT } = require('./constants');
const getMonthRange = (initMonth, endMonth)  => {
  const firstDay = moment().month(initMonth).startOf('month').format(DATE_FORMAT);
  const lastDay = moment().month(endMonth || initMonth).endOf('month');
  if (endMonth < initMonth) {
    lastDay.add(1, 'y');
  }

  return [firstDay, lastDay.format(DATE_FORMAT)];
};

const getFormattedRange = (start, end) => {
  const firstDay = moment(start).startOf('day').format(DATE_FORMAT);
  const lastDay = moment(end).endOf('day').format(DATE_FORMAT);
  return [firstDay, lastDay];
}


module.exports = {
  getFormattedRange,
  getMonthRange
};