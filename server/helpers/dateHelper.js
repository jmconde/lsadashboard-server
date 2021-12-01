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

const getRangeDate = ({date = new Date(), unit = 'month'} = {}) => {
  console.log(date, unit);
  const firstDay = moment(date).startOf(unit).format(DATE_FORMAT);
  const lastDay = moment(date).endOf(unit).format(DATE_FORMAT);
  
  console.log([firstDay, lastDay]);
  return [firstDay, lastDay];
}

module.exports = {
  getMonthRange,
  getRangeDate,
};