import { DateTime, Duration } from 'luxon';

/**
 * Converts a string key/value map into a querystring.
 * @param {object} query - An object containing properties whose values are strings. E.g.: { "a": "1", "b": "2" }.
 * @returns {string} The query, represented as a queryString. E.g.: "?a=1&b=2".
 */
const encodeQuery = (query) => {
  return Object
          .keys(query)
          .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(query[k]))
          .join('&')
};

export const http = {
  encodeQuery
};


/**
 * Formats a dateTimeString as a time value (HH:mm).
 * @param {string} dateTimeString - A date-time string. E.g.: '2019-10-28T07:20:00'.
 * @returns {string} A time string in the format 'HH:mm'. E.g.: '07:20'.
 */
const formatTime = (dateTimeString) => {
  if (isNaN(Date.parse(dateTimeString))) {
    return '';
  }

  let dateTime;
  try {
    dateTime = DateTime.fromFormat(dateTimeString, "yyyy-LL-dd'T'HH:mm:ss");
  } catch {
    return '';
  }

  if (!dateTime.isValid) {
    return '';
  }

  return dateTime.toFormat('HH:mm');
};

/**
 * Formats a date as a date string ('yyyy-mm-dd').
 * @param {Date} date - Date to format. E.g.: new Date(2019, 9, 24).
 * @returns {string} A date string in the appropriate format. E.g.: '2019-10-24'.
 */
const formatDate = (date) => {
  return DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');
};

/**
 * Formats a number of minutes as a duration (HHh mm).
 * @param {number} minutes - A number of minutes. E.g.: 90.
 * @returns {string} A duration string in the format 'HHh mm'. E.g.: '1h 30m'.
 */
const formatDuration = (minutes) => {
  if (!minutes || typeof minutes !== 'number' || isNaN(Number(minutes))) {
    return '';
  }

  const isLessThanAnHour = minutes < 60;
  if (isLessThanAnHour) {
    return minutes.toString();
  }

  const duration = Duration.fromObject({ minutes });

  const canBeExpressedInFullHours = (minutes % 60 === 0);
  if (canBeExpressedInFullHours) {
    return duration.toFormat("h'h'");
  }

  return duration.toFormat("h'h' mm");
};

/**
 * Gets the date on which next Monday falls.
 * @param {Date} date - The date from which to start. E.g. new Date(2019, 9, 24).
 * @returns {Date} The date on which the following Monday falls. E.g. new Date(2019, 9, 28).
 */
const getNextMonday = (date) => {
  const dateTime = DateTime.fromJSDate(date);
  if (dateTime.weekday === 1) {
    return dateTime.plus({ days: 7 }).toJSDate();
  }
  return dateTime.plus({ days: 7 }).startOf('week').toJSDate();
};

/**
 * Gets the next day.
 * @param {Date} date - The date from which to start. E.g. new Date(2019, 9, 24).
 * @returns {Date} The date on which the following day falls. E.g. new Date(2019, 9, 25).
 */
const getNextDay = (date) => {
  return DateTime.fromJSDate(date).plus({ days: 1 }).toJSDate();
};

export const dateTime = {
  formatTime,
  formatDate,
  formatDuration,
  getNextMonday,
  getNextDay
};


/**
 * Replaces a path with a different path in a path and filename.
 * @param {string} pathAndFilename - Full path including the filename. E.g. 'foo/bar.js'.
 * @returns {string} New path with same filename. E.g. 'baz/bar.js'.
 */
const replacePath = (pathAndFilename, newPath) => {
  const filename = pathAndFilename.split('/').slice(-1)[0];
  return `${newPath}/${filename}`;
};

const formatPriceAmount = (amount) => {
  return Number(amount).toFixed(2);
};

export const misc = {
  replacePath,
  formatPriceAmount
};