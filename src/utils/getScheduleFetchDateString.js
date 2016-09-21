import moment from 'moment-timezone';

export default () => {
  const currentTime = moment(new Date()).tz('Asia/Tokyo');

  if (currentTime.hour() > 19) {
    currentTime.add(1, 'day');
  }

  return currentTime.format('YYYYMMDD');
};
