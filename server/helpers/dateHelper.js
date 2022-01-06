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
  // console.log('dates to format', start, end);
  const firstDay = moment(start).startOf('day').format(DATE_FORMAT);
  const lastDay = moment(end).endOf('day').format(DATE_FORMAT);
  // console.log(' formatted', firstDay, lastDay);
  return [firstDay, lastDay];
}

const getContinuosDateArray = (start, end, allowAfterToday = false) => {
  const today = moment();
  const date = moment(start);
  const lastDay = moment(end);
  const arr = [];
  while((allowAfterToday || (!allowAfterToday && date.isSameOrBefore(today))) && date.isSameOrBefore(lastDay)) {
    arr.push(date.format('YYYY-MM-DD'));
    date.add(1, 'days');
  }
  return arr;
}


module.exports = {
  getFormattedRange,
  getMonthRange,
  getContinuosDateArray,
};