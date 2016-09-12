import moment from 'moment-timezone';

export default () => {
  const currentTime = moment(new Date()).tz('Asia/Tokyo');

  if (currentTime.hour() > 19) {
    currentTime.add(1, 'day');
  }

  const result = {
    year: currentTime.year(),
    month: currentTime.month() + 1,
    day: currentTime.date(),
    // hour: currentTime.hour(),
    // minute: currentTime.minute(),
  };

  return result;
};
