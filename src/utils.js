const TIME_FORMAT_DIVIDER = 10;
const DATE_FORMAT_DIVIDER = 11;
const HOURS_AMOUNT = 12;

const chooseTimeFormat = (value) => {
  return value < TIME_FORMAT_DIVIDER ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = chooseTimeFormat(date.getHours() % HOURS_AMOUNT);
  const minutes = chooseTimeFormat(date.getMinutes());
  const interval = date.getHours() > DATE_FORMAT_DIVIDER ? `pm` : `am`;

  return `${hours}:${minutes} ${interval}`;
};

export {formatTime};
