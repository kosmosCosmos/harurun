export default (timeString) => {
  const validateRegex =  /^([0-9]?[0-9]):([0-5][0-9])~([0-9]?[0-9]):([0-5][0-9])$/;
  const matched = timeString.match(validateRegex);
  const result = {
    validated: false,
    data: {
      startHour: null,
      startMinute: null,
      endHour: null,
      endMinute: null,
      timezone: 9,
    }
  };

  if (!timeString) {
    // ignore the validate for the empty time
    result.validated = true;
    return result;
  }

  if (matched && matched.length === 5) {
    result.validated = true;
    result.data.startHour = matched[1];
    result.data.startMinute = matched[2];
    result.data.endHour = matched[3];
    result.data.endMinute = matched[4];
  }

  return result;
}