
const time = {};


time.getFileFormattedTimeToDay = () => { // YYYY-MM-DD (in UTC format)
  const year = new Date().getUTCFullYear();
  let month = (new Date().getUTCMonth()) + 1;
  let day = new Date().getUTCDate();
  month = (month<10) ? '0' + month : month;
  day = (day<10) ? '0' + day : day;
  return year + '-' + month + '-' + day;
  
}

time.getHourAndMinute = (format) => { // format === 'text'  ?  HH:MM  :  HH-MM (in UTC format)
  const separator = format === 'text' ? ':' : '-';
  let hour = new Date().getUTCHours();
  let minute = new Date().getUTCMinutes();
  hour = (hour<10) ? '0' + hour : hour;
  minute = (minute<10) ? '0' + minute : minute;
  return hour + separator + minute;
}



module.exports = time;