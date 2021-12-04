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
  console.log('dates to format', start, end);
  const firstDay = moment(start).startOf('day').utc().format(DATE_FORMAT);
  const lastDay = moment(end).endOf('day').utc().format(DATE_FORMAT);
  console.log(' formatted', firstDay, lastDay);
  return [firstDay, lastDay];
}


module.exports = {
  getFormattedRange,
  getMonthRange
};